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
    songName: req.body.songName,
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
  let body = req.body.song

  if (body.songUser._id === req.user._id) {
    await Songs.findOneAndDelete({ _id: body._id })
    .then(res.status(200).json({ message: "Deleted" }))
    .catch(err => next(err));

  } else {
    console.log("Can't delete due to User not being the songUser")
  }
})

router.post(`/getSongRT`, async (req, res, next) => {
  await Songs.findById(req.body.id)
    .populate('songUser')
    .populate('songLikes')
    .then(song => {
      res.status(200).json(song)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getUserSongsRT`, async (req, res, next) => {
  console.log(req.body, 'wha')
  let body = req.body
  await Songs.find({ songUser: body.songUser })
    .populate('songUser')
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})
  
router.post(`/getUserFollowsSongsRT`, async (req, res, next) => {
  // console.log(req.body, 'is this an array?')
  await Songs.find({ songUser: req.body })
    .populate('songUser')
    .then(songs => {
      // songs.forEach(each => console.log(each.songName))
      res.status(200).json(songs)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post(`/getMostLikedSongsRT`, (req, res, next) => {
  // Songs.find({$sort: {"songTotLikes": -1}})
  Songs.find({})
    .populate('songUser')
    .populate({ path: 'songComments', populate: 'commUser' })
    .populate({ path: 'songUser', populate: 'followers' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router
   