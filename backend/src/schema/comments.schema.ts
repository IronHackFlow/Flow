import z from 'zod'
import { SongSchema } from './songs.schema'
import { UserSchema } from './user.schema'

export const CommentSchema = z.object({
  _id: z.string(),
  song: z.string(),
  text: z.string(),
  user: UserSchema,
  replies: z.string().array().default([]),
  likes: z.string().array().default([]),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
})

export const CreateCommentSchema = CommentSchema.omit({
  _id: true,
  likes: true,
  replies: true,
  createdOn: true,
  updatedOn: true,
})

export const EditCommentSchema = CommentSchema.pick({ _id: true, song: true, text: true })
export const DeleteCommentSchema = EditCommentSchema.omit({ text: true })

export type CreateCommentType = z.infer<typeof CreateCommentSchema>
export type EditCommentType = z.infer<typeof EditCommentSchema>
export type DeleteCommentType = z.infer<typeof DeleteCommentSchema>
