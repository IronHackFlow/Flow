import mongoose, { Schema, model } from 'mongoose'

export interface IUserDocument extends mongoose.Document {
  email: string
  password: string
  username: string
  google?: {
    googleId: string
    userPhoto: string
    userSignUpDate: Date
    given_name: string
    family_name: string
  }
  picture?: string
  firstName?: string
  lastName?: string
  about?: string
  location?: string
  socials?: {
    twitter: string
    instagram: string
    soundCloud: string
  }
  followers: string[]
  following: string[]
}

export const User = model(
  'User',
  new Schema<IUserDocument>(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true, select: false },
      username: { type: String, required: true, unique: true },
      picture: String,
      firstName: String,
      lastName: String,
      about: String,
      location: String,
      google: {
        googleId: String,
        userPhoto: String,
        userSignUpDate: Date,
        given_name: String,
        family_name: String,
      },
      socials: {
        twitter: String,
        instagram: String,
        soundCloud: String,
      },
      followers: { type: Array, default: [] },
      following: { type: Array, default: [] },
    },
    { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
  ),
)
