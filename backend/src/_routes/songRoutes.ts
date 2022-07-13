import express, { Request, Response, NextFunction } from 'express'
import { Songs, ISongDocument } from '../_models/Songs'
import { verifyJWT } from '../middleware/verifyToken'

const router = express.Router()

router.post(`/addSong`, verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  const songData: ISongDocument = req.body.currentSong
  const awsURL = req.body.awsURL

  const song = {
    caption: songData.caption,
    duration: songData.duration,
    lyrics: songData.lyrics,
    title: songData.title,
    audio: awsURL,
    user: songData.user,
    video: songData.video,
  }

  await Songs.create(song)
    .then(song => {
      console.log(song, 'SUCCESS')
      res.status(200).json(song)
    })
    .catch((err: any) =>
      res.json({ success: false, error: err, message: 'Unable to create new song' }),
    )
})

router.post(`/deleteSong`, verifyJWT, async (req, res, next) => {
  const body = req.body.song
  await Songs.findOneAndDelete({ _id: body._id })
    // .then(res.status(200).json({ message: 'Deleted' }))
    .catch((err: any) => next(err))
  // if (body.song_user._id === req.user._id) {
  //   await Songs.findOneAndDelete({ _id: body._id })
  //     .then(res.status(200).json({ message: 'Deleted' }))
  //     .catch((err: any) => next(err))
  // } else {
  //   console.log("Can't delete due to User not being the songUser")
  // }
})

router.post(`/updateSong`, verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  const songId = req.body.songId
  const body = {
    title: req.body.title,
    caption: req.body.caption,
  }
  await Songs.findByIdAndUpdate(songId, body, { new: true })
    .populate({
      path: 'comments',
      populate: [{ path: 'user' }],
    })
    .then((song: any) => {
      res.status(200).json(song)
    })
    .catch((err: any) => res.status(500).json(err))
})

router.get(`/getAllSongs`, async (req: Request, res: Response, next: NextFunction) => {
  const songs = await Songs.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate: [{ path: 'user' }],
    })
    .then((songs: any) => {
      res.status(200).json(songs)
    })
    .catch((err: any) => res.status(500).json(err))
})

router.get(`/getUserSongs/:id`, verifyJWT, async (req, res, next) => {
  const { id } = req.params

  await Songs.find({ user: id })
    .populate('user')
    .populate({ path: 'comments', populate: 'user' })
    .then((songs: any) => {
      console.log(songs, id, 'we getting songs??')
      res.status(200).json(songs)
    })
    .catch((err: any) => res.status(500).json(err))
})

export default router
