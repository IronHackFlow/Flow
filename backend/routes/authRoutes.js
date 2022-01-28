const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const { registerValidation, logInValidation } = require('../validation')
const User = require('../models/User')

router.post(`/signUp`, async (req, res, next) => {
  const userName = req.body.user_name.toLowerCase()
  const email = req.body.email.toLowerCase()
  let password = req.body.password
  console.log(userName, email, password, "are these legit values??")
  const takenUserName = await User.findOne({ user_name: userName })
  const takenEmail = await User.findOne({ email: email })

  if (takenUserName || takenEmail) {
    return res.json({ success: false, path: "user_name", message: "username or email has already been taken" })
  } else {
    password = await bcrypt.hash(password, 10)

    const dbUser = {
      user_name: userName,
      email:email,
      password: password,
      picture: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`
    }
    const newUser = await User.create(dbUser)
    res.status(200).json({success: true, message: "user has signed up successfully"})
  }
})
  
router.post(`/logIn`, async (req, res, next) => {
  let userToLower = req.body.user_name.toLowerCase()
  const logInUser = { 
    user_name: userToLower,
    password: req.body.password 
  }
  console.log(logInUser, "lets see what i'm getting here")
  const { error } = logInValidation(logInUser)
  if (error) return res.json({ success: false, message: error.details[0].message })

  await User.findOne({ user_name: logInUser.user_name })
    .select('+password')
    .then(dbUser => {

      if (!dbUser) {
        return res.json({ success: false, path: "user_name", message: "invalid username or email" })
      }
      bcrypt.compare(logInUser.password, dbUser.password)
        .then(isCorrect => {
          if (isCorrect) {
            const payload = {
              _id: dbUser._id,
              user_name: dbUser.user_name
            }
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              {expiresIn: 86400},
              (err, token) => {
                if (err) return res.json({ success: false, error: err, message: "couldn't create token" })
                else {
                  return res.json({
                    success: true,
                    message: "user has successfully logged in",
                    token: token
                  })
                }
              }
            )
          } else {
            return res.json({ success: false, path: "password", message: "password is incorrect"})
          }
        })
    })
})

router.post(`/logInGoogle`, async (req, res, next) => {
  const tokenId = req.header('X-Google-Token')
  console.log(tokenId, "google token")

  if (!tokenId) {
    res.json({ success: false, message: 'missing Google token' })
  }

  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURI(tokenId)}`,
  )
  const { 
    email, 
    email_verified, 
    picture, 
    given_name, 
    family_name, 
    error_description 
  } = googleResponse.data
  
  if (!email || error_description) {
    res.json({ success: false, error: error_description, message: "error awaiting response from Google" })
  } else if (!email_verified) {
    res.json({ success: false, message: 'email not verified with Google' })
  }
  
  const emailToUserName = (email) => {
    const allCharsBeforeAt = /^.*?(?=\@)/gm
    const validChars = /[a-zA-Z0-9]/gm
    let splitEmail = email.match(allCharsBeforeAt)
    let user_name = splitEmail[0].match(validChars).join('')
    return user_name
  }
  
  const userData = {
    email,
    password: `thisisnotvalid`,
    user_name: emailToUserName(email),
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
  console.log(user, "what could go wrong herre??")
  const payload = {
    _id: user._id,
    user_name: user.user_name
  }
  
  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
    if (err) return res.json({ success: false, error: err, message: "couldn't verify token" })
    else {
      return res.json({
        success: true,
        message: "Success",
        token: token
      })
    }
  })
})

router.get(`/isUserAuth`, verifyJWT, (req, res, next) => {
  User.findOne({ _id:  req.user._id })
    .populate('user_follows')
    .populate('user_likes')
    .then(user => {
      console.log(user, "this user is authorized")
      res.status(200).json({ success: true, isLoggedIn: true, user })
    })
    .catch(err => res.status(500).json({ success: false, error: err, message: "Could not authorize user"}))
})

router.post(`/addUserProfRT`, verifyJWT, async (req, res, next) => {
  const body = req.body
  await User.findByIdAndUpdate(req.user._id, body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router