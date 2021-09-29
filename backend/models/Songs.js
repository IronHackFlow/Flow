const { Schema, model } = require('mongoose')
const Songs = model(
  'Songs',
  new Schema({
    songBeattrack: { type: Schema.Types.ObjectId, ref: 'Beats' },
    songDate: Date,
    songDuration: Number,
    songUser: { type: Schema.Types.ObjectId, ref: 'User' },
    songTotLikes: Number,
    songURL: String,
    songPBR: Number,
    songLyricsStr: [String],
    songLyricsAudio: String,
    songBG: String,
    songCaption: String,
    songName: String,
    songComments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    songLikes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
  }),
)

module.exports = Songs
