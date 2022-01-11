const { Schema, model } = require('mongoose')
const Follows = model(
  'Follows',
  new Schema({
    date: Date,
    followed_user: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  }),
  // new Schema({
  //   date: Date,
  //   followed: { type: Schema.Types.ObjectId, ref: 'User' },
  //   follower: { type: Schema.Types.ObjectId, ref: 'User' },
  // }),
)

module.exports = Follows
