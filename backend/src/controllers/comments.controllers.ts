import { ContextWithInput, TRPCError } from '../utils/trpc'
import { Song, ISong } from '../models/Song'
import { Comment } from '../models/Comment'
import { CreateCommentType, EditCommentType, DeleteCommentType } from '../schema/comments.schema'
import { IUser } from '../models/User'

export const createCommentHandler = async ({ ctx, input }: ContextWithInput<CreateCommentType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user not authorized to comment')
  const comment = await Comment.create(input)
  const updatedSong = await Song.findByIdAndUpdate(
    input.song,
    { $push: { comments: comment } },
    { new: true },
  )
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  return updatedSong
}

export const editCommentHandler = async ({ ctx, input }: ContextWithInput<EditCommentType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user not authorized to comment')
  const updatedComment = await Comment.findByIdAndUpdate(input._id, {
    $set: { text: input.text },
  })
  const updatedSong = await Song.findByIdAndUpdate(
    { _id: input.song, 'comments._id': input._id },
    { $set: { updatedComment } },
    { new: true },
  )
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  return updatedSong
}

export const deleteCommentHandler = async ({ ctx, input }: ContextWithInput<DeleteCommentType>) => {
  if (!ctx.user) throw TRPCError('UNAUTHORIZED', 'user not authorized to comment')
  const deletedComment = await Comment.findOneAndDelete({ _id: input._id })
  const updatedSong = await Song.findByIdAndUpdate(
    input.song,
    { $pull: { comments: { _id: input._id } } },
    { new: true },
  )
    .populate<{ user: IUser }>('user')
    .populate<{ comments: ISong['comments'] }>({ path: 'comments', populate: 'user' })
  return updatedSong
}
