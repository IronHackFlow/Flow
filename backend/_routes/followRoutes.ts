import express, { Request, Response, NextFunction } from 'express'
const mongoose = require('mongoose')
const router = express.Router()
const verifyJWT = require('./verifyToken')
import User from '../_models/User'
import { IUserRequest } from './verifyToken'

router.post(
  `/addFollow`,
  verifyJWT,
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const body = {
      userId: req.user._id,
      id: req.body.id,
    }
    const signedInUser = await User.findById(body.userId)
    const user = await User.findById(body.id)

    if (!signedInUser.following.includes(body.id) && !user.followers.includes(body.userId)) {
      await signedInUser.updateOne({ $push: { following: body.id } })
      await user.updateOne({ $push: { followers: body.userId } })
      res.status(200).json('you followed this user')
    } else {
      res.status(403).json('you are already following this user')
    }
    // const body = {
    //   user: req.user._id,
    //   followed_user: req.body.followed_user,
    //   date: req.body.date,
    // }
    // const follow = await Follows.create(body)
    // let response = { user: '', followed_user: '', follow: follow }

    // console.log(`CREATED A FOLLOW: `, follow)

    // await User.findByIdAndUpdate(
    //   body.user,
    //   { $push: { user_follows: follow } },
    //   { new: true },
    // )
    //   .populate('user_follows')
    //   .then(authUser => response.user = authUser)
    //   .catch(err => next(err))

    // await User.findByIdAndUpdate(
    //   body.followed_user,
    //   { $push: { followers: follow } },
    //   { new: true },
    // )
    //   .populate('followers')
    //   .then(user => {
    //     response.followed_user = user
    //     console.log(`ADDED a FOLLOW: ---`, follow, `--- by ${response.user.user_name} to ${user.user_name}'s FOLLOWERS: `, user.followers)
    //   })
    //   .catch(err => next(err))

    // res.status(200).json(response)
  },
)

router.post(
  `/deleteFollow`,
  verifyJWT,
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const body = {
      userId: req.user._id,
      id: req.body.id,
    }
    const signedInUser = await User.findById(body.userId)
    const user = await User.findById(body.id)

    if (signedInUser.following.includes(body.id) && user.followers.includes(body.userId)) {
      await signedInUser.updateOne({ $pull: { following: body.id } })
      await user.updateOne({ $pull: { followers: body.userId } })
      res.status(200).json('you unfollowed this user')
    } else {
      res.status(403).json('you arent following this user')
    }
    // const body = {
    //   user: req.user._id,
    //   followed_user: req.body.followed_user,
    //   followToDelete: req.body.followToDelete,
    // }
    // let response = { user: '', followed_user: '', follow: body.followToDelete }

    // await User.findByIdAndUpdate(
    //   body.user,
    //   { $pull: { user_follows: body.followToDelete._id } },
    //   { new: true },
    // )
    //   .populate('user_follows')
    //   .then(authUser => response.user = authUser)
    //   .catch(err => next(err))

    // await User.findByIdAndUpdate(
    //   body.followed_user,
    //   { $pull: { followers: body.followToDelete._id } },
    //   { new: true },
    // )
    //   .populate('followers')
    //   .then(user => {
    //     response.followed_user = user
    //     console.log(`DELETED a FOLLOW: ---`, response.follow, `--- by ${response.user.user_name} from ${user.user_name}'s FOLLOWERS`, user.followers)
    //   })
    //   .catch(err => next(err))

    // res.status(200).json(response)

    // Follows.findByIdAndDelete(body.followToDelete._id)
    //   .catch(err => console.log(err))
  },
)

export default router
