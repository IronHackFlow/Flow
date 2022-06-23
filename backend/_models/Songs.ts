import mongoose, { Schema, model } from 'mongoose'

interface ISongDocument extends mongoose.Document {
  caption: string
  comments: string[]
  duration: number
  likes: string[]
  lyrics: Array<string[]>
  title: string
  audio: string
  user: string[]
  video: string
}

const Songs = model(
  'Songs',
  new Schema<ISongDocument>(
    {
      caption: String,
      comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
      duration: Number,
      likes: { type: Array, default: [] },
      lyrics: { type: Array, default: [] },
      title: String,
      audio: String,
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      video: String,
    },
    { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
  ),
)

export default Songs
