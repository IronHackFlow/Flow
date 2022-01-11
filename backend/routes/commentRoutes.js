const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const User = require('../models/User')
const Songs = require('../models/Songs')
const Comments = require('../models/Comments')


router.post(`/addComment`, verifyJWT, async (req, res, next) => {
  const body = {
    user: req.user._id,
    song: req.body.songId,
    comment: req.body.comment,
    date: req.body.date,
  }
  const comment = await Comments.create(body)
  let response = { user: {}, song: {}, comment: comment }

  console.log(`CREATED a COMMENT:`, comment)

  await User.findByIdAndUpdate(
    body.user,
    { $push: { user_comments: comment } },
    { new: true },
  )
    .populate({ path: 'user_comments', populate: 'user' })
    .then(authUser => response.user = authUser)
    .catch(err => next(err))

  await Songs.findByIdAndUpdate(
    body.song,
    { $push: { song_comments: comment } },
    { new: true },
  )
    .populate({ path: 'song_comments', populate: [{ path: 'user'}, { path: 'likes' }] })
    .then(song => {
      response.song = song
      console.log(`ADDED a COMMENT: ---`, comment, `--- from ${response.user.user_name} to ${song.name}_${song._id}'s COMMENTS: `, song.song_comments)
    })
    .catch(err => next(err))

  res.status(200).json(response)
})
    


router.post(`/deleteComment`, verifyJWT, async (req, res, next) => {
  const body = { 
    user: req.user._id,
    song: req.body.songId, 
    commentToDelete: req.body.commentToDelete 
  }
  let response = { user: {}, song: {}, comment: body.commentToDelete }

  await User.findByIdAndUpdate(
    body.user,
    { $pull: { user_comments: body.commentToDelete._id } },
    { new: true },
  )
    .populate({ path: 'user_comments', populate: 'user' })
    .then(authUser => response.user = authUser)
    .catch(err => next(err))

  await Songs.findByIdAndUpdate(
    body.song,
    { $pull: { song_comments: body.commentToDelete._id } },
    { new: true },
  )
    .populate({ path: 'song_comments', populate: [{ path: 'user'}, { path: 'likes' }] })
    .then(song => {
      response.song = song
      console.log(`DELETED a COMMENT: ---`, body.commentToDelete, `--- by ${response.user.user_name} from ${song.name}_${song._id}'s COMMENTS: `, song.song_comments)
    })
    .catch(err => next(err))

  res.status(200).json(response)

  Comments.findByIdAndDelete(body.commentToDelete._id)
    .catch(err => console.log(err))
})



router.post(`/getCommentsRT`, async (req, res, next) => {
  console.log('getting some song comments', req.body.id)
  const body = { id: req.body.id }
  
  await Songs.findById(body.id)
    .populate({ path: 'song_comments', populate: 'user' })
    .then(songComments => {
      res.status(200).json(songComments)
    })
    .catch(err => res.status(500).json(err))
})
  


router.post(`/getACommentRT`, async (req, res, next) => {
  Comments.findById(req.body.id)
    .populate('likes')
    .then(comm => {
      res.status(200).json(comm)
    })
    .catch(err => res.status(500).json(err))
})
  

module.exports = router