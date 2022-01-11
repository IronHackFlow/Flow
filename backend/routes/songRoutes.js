const express = require('express')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const Songs = require('../models/Songs')

router.post(`/addSongRT`, verifyJWT, async (req, res, next) => {
  let song = {
    songURL: req.body.songURL,
    songUser: req.body.songUser,
    songBG: req.body.songBG,
    songDate: req.body.songDate,
    songDuration: req.body.songDuration,
    songName: req.body.sssongName,
    songLyricsStr: req.body.songLyricsStr,
    songPBR: req.body.songPBR,
    songBPM: null,
    songTotLikes: req.body.songTotLikes,
    songCaption: req.body.songCaption,
    songBeatTrack: req.body.songBeatTrack,
  }

  const newSong = await Songs.create(song)
  res.status(200).json(newSong)
})
  
router.post(`/deleteSongRT`, verifyJWT, async (req, res, next) => {
  const body = req.body.song

  if (body.song_user._id === req.user._id) {
    await Songs.findOneAndDelete({ _id: body._id })
      .then(res.status(200).json({ message: "Deleted" }))
      .catch(err => next(err));s
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
  
router.post(`/getUserFollowsSongsRT`, async (req, res, next) => {
  await Songs.find({ song_user: req.body })
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