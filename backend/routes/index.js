const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const router = express.Router()
const cors = require('cors')
const verifyJWT = require('./verifyToken')
const User = require('../models/User')
const Songs = require('../models/Songs')
const Likes = require('../models/Likes')


router.post(`/getAUserRT`, async (req, res, next) => {
  console.log('Grabbing a user: ', req.body)
  await User.findById(req.body.id)
    .populate('followers')
    .populate('userFollows')
    .then(user => {
      console.log(user, "ugh")
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json(err))
})

//search bar bobby
router.post('/getManySongsAndUsersRT', async (req, res, next) => {
  let searchData = { user: "", songs: "" }

  await User.find({ user_name: { $regex: req.body.search, $options: '$i' } })
    .then(user => {
      searchData.user = user
      console.log('yo its ya boi' + user)
    })
    .catch(err => res.status(500).json(err))

  await Songs.find({ name: { $regex: req.body.search, $options: '$i' } })
    .populate('song_user')
    .then(songs => {
      searchData.songs = songs
      console.log('yo its ya boi 2' + songs)
    })
    .catch(err => res.status(500).json(err))

  res.status(200).json(searchData)
})

var aws = require('aws-sdk')
require('dotenv').config()
// Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-west-1', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  signatureVersion: 'v4'
})

const S3_BUCKET = process.env.Bucket

// Now lets export this function so we can call it from somewhere else
// exports.sign_s3 = (req,res) => {
router.post('/sign_s3', verifyJWT, (req, res) => {
  const s3 = new aws.S3() // Create a new instance of S3
  const fileName = req.body.fileName
  const fileType = req.body.fileType
  const file = req.body.file
  const kind = req.body.kind
  console.log(fileName, "COME ON MANC")
  // Set up the payload of what we are sending to the S3 api

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 3000,
    ContentType: fileType,
    ACL: 'public-read',
  }

  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, async (err, data) => {
    if (err) return res.json({ message: err })
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    }
    console.log(returnData, "am ig etting anything here????????")

    if (kind == 'song') {
      // Songs.create(  PASS IN DATA  )
    } else if (kind == 'profilePic') {
      // User.update (  PASS IN DATA  )
    } else if (kind == 'beatTrack') {
      // Beats.create(  PASS IN DATA  )
    }
    res.json(returnData)
  })
})
// router.post('/sign_s3', verifyToken, (req, res) => {
//   let incoming = req.body

//   jwt.verify(req.token, 'secretkey', async (err, authData) => {
//     if (err) {
//       res.status(403).json(err)
//     } else {
//       const s3 = new aws.S3() // Create a new instance of S3
//       const fileName = req.body.fileName
//       const fileType = req.body.fileType
//       const file = req.body.file
//       const kind = req.body.kind

//       // Set up the payload of what we are sending to the S3 api
//       const s3Params = {
//         Bucket: S3_BUCKET,
//         Key: fileName,
//         Expires: 3000,
//         ContentType: fileType,
//         ACL: 'public-read',
//       }
//       // Make a request to the S3 API to get a signed URL which we can use to upload our file
//       s3.getSignedUrl('putObject', s3Params, async (err, data) => {
//         if (err) {
//           console.log(err)
//           res.json({ error: err })
//         }
//         // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
//         const returnData = {
//           signedRequest: data,
//           url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
//         }

//         if (kind == 'song') {
//           // Songs.create(  PASS IN DATA  )
//         } else if (kind == 'profilePic') {
//           // User.update (  PASS IN DATA  )
//         } else if (kind == 'beatTrack') {
//           // Beats.create(  PASS IN DATA  )
//         }
//         res.json({ data: { returnData } })
//       })
//     }
//   })
// })

module.exports = router
