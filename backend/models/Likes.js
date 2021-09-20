const { Schema, model } = require('mongoose')
const Likes = model(
  'Likes',
  new Schema({
    likeDate: Date,
    likeUser: { type: Schema.Types.ObjectId, ref: 'User' },
    likerSong: { type: Schema.Types.ObjectId, ref: 'Songs' },
    likedComment: { type: Schema.Types.ObjectId, ref: 'Comments' },
  }),
)

module.exports = Likes
