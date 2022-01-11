const { Schema, model } = require('mongoose')
const Likes = model(
  'Likes',
  new Schema({
    date: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    song: { type: Schema.Types.ObjectId, ref: 'Songs' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comments' },
  }),
  // new Schema({
  //   likeDate: Date,
  //   likeUser: { type: Schema.Types.ObjectId, ref: 'User' },
  //   likerSong: { type: Schema.Types.ObjectId, ref: 'Songs' },
  //   likedComment: { type: Schema.Types.ObjectId, ref: 'Comments' },
  // }),
)

module.exports = Likes
