const { Schema, model } = require('mongoose')
const User = model('User', new Schema({

    email: String,
    googleId: String,
    picture: String,
    given_name: String,
    family_name: String,
    userName: { type: String, unique: true },
    userPhoto: String,
    userSignUpDate: Date,
    userAbout: String,
    userLocation: String,
    userTwitter: String,
    userInstagram: String,
    userSoundCloud: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'Follows' }],
    followsUser: [{ type: Schema.Types.ObjectId, ref: 'Follows' }]

}))
module.exports = User 