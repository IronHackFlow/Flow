const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')

const User = require('../models/User')
const Songs = require('../models/Songs')
const Comments = require('../models/Comments')
const Likes = require('../models/Likes')

router.post(`/addLikeRT`, verifyJWT, async (req, res, next) => {
  console.log(req.body, "what am i getting here?")
  let bodySong = {
    likeUser: req.user._id,
    likerSong: req.body.likerSong,
    likeDate: req.body.likeDate,
  }
  let bodyComm = {
    likeUser: req.user._id,
    likedComment: req.body.likedComment,
    likeDate: req.body.likeDate,
  }
  let likeCheck = req.body.commLike
  
  if (likeCheck === false) {
    let likedObject = await Likes.create(bodySong)
    console.log(`CREATED songLike object: `, likedObject)
    let returnData = { song: '', user: '', songLike: likedObject }
    
    await User.findByIdAndUpdate(
      bodySong.likeUser,
      {$push: { userLikes: likedObject}},
      { new: true },
    )
      .populate({ path:'userLikes', populate: 'song' })
      .then(likes => {
        returnData.user = likes
        console.log(likes, "YOYOYOYOYOYO DID I WORK THIS CORRECTLY?")
      })
      .catch(err => {
        next(err)
      })

    await Songs.findByIdAndUpdate(
      bodySong.likerSong,
      { $push: { songLikes: likedObject } },
      { new: true },
    )
      .populate('songLikes')
      .then(song => {
        returnData.song = song
        console.log(`ADDED a like to Song: ${song.songName}'s likes: `, song.songLikes)
      })
      .catch(err => {
        next(err)
      })

    res.status(200).json(returnData)
  } else {
    let likedCommObject = await Likes.create(bodyComm)
    console.log('CREATED commentLike object: ', likedCommObject)
  
    await Comments.findByIdAndUpdate(
      bodyComm.likedComment,
      { $push: { commLikes: likedCommObject } },
      { new: true },
    ) 
      .populate('commLikes')
      .then(comm => {
        res.status(200).json(comm)
        console.log(`ADDED a like to CommentUser: ${comm.commUser}'s likes: `, comm.commLikes)
      })
      .catch(err => {
        next(err)
      })
  }
})
    
router.post(`/deleteLikeRT`, verifyJWT, async (req, res, next) => {
  let bodySong = {
    likeUser: req.user._id,
    likerSong: req.body.likerSong,
    deleteObj: req.body.deleteObj,
  }

  let bodyComm = {
    likeUser: req.user._id,
    deleteObj: req.body.deleteObj,
  }

  let likeCheck = req.body.commLike

  let returnData = { song: '', user: '' }

  if (likeCheck === false) {
    await User.findByIdAndUpdate(
      bodySong.likeUser,
      {$pull: { userLikes: bodySong.deleteObj._id}},
      { new: true },
    )
      .populate({ path:'userLikes', populate: 'song' })
      .then(likes => {
        returnData.user = likes
        console.log(likes, "YOYOYOYOYOYO DID I WORK THIS CORRECTLY?")
      })
      .catch(err => {
        next(err)
      })

    await Songs.findByIdAndUpdate(
      bodySong.likerSong,
      { $pull: { songLikes: bodySong.deleteObj._id } },
      { new: true },
    )
      .populate('songLikes')
      .then(song => {
        returnData.song = song
        console.log(`DELETED a like from Song: ${song.songName}'s likes: `, song.songLikes)
      })
      .catch(err => {
        next(err)
      })

      await Likes.findByIdAndDelete(bodySong.deleteObj._id)
      .then(res => {
        console.log('this songLike has been eliminated!', res)
      })
      .catch(err => {
        next(err)
      })
      res.status(200).json(returnData)
      
  } else {
    await Comments.findByIdAndUpdate(
      bodyComm.deleteObj.likedComment,
      { $pull: { commLikes: bodyComm.deleteObj._id } },
      { new: true },
    )
      .populate('commLikes')
      .then(comm => {
        res.status(200).json(comm)
        console.log(
          `DELETED a like from CommentUser: ${comm.commUser}'s likes: `,
          comm.commLikes,
        )
      })
      .catch(err => {
        next(err)
      })
    await Likes.findByIdAndDelete(bodyComm.deleteObj._id)
      .then(res => {
        console.log('this commentLike has been eliminated!', res)
      })
      .catch(err => {
        next(err)
      })
  }
})

router.post(`/getUsersLikes`, async (req, res, next) => {
  await Likes.find({ likeUser: req.body.likeUser })
    .then(likes => {
      res.status(200).json(likes)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router