const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const User = require('../models/User')

router.post(`/signUp`, async (req, res, next) => {
  const user = req.body

  const takenUserName = await User.findOne({ userName: user.userName.toLowerCase() })
  const takenEmail = await User.findOne({ email: user.email.toLowerCase() })

  if (takenUserName || takenEmail) {
    res.status(400).json({ message: "Username or email has already been taken" })
  } else {
    user.password = await bcrypt.hash(req.body.password, 10)

    const dbUser = {
      userName: user.userName.toLowerCase(),
      email: user.email.toLowerCase(),
      password: user.password,
      picture: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
    }
    const newUser = User.create(dbUser)
    res.status(200).json({message: "Success"})
  }
})
  
router.post(`/logIn`, async (req, res, next) => {
  const userLoggingIn = req.body

  User.findOne({ userName: userLoggingIn.userName.toLowerCase() })
    .select('+password')
    .then(dbUser => {
      if (!dbUser) {
        return res.status(400).json({ message: "Invalid Username or Password" })
      }
      bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
          if (isCorrect) {
            const payload = {
              _id: dbUser._id,
              userName: dbUser.userName
            }
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              {expiresIn: 86400},
              (err, token) => {
                if (err) return res.json({ message: err })
                else {
                  return res.json({
                    message: "Success",
                    token: token
                  })
                }
              }
            )
          } else {
            return res.status(400).json({ message: "Invalid Username or Password"})
          }
        })
    })
})

router.post(`/logInGoogle`, async (req, res, next) => {
  const tokenId = req.header('X-Google-Token')
  console.log(tokenId, "google token")
  if (!tokenId) {
    res.status(401).json({ msg: 'Mising Google JWT' })
  }
  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURI(tokenId)}`,
  )
  const { email, 
          email_verified, 
          picture, 
          given_name, 
          family_name, 
          error_description 
  } = googleResponse.data
  
  if (!email || error_description) {
    res.status(400).json({ msg: error_description })
  } else if (!email_verified) {
    res.status(401).json({ msg: 'Email not verified with google' })
  }
  
  const emailToUserName = (email) => {
    const allCharsBeforeAt = /^.*?(?=\@)/gm
    const validChars = /[a-zA-Z0-9]/gm
    let splitEmail = email.match(allCharsBeforeAt)
    let userName = splitEmail[0].match(validChars).join('')
    return userName
  }
  
  const userData = {
    email,
    password: `thisisnotvalid`,
    userName: emailToUserName(email),
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
  
  const payload = {
    _id: user._id,
    userName: user.userName
  }
  
  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
    if (err) return res.json({ message: err })
    else {
      return res.json({
        message: "Success",
        token: token
      })
    }
  })
})

router.get(`/isUserAuth`, verifyJWT, (req, res, next) => {
  User.findById(req.user._id)
    .populate('user_follows')
    .populate('user_likes')
    .then(user => {
      console.log(user, "this user is authorized")
      res.status(200).json({ isLoggedIn: true, user })
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/addUserProfRT`, verifyJWT, async (req, res, next) => {
  const body = req.body
  await User.findByIdAndUpdate(req.user._id, body)
    .then(ppl => {
      res.status(200).json(ppl)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router