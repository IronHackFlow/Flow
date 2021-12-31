const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')
const User = require('../models/User')
const Follows = require('../models/Follows')

router.post(`/addFollowRT`, verifyJWT, async (req, res, next) => {
  let body = {
    follower: req.user._id,
    followed: req.body.followedUser,
    followDate: req.body.followDate,
  }
  let followedObject = await Follows.create(body)
  console.log(`CREATED follow object: `, followedObject)
  
  let resData = { followerData: '', followedData: '' }
  
  await User.findByIdAndUpdate(
    body.follower,
    { $push: { userFollows: followedObject } },
    { new: true },
  )
    .populate('userFollows')
    .then(authUser => {
      resData.followerData = { ...authUser }
      console.log(
        `ADDED a follow to User: ${authUser.userName}'s userFollows: `,
        authUser.userFollows,
      )
    })
    .catch(err => {
      next(err)
    })
  
  await User.findByIdAndUpdate(
    body.followed,
    { $push: { followers: followedObject } },
    { new: true },
  )
    .populate('followers')
    .then(user => {
      resData.followedData = { ...user }
      console.log(`ADDED a follow to User: ${user.userName}'s followers: `, user.followers)
    })
    .catch(err => {
      next(err)
    })
  res.status(200).json(resData)
})
    
router.post(`/deleteFollowRT`, verifyJWT, async (req, res, next) => {
  let body = {
    follower: req.user._id,
    followed: req.body.followedUser,
    deleteObj: req.body.deleteObj,
  }
  let resData = { followerData: '', followedData: '' }

  await User.findByIdAndUpdate(
    body.follower,
    { $pull: { userFollows: body.deleteObj._id } },
    { new: true },
  )
    .populate('userFollows')
    .then(authUser => {
      resData.followerData = { ...authUser }
      console.log(
        `DELETED a follow from User: ${authUser.userName}'s userFollows: `,
        authUser.userFollows,
      )
    })
    .catch(err => {
      next(err)
    })

  await User.findByIdAndUpdate(
    body.followed,
    { $pull: { followers: body.deleteObj._id } },
    { new: true },
  )
    .populate('followers')
    .then(user => {
      resData.followedData = { ...user }
      console.log(`DELETED a follow from User: ${user.userName}'s followers: `, user.followers)
    })
    .catch(err => {
      next(err)
    })

  await Follows.findByIdAndDelete(body.deleteObj._id)
    .then(res => {
      console.log('this follow has been eliminated!', res)
    })
    .catch(err => {
      next(err)
    })

  res.status(200).json(resData)
})

module.exports = router