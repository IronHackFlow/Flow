import mongoose, { Document, Schema, model, Model, Types, InferSchemaType } from 'mongoose'
import { ISong } from './Song'
import { IUser } from './User'

export interface IComment {
  _id: string
  text: string
  likes: string[]
  song: ISong
  user: IUser
  replies: string[]
  createdOn?: Date
  updatedOn?: Date
}

type CommentModelType = Model<IComment>

export const CommentMongoSchema = new Schema<IComment>(
  {
    text: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
)

export const Comment = model<IComment, CommentModelType>('Comment', CommentMongoSchema)
