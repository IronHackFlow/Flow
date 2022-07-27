import z from 'zod'

const RegisterInputClientSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
})

export type RegisterInputClientType = z.infer<typeof RegisterInputClientSchema>
