const { Schema, model } = require('mongoose')
const Comments = model(
  'Comments',
  new Schema({
    date: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    song: { type: Schema.Types.ObjectId, ref: 'Songs' },
    comment: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
    editedOn: Date,
  }),
  // new Schema({
  //   commDate: Date,
  //   commUser: { type: Schema.Types.ObjectId, ref: 'User' },
  //   commSong: { type: Schema.Types.ObjectId, ref: 'Songs' },
  //   comment: String,
  //   commLikes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
  // }),
)

module.exports = Comments
