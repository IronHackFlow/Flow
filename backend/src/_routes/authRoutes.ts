import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyJWT } from '../middleware/verifyToken'
import { IUserRequest } from '../interfaces/IUserRequest'
import { IUserDocument, User } from '../_models/User'
import { signJwt } from '../utils/jwt'
import { registerValidation, logInValidation } from '../utils/validation'
import handleRefreshAccessToken from '../controllers/refreshToken.controller'

const router = Router()

router.post(`/signUp`, async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username.toLowerCase()
  const email = req.body.email.toLowerCase()
  let password = req.body.password

  const takenUsername = await User.findOne({ username: username })
  const takenEmail = await User.findOne({ email: email })

  if (takenUsername || takenEmail) {
    return res.json({
      success: false,
      path: 'username',
      message: 'username or email has already been taken',
    })
  } else {
    password = await bcrypt.hash(password, 10)

    const dbUser = {
      username: username,
      email: email,
      password: password,
      picture: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
    }
    const newUser = await User.create(dbUser)
    res.status(200).json({ success: true, message: 'user has signed up successfully' })
  }
})

router.post(`/logIn`, async (req: Request, res: Response, next: NextFunction) => {
  let userToLower = req.body.username.toLowerCase()
  const logInUser = {
    username: userToLower,
    password: req.body.password,
  }
  console.log(logInUser, "lets see what i'm getting here")
  const { error } = logInValidation(logInUser)
  if (error) return res.json({ success: false, message: error.details[0].message })

  await User.findOne({ username: logInUser.username })
    .select('+password')
    .then((dbUser: any) => {
      if (!dbUser) {
        return res.json({ success: false, path: 'username', message: 'invalid username or email' })
      }

      bcrypt.compare(logInUser.password, dbUser.password).then((isCorrect: any) => {
        if (isCorrect) {
          const payload = { username: dbUser.username }

          // const secret = process.env.JWT_SECRET
          // if (!secret) return

          // jwt.sign(payload, secret, { expiresIn: 86400 }, (err: any, token: any) => {
          //   if (err)
          //     return res.json({ success: false, error: err, message: "couldn't create token" })
          //   else {
          //     return res.json({
          //       success: true,
          //       message: 'user has successfully logged in',
          //       token: token,
          //     })
          //   }
          // })
          const accessToken = signJwt(payload, 'accessTokenPrivateKey')

          const refreshToken = signJwt(payload, 'refreshTokenPrivateKey')

          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000,
          })

          return res.json({ accessToken: accessToken })
        } else {
          return res.json({ success: false, path: 'password', message: 'password is incorrect' })
        }
      })
    })
})

router.get('/refresh', handleRefreshAccessToken)

router.post(`/logInGoogle`, async (req: Request, res: Response, next: NextFunction) => {
  const tokenId: string | undefined = req.header('X-Google-Token')
  console.log(tokenId, 'google token')

  if (tokenId != null) {
    res.json({ success: false, message: 'missing Google token' })
  }

  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURI(tokenId!)}`,
  )
  const { email, email_verified, picture, given_name, family_name, error_description } =
    googleResponse.data

  if (!email || error_description) {
    res.json({
      success: false,
      error: error_description,
      message: 'error awaiting response from Google',
    })
  } else if (!email_verified) {
    res.json({ success: false, message: 'email not verified with Google' })
  }

  const emailToUserName = (email: string) => {
    const allCharsBeforeAt = /^.*?(?=\@)/gm
    const validChars = /[a-zA-Z0-9]/gm
    let splitEmail: Array<string> | null = email.match(allCharsBeforeAt)
    if (splitEmail != null) {
      let username = splitEmail[0]!.match(validChars)!.join('')
      return username
    }
  }

  const userData = {
    email,
    password: `thisisnotvalid`,
    username: emailToUserName(email),
    email_verified,
    picture,
    given_name,
    family_name,
    error_description,
    googleId: req.body.googleId,
  }

  let user = await User.findOne({ email })
  if (!user) {
    user = await User.create(userData)
  }
  console.log(user, 'what could go wrong herre??')
  const payload = {
    _id: user._id,
    username: user.username,
  }
  const secret = process.env.JWT_SECRET
  if (!secret) return
  jwt.sign(payload, secret, { expiresIn: 86400 }, (err: any, token: any) => {
    if (err) return res.json({ success: false, error: err, message: "couldn't verify token" })
    else {
      return res.json({
        success: true,
        message: 'Success',
        token: token,
      })
    }
  })
})

router.get(`/getAuthUser`, verifyJWT, (req: IUserRequest, res: Response, next: NextFunction) => {
  // console.log(req, 'what the fuck, why this not working now???')
  const cookies = req.cookies
  console.log(req, 'lets take a look at this')

  User.findOne({ username: req.user.username })
    .then((user: IUserDocument) => {
      if (user) {
        console.log(user._id, user.username, 'this user is authorized')
      }
      res.status(200).json(user)
    })
    .catch((err: any) =>
      res.status(500).json({ success: false, error: err, message: 'Could not authorize user' }),
    )
})

// router.post(`/updateUserProfile`, verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
//   const body = req.body

//   await User.findByIdAndUpdate(req.user._id, body, { new: true })
//     .then((user: any) => {
//       res.status(200).json(user)
//     })
//     .catch((err: any) => res.status(500).json(err))
// })

// module.exports = router
export default router
