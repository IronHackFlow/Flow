export interface IUser {
  _id: string
  createdOn?: Date
  updatedOn?: Date
  email: string
  username: string
  password?: string
  picture?: string
  birthday?: string
  google?: {
    googleId: string
    userPhoto: string
    userSignUpDate: Date
    given_name: string
    family_name: string
  }
  firstName?: string
  lastName?: string
  about?: string
  location?: string
  socials?: {
    twitter?: string
    instagram?: string
    soundCloud?: string
  }
  followers: string[]
  following: string[]
  likes: string[]
}

export interface IFollow {
  _id: string
  createdOn: Date
  followed_user: IUser
  user: IUser
}

export interface ILike {
  _id: string
  createdOn: Date
  user: IUser
  song: ISong
  comment?: IComment
}

export interface IComment {
  _id: string
  createdOn?: Date
  updatedOn?: Date
  text: string
  user: IUser
  song?: ISong
  likes: string[]
  replies?: IComment[]
  // editedOn?: Date
}

export interface ISong {
  _id: string
  title: string
  createdOn?: Date
  updatedOn?: Date
  caption?: string
  duration: number
  audio: string
  lyrics: string[][]
  user: IUser
  comments: IComment[]
  likes: string[]
  video?: string
}

export interface ISongTake extends Omit<ISong, 'comments' | 'likes'> {
  blob: Blob | null
}
