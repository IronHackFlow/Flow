import { Router, Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../middleware/verifyToken'
import { Songs, ISongDocument } from '../_models/Songs'
import { Comments } from '../_models/Comments'
import { IUserRequest } from '../interfaces/IUserRequest'

const router = Router()

router.post(
  `/addComment`,
  verifyJWT,
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const body = {
      user: req.user._id,
      song: req.body.songId,
      text: req.body.text,
    }

    const comment = await Comments.create(body)
    console.log(comment, body, 'WE GET HERE?? TO THE ROUTER POST')

    await Songs.findByIdAndUpdate(body.song, { $push: { comments: comment } }, { new: true })
      .then((response: ISongDocument) => res.status(200).json(response))
      .catch((err: any) => console.log(err))

    // const body = {
    //   user: req.user._id,
    //   song: req.body.songId,
    //   comment: req.body.comment,
    //   date: req.body.date,
    // }
    // const comment = await Comments.create(body)
    // let response = { user: {}, song: {}, comment: comment }

    // console.log(`CREATED a COMMENT:`, comment)

    // await User.findByIdAndUpdate(body.user, { $push: { user_comments: comment } }, { new: true })
    //   .populate({ path: 'user_comments', populate: 'user' })
    //   .then(authUser => (response.user = authUser))
    //   .catch(err => next(err))

    // await Songs.findByIdAndUpdate(body.song, { $push: { song_comments: comment } }, { new: true })
    //   .populate({ path: 'song_comments', populate: [{ path: 'user' }, { path: 'likes' }] })
    //   .then(song => {
    //     response.song = song
    //     console.log(
    //       `ADDED a COMMENT: ---`,
    //       comment,
    //       `--- from ${response.user.username} to ${song.name}_${song._id}'s COMMENTS: `,
    //       song.song_comments,
    //     )
    //   })
    //   .catch(err => next(err))

    // res.status(200).json(response)
  },
)

router.post(`/deleteComment`, verifyJWT, async (req, res, next) => {
  // const body = {
  //   user: req.user._id,
  //   song: req.body.songId,
  //   commentToDelete: req.body.commentToDelete,
  // }
  // let response = { user: {}, song: {}, comment: body.commentToDelete }
  // await User.findByIdAndUpdate(
  //   body.user,
  //   { $pull: { user_comments: body.commentToDelete._id } },
  //   { new: true },
  // )
  //   .populate({ path: 'user_comments', populate: 'user' })
  //   .then(authUser => (response.user = authUser))
  //   .catch(err => next(err))
  // await Songs.findByIdAndUpdate(
  //   body.song,
  //   { $pull: { song_comments: body.commentToDelete._id } },
  //   { new: true },
  // )
  //   .populate({ path: 'song_comments', populate: [{ path: 'user' }, { path: 'likes' }] })
  //   .then(song => {
  //     response.song = song
  //     console.log(
  //       `DELETED a COMMENT: ---`,
  //       body.commentToDelete,
  //       `--- by ${response.user.user_name} from ${song.name}_${song._id}'s COMMENTS: `,
  //       song.song_comments,
  //     )
  //   })
  //   .catch(err => next(err))
  // res.status(200).json(response)
  // Comments.findByIdAndDelete(body.commentToDelete._id).catch(err => console.log(err))
})

router.post(
  `/editComment`,
  verifyJWT,
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const body = {
      user: req.user._id,
      song: req.body.songId,
      text: req.body.newText,
      comment: req.body.comment,
    }
    const editedComment = await Comments.findByIdAndUpdate(
      { _id: body.comment._id },
      { $set: { text: body.text } },
    )
    // const body = {
    //   user: req.user._id,
    //   song: req.body.songId,
    //   commentToEdit: req.body.commentToEditId,
    //   comment: req.body.comment,
    //   editedOn: req.body.editDate,
    // }
    // await Comments.findByIdAndUpdate(
    //   { _id: body.commentToEdit },
    //   {
    //     $set: { comment: body.comment, editedOn: body.editedOn },
    //   },
    // ).catch(err => console.log(err))
    // await Songs.findById({ _id: body.song })
    //   .populate({ path: 'song_comments', populate: [{ path: 'user' }, { path: 'likes' }] })
    //   .then(song => {
    //     console.log(
    //       `EDITED a COMMENT: ---`,
    //       `--- from ${song.name}_${song._id}'s COMMENTS: `,
    //       song.song_comments,
    //     )
    //     res.status(200).json(song)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  },
)

router.post(`/getComments`, async (req, res, next) => {
  // console.log('getting some song comments', req.body.id)
  // const body = { id: req.body.id }
  // await Songs.findById(body.id)
  //   .populate({ path: 'song_comments', populate: 'user' })
  //   .then(songComments => {
  //     res.status(200).json(songComments)
  //   })
  //   .catch(err => res.status(500).json(err))
})

export default router
