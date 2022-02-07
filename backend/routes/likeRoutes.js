const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')

const User = require('../models/User')
const Songs = require('../models/Songs')
const Comments = require('../models/Comments')
const Likes = require('../models/Likes')

router.post(`/addSongLike`, verifyJWT, async (req, res, next) => {
  const body = {
    user: req.user._id,
    song: req.body.songId,
    date: req.body.date,
  }
  const like = await Likes.create(body)
  let response = { user: '', song: '', like: like }

  console.log(`CREATED a SONGLIKE: `, like)

  await User.findByIdAndUpdate(body.user, { $push: { user_likes: like } }, { new: true })
    .populate('user_likes')
    .then(authUser => (response.user = authUser))
    .catch(err => next(err))

  await Songs.findByIdAndUpdate(body.song, { $push: { song_likes: like } }, { new: true })
    .populate('song_likes')
    .then(song => {
      response.song = song
      console.log(
        `ADDED SONGLIKE: ---`,
        like,
        `---  by ${response.user.user_name} to ${song.name}'s song_likes: `,
        song.song_likes,
      )
    })
    .catch(err => next(err))

  res.status(200).json(response)
})

router.post(`/deleteSongLike`, verifyJWT, async (req, res, next) => {
  const body = {
    user: req.user._id,
    song: req.body.songId,
    likeToDelete: req.body.likeToDelete,
  }
  let response = { user: '', song: '', like: body.likeToDelete }

  await User.findByIdAndUpdate(
    body.user,
    { $pull: { user_likes: body.likeToDelete._id } },
    { new: true },
  )
    .populate('user_likes')
    .then(authUser => (response.user = authUser))
    .catch(err => next(err))

  await Songs.findByIdAndUpdate(
    body.song,
    { $pull: { song_likes: body.likeToDelete._id } },
    { new: true },
  )
    .populate('song_likes')
    .then(song => {
      response.song = song
      console.log(
        `DELETED SONGLIKE: ---`,
        response.like,
        `---  by ${response.user.user_name} from ${song.name}'s song_likes: `,
        song.song_likes,
      )
    })
    .catch(err => next(err))

  res.status(200).json(response)

  await Likes.findByIdAndDelete(body.likeToDelete._id).catch(err => next(err))
})

router.post(`/addCommentLike`, verifyJWT, async (req, res, next) => {
  const body = {
    user: req.user._id,
    comment: req.body.commentId,
    date: req.body.date,
  }
  const like = await Likes.create(body)
  let response = { user: {}, comment: {}, like: like }

  console.log(`CREATED a COMMENTLIKE: `, like)

  await User.findByIdAndUpdate(body.user, { $push: { user_likes: like } }, { new: true })
    .populate('user_likes')
    .then(authUser => (response.user = authUser))
    .catch(err => next(err))

  await Comments.findByIdAndUpdate(body.comment, { $push: { likes: like } }, { new: true })
    .populate('likes')
    .then(comment => {
      response.comment = comment
      console.log(
        `ADDED COMMENTLIKE: ---`,
        like,
        `---  by ${response.user.user_name} to ${comment._id}'s likes: `,
        comment.likes,
      )
    })
    .catch(err => next(err))

  res.status(200).json(response)
})

router.post(`/deleteCommentLike`, verifyJWT, async (req, res, next) => {
  const body = {
    user: req.user._id,
    commentId: req.body.commentId,
    likeToDelete: req.body.likeToDelete,
  }
  let response = { user: {}, comment: {}, like: body.likeToDelete }

  await User.findByIdAndUpdate(
    body.user,
    { $pull: { user_likes: body.likeToDelete._id } },
    { new: true },
  )
    .populate('user_likes')
    .then(authUser => (response.user = authUser))
    .catch(err => next(err))

  await Comments.findByIdAndUpdate(
    body.commentId,
    { $pull: { likes: body.likeToDelete._id } },
    { new: true },
  )
    .populate('likes')
    .then(comments => {
      response.comment = comments
      console.log(
        `DELETED COMMENTLIKE: ---`,
        response.like,
        `---  by ${response.user.user_name} from ${comments._id}'s likes: `,
        comments.likes,
      )
    })
    .catch(err => next(err))

  res.status(200).json(response)

  Likes.findByIdAndDelete(body.likeToDelete._id).catch(err => console.log(err))
})

router.post(`/getUsersLikes`, async (req, res, next) => {
  await Likes.find({ user: req.body.user })
    .then(likes => {
      res.status(200).json(likes)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router
