const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')

const User = require('../models/User')
const Songs = require('../models/Songs')
const Comments = require('../models/Comments')
const Follows = require('../models/Follows')


router.post(`/addCommentRT`, verifyJWT, async (req, res, next) => {
  let body = {
    comment: req.body.comment,
    commUser: req.user._id,
    commSong: req.body.commSong,
    commDate: req.body.commDate,
  }
  console.log(body, "what")
  let comment = await Comments.create(body)
  
  await Songs.findByIdAndUpdate(
    body.commSong,
    { $push: { songComments: comment } },
    { new: true },
  )
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(song => {
      res.status(200).json(song)
      console.log(`ADDED a comment: `, comment)
    })
    .catch(err => {
      next(err)
    })
})
    
router.post(`/deleteCommentRT`, verifyJWT, async (req, res, next) => {
  let body = { deleteObj: req.body.deleteObj, songId: req.body.songId }
  console.log(body, 'this is')

  await Songs.findByIdAndUpdate(
    body.songId,
    { $pull: { songComments: body.deleteObj._id } },
    { new: true },
  )
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(song => {
      res.status(200).json(song)
    })
    .catch(err => {
      next(err)
    })

  await Comments.findByIdAndDelete(body.deleteObj._id)
    .then(res => {
      console.log(`your comment: ${res} has been exterminated`)
    })
    .catch(err => {
      next(err)
    })
})

router.post(`/getCommentsRT`, async (req, res, next) => {
  console.log('getting some song comments', req.body.id)
  let body = { id: req.body.id }
  
  await Songs.findById(body.id)
    .populate('songComments')
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(songComments => {
      res.status(200).json(songComments)
    })
    .catch(err => res.status(500).json(err))
})
  
router.post(`/getACommentRT`, async (req, res, next) => {
  Comments.findById(req.body.id)
    .populate('commLikes')
    .then(comm => {
      res.status(200).json(comm)
    })
    .catch(err => res.status(500).json(err))
})
  

module.exports = router