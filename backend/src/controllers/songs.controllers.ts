import { ContextWithInput, TRPCError } from '../utils/trpc'
import { Song, ISong } from '../models/Song'
import { UpdateSongType, CreateSongType, SongInputType } from '../schema/songs.schema'
import { User, IUser } from '../models/User'

export const createSongHandler = async ({ ctx, input }: ContextWithInput<CreateSongType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user is not authorized ')

  const newSong = await Song.create(input)
  return newSong
}

export const updateSongHandler = async ({ ctx, input }: ContextWithInput<UpdateSongType>) => {
  const update = { title: input.title, caption: input.caption }
  const updatedSong = await Song.findByIdAndUpdate(input._id, update, { new: true })
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  if (!updatedSong) throw TRPCError('INTERNAL_SERVER_ERROR', 'failed to update song')
  return updatedSong
}

export const deleteSongHandler = async ({ ctx, input }: ContextWithInput<SongInputType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user is not authorized ')

  const deleteSong = await Song.findOneAndDelete({ input })
  return deleteSong
}

export const getSongHandler = async ({ ctx, input }: ContextWithInput<SongInputType>) => {
  const getSong = await Song.findOne(input)
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  if (!getSong) throw TRPCError('INTERNAL_SERVER_ERROR', "couldn't find song")
  return getSong
}

export const getUsersSongsHandler = async ({ ctx, input }: ContextWithInput<SongInputType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user is not authorized ')

  const userSongs = await Song.find({ user: input._id })
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  if (!userSongs) throw TRPCError('BAD_REQUEST', 'user not found')
  return userSongs
}

export const getUsersLikedSongs = async ({ ctx, input }: ContextWithInput<SongInputType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user is not authorized ')

  const likedSongs = await Song.find({ likes: { $in: input._id } }).populate<{ user: IUser }>(
    'user',
  )
  if (!likedSongs) throw TRPCError('BAD_REQUEST', 'could not find users liked songs')
  return likedSongs
}

export const getAllSongsHandler = async () => {
  const allSongs = await Song.find()
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  return allSongs
}

type Data = {
  users: IUser[]
  songs: ISong[]
}

export const searchHandler = async ({ ctx, input }: ContextWithInput<string>) => {
  let data: Data = {
    users: [],
    songs: [],
  }

  const users = await User.find().or([
    { username: { $regex: input, $options: 'i' } },
    { email: { $regex: input, $options: 'i' } },
    { firstName: { $regex: input, $options: 'i' } },
  ])

  const songs = await Song.find({ title: { $regex: input, $options: 'i' } })
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })

  data = { users: [...users], songs: [...songs] }
  console.log(data, users, songs, 'whats this data look like in search')
  return data
}
