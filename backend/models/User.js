const { Schema, model } = require('mongoose')
const User = model(
  'User',
  new Schema({
    email: { type: String, required: true },
    user_name: { type: String, },
    password: { type: String, required: true, select: false },
    googleId: String,
    picture: String,
    given_name: String,
    family_name: String,
    userPhoto: String,
    userSignUpDate: Date,
    about: String,
    location: String,
    user_Twitter: String,
    user_Instagram: String,
    user_SoundCloud: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'Follows' }],
    user_follows: [{ type: Schema.Types.ObjectId, ref: 'Follows' }],
    user_likes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
    user_comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  }),
)
module.exports = User
