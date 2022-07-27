import z, { object, string, date, array } from 'zod'

const GoogleUser = object({
  googleId: string(),
  userPhoto: string(),
  userSignUpDate: date(),
  given_name: string(),
  family_name: string(),
})

const Socials = object({
  twitter: string().optional(),
  instagram: string().optional(),
  soundCloud: string().optional(),
})

export const UserSchema = object({
  _id: string(),
  username: string(),
  email: string().email(),
  google: GoogleUser.optional(),
  picture: string().optional(),
  firstName: string().optional(),
  lastName: string().optional(),
  about: string().optional(),
  location: string().optional(),
  socials: Socials.optional(),
  followers: string().array().default([]),
  following: string().array().default([]),
})

export const UserInputSchema = UserSchema.pick({ _id: true })

type UserSchemaType = z.infer<typeof UserSchema>
type GoogleUserType = z.infer<typeof GoogleUser>

export type UserInputType = z.infer<typeof UserInputSchema>
