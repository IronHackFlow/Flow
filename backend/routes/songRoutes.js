const express = require('express')
const axios = require('axios')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const sign_s3 = require('../sign_s3')
const Songs = require('../models/Songs')
const User = require('../models/User')

router.post(`/addSongRT`, verifyJWT, async (req, res, next) => {
  const songData = req.body.currentSong
  const awsURL = req.body.awsURL

  const song = {
    song_URL: awsURL,
    song_user: songData.song_user,
    video: songData.video,
    date: songData.date,
    duration: songData.duration,
    name: songData.name,
    lyrics: songData.lyrics,
    song_PBR: songData.song_PBR,
    song_BPM: null,
    caption: songData.caption,
    song_beattrack: songData.song_beattrack,
  }

  await Songs.create(song)
    .then(song => {
      res.status(200).json({ success: true, song: song, message: "Your song was successfully uploaded!" })
    })
    .catch(err => res.json({ success: false, error: err, message: "Unable to create new song"}))

})
  
// router.post(`/addSongRT`, verifyJWT, sign_s3, async (req, res, next) => {
//   const songData = req.signedRequest.currentSong
//   const signedURL = req.signedRequest.signedURL
//   const bucketURL = req.signedRequest.bucketURL
//   const options = req.signedRequest.options
//   const songFile = req.body.fileBlob
//   console.log(req.body.fileBlob, "FUCK YOU OK FUCK OFF YOU SON OF  ")
//   axios.put(signedURL, songFile, options)
//     .then(async result => {
//       const song = {
//         song_URL: bucketURL,
//         song_user: songData.song_user,
//         video: songData.video,
//         date: songData.date,
//         duration: songData.duration,
//         name: songData.name,
//         lyrics: songData.lyrics,
//         song_PBR: songData.song_PBR,
//         song_BPM: null,
//         caption: songData.caption,
//         song_beattrack: songData.song_beattrack,
//       }

//       await Songs.create(song)
//         .then(song => {
//           res.status(200).json(song)
//         })
//         .catch(err => res.json({ success: false, error: err, message: "Unable to create new song"}))
//     })
//     .catch(err => {
//       res.json({success: false, error: err, message: "Unable to axios PUT signedURL"})
//     })
// })
  
router.post(`/deleteSongRT`, verifyJWT, async (req, res, next) => {
  const body = req.body.song

  if (body.song_user._id === req.user._id) {
    await Songs.findOneAndDelete({ _id: body._id })
      .then(res.status(200).json({ message: "Deleted" }))
      .catch(err => next(err));
  } else {
    console.log("Can't delete due to User not being the songUser")
  }
})

router.post(`/getSongRT`, async (req, res, next) => {
  await Songs.findById(req.body.id)
    .populate('song_user')
    .populate('song_likes')
    .then(song => {
      res.status(200).json(song)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getUserSongsRT`, async (req, res, next) => {
  const body = req.body
  await Songs.find({ song_user: body.song_user })
    .populate('song_user')
    .populate({ path: 'song_comments', populate: 'user' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})
  
router.post(`/getUserFollowsSongsRT`, verifyJWT, async (req, res, next) => {
  let followers = []
  await User.findById(req.user._id)
    .populate('user_follows')
    .then(user => {
      user.user_follows.forEach(each => {
        followers.push(each.followed_user)
      })
    })
    .catch(err => next(err))

  await Songs.find({ song_user: followers })
    .populate('song_user')
    .then(songs => {
      // songs.forEach(each => console.log(each.songName))
      res.status(200).json(songs)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post(`/getMostLikedSongsRT`, async (req, res, next) => {
  const songs = await Songs.find({})
    .populate('song_likes')
    .populate({ 
      path: 'song_comments', 
      populate: [{ path: 'user' }, { path: 'likes' }]
    })
    .populate({ path: 'song_user', populate: 'followers' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router