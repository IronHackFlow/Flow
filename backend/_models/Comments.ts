import mongoose, { Schema, model } from 'mongoose'
import { IComment } from '../../frontend/src/interfaces/IModels'

interface ICommentDocument extends mongoose.Document {
  text: string
  likes: string[]
  song: string
  user: string
  replies: string[]
}

const Comments = model(
  'Comments',
  new Schema<ICommentDocument>(
    {
      text: String,
      likes: { type: Array, default: [] },
      song: { type: Schema.Types.ObjectId, ref: 'Songs' },
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      replies: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    },
    { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
  ),
)

export default Comments
