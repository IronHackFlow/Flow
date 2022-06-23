import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
const verifyJWT = require('./verifyToken')
import Songs from '../_models/Songs'
import Comments from '../_models/Comments'
import { IUserRequest } from './verifyToken'

router.post(`/addLike`, verifyJWT, async (req: IUserRequest, res: Response, next: NextFunction) => {
  const body = {
    userId: req.user._id,
    id: req.body.id,
    type: req.body.type,
  }
  console.log(req.body, req.params, 'Req body/params for addLike')

  if (body.type === 'song') {
    const song = await Songs.findById(body.id)

    if (!song.likes.includes(body.userId)) {
      await song.updateOne({ $push: { likes: body.userId } })
      res.status(200).json('You liked the song!')
    } else {
      res.status(403).json('You already liked this song.')
    }
  } else {
    const comment = await Comments.findById(body.id)

    if (!comment?.likes.includes(body.userId)) {
      await comment?.updateOne({ $push: { likes: body.userId } })
      res.status(200).json('You liked the comment!')
    } else {
      res.status(403).json('You already liked this comment.')
    }
  }
})

router.post(
  `/deleteLike`,
  verifyJWT,
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const body = {
      userId: req.user._id,
      id: req.body.id,
      type: req.body.type,
    }
    console.log(req.body, req.params, 'Req body/params for deleteLike')

    if (body.type === 'song') {
      const song = await Songs.findById(body.id)

      if (song.likes.includes(body.userId)) {
        await song.updateOne({ $pull: { likes: body.userId } })
        res.status(200).json('You unliked the song')
      } else {
        res.status(403).json("You haven't liked this song.")
      }
    } else {
      const comment = await Comments.findById(body.id)

      if (comment.likes.includes(body.userId)) {
        await comment.updateOne({ $pull: { likes: body.userId } })
        res.status(200).json('You unliked the comment!')
      } else {
        res.status(403).json("You haven't liked this comment.")
      }
    }
  },
)

// router.post(`/deleteLike`, verifyJWT, async (req, res, next) => {
//   const body = {
//     user: req.user._id,
//     song: req.body.songId,
//     likeToDelete: req.body.likeToDelete,
//   }
//   let response = { user: '', song: '', like: body.likeToDelete }

//   await User.findByIdAndUpdate(
//     body.user,
//     { $pull: { user_likes: body.likeToDelete._id } },
//     { new: true },
//   )
//     .populate('user_likes')
//     .then(authUser => (response.user = authUser))
//     .catch(err => next(err))

//   await Songs.findByIdAndUpdate(
//     body.song,
//     { $pull: { song_likes: body.likeToDelete._id } },
//     { new: true },
//   )
//     .populate('song_likes')
//     .then(song => {
//       response.song = song
//       console.log(
//         `DELETED SONGLIKE: ---`,
//         response.like,
//         `---  by ${response.user.user_name} from ${song.name}'s song_likes: `,
//         song.song_likes,
//       )
//     })
//     .catch(err => next(err))

//   res.status(200).json(response)

//   await Likes.findByIdAndDelete(body.likeToDelete._id).catch(err => next(err))
// })

// router.post(`/addCommentLike`, verifyJWT, async (req, res, next) => {
//   const body = {
//     user: req.user._id,
//     comment: req.body.commentId,
//     date: req.body.date,
//   }
//   const like = await Likes.create(body)
//   let response = { user: {}, comment: {}, like: like }

//   console.log(`CREATED a COMMENTLIKE: `, like)

//   await User.findByIdAndUpdate(body.user, { $push: { user_likes: like } }, { new: true })
//     .populate('user_likes')
//     .then(authUser => (response.user = authUser))
//     .catch(err => next(err))

//   await Comments.findByIdAndUpdate(body.comment, { $push: { likes: like } }, { new: true })
//     .populate('likes')
//     .then(comment => {
//       response.comment = comment
//       console.log(
//         `ADDED COMMENTLIKE: ---`,
//         like,
//         `---  by ${response.user.user_name} to ${comment._id}'s likes: `,
//         comment.likes,
//       )
//     })
//     .catch(err => next(err))

//   res.status(200).json(response)
// })

// router.post(`/deleteCommentLike`, verifyJWT, async (req, res, next) => {
//   const body = {
//     user: req.user._id,
//     commentId: req.body.commentId,
//     likeToDelete: req.body.likeToDelete,
//   }
//   let response = { user: {}, comment: {}, like: body.likeToDelete }

//   await User.findByIdAndUpdate(
//     body.user,
//     { $pull: { user_likes: body.likeToDelete._id } },
//     { new: true },
//   )
//     .populate('user_likes')
//     .then(authUser => (response.user = authUser))
//     .catch(err => next(err))

//   await Comments.findByIdAndUpdate(
//     body.commentId,
//     { $pull: { likes: body.likeToDelete._id } },
//     { new: true },
//   )
//     .populate('likes')
//     .then(comments => {
//       response.comment = comments
//       console.log(
//         `DELETED COMMENTLIKE: ---`,
//         response.like,
//         `---  by ${response.user.user_name} from ${comments._id}'s likes: `,
//         comments.likes,
//       )
//     })
//     .catch(err => next(err))

//   res.status(200).json(response)

//   Likes.findByIdAndDelete(body.likeToDelete._id).catch(err => console.log(err))
// })

// router.post(`/getUsersLikes`, async (req, res, next) => {
//   await Likes.find({ user: req.body.user })
//     .then(likes => {
//       res.status(200).json(likes)
//     })
//     .catch(err => res.status(500).json(err))
// })

export default router
