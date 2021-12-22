const { Schema, model } = require('mongoose')
const User = model(
  'User',
  new Schema({
    email: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    googleId: String,
    picture: String,
    given_name: String,
    family_name: String,
    userPhoto: String,
    userSignUpDate: Date,
    userAbout: String,
    userLocation: String,
    userTwitter: String,
    userInstagram: String,
    userSoundCloud: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'Follows' }],
    userFollows: [{ type: Schema.Types.ObjectId, ref: 'Follows' }],
  }),
)
module.exports = User
