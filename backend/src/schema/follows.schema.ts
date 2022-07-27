import z from 'zod'

export const FollowSchema = z.object({
  following: z.string().uuid(),
  follower: z.string().uuid(),
})

export type FollowInputType = z.infer<typeof FollowSchema>
