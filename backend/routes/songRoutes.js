const express = require('express')
const axios = require('axios')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const sign_s3 = require('../sign_s3')
const Songs = require('../models/Songs')
const User = require('../models/User')

router.post(`/addSong`, verifyJWT, async (req, res, next) => {
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
      res
        .status(200)
        .json({ success: true, song: song, message: 'Your song was successfully uploaded!' })
    })
    .catch(err => res.json({ success: false, error: err, message: 'Unable to create new song' }))
})

router.post(`/deleteSong`, verifyJWT, async (req, res, next) => {
  const body = req.body.song

  if (body.song_user._id === req.user._id) {
    await Songs.findOneAndDelete({ _id: body._id })
      .then(res.status(200).json({ message: 'Deleted' }))
      .catch(err => next(err))
  } else {
    console.log("Can't delete due to User not being the songUser")
  }
})

router.get(`/getAllSongs`, async (req, res, next) => {
  const songs = await Songs.find({})
    .populate('song_likes')
    .populate({
      path: 'song_comments',
      populate: [{ path: 'user' }, { path: 'likes' }],
    })
    .populate({ path: 'song_user', populate: 'followers' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getUserSongs`, async (req, res, next) => {
  const body = req.body
  await Songs.find({ song_user: body.song_user })
    .populate('song_user')
    .populate({ path: 'song_comments', populate: 'user' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router
