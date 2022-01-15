const { Schema, model } = require('mongoose')
const Songs = model(
  'Songs',
  new Schema({
    song_beattrack: { type: Schema.Types.ObjectId, ref: 'Beats' },
    date: Date,
    duration: Number,
    song_user: { type: Schema.Types.ObjectId, ref: 'User' },
    song_URL: String,
    song_PBR: Number,
    lyrics: [[String]],
    lyrics_audio: String,
    video: String,
    caption: String,
    name: String,
    song_comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    song_likes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
  }),
)

module.exports = Songs
