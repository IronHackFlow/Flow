const { Schema, model } = require('mongoose')
const Comments = model(
  'Comments',
  new Schema({
    commDate: Date,
    commUser: { type: Schema.Types.ObjectId, ref: 'User' },
    commSong: { type: Schema.Types.ObjectId, ref: 'Songs' },
    comment: String,
    commLikes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
  }),
)

module.exports = Comments
