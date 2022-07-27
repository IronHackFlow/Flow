import z from 'zod'

export const LikeSchema = z.object({
  _id: z.string().uuid(),
  user: z.string().uuid(),
  type: z.string(),
})

export const LikeInputSchema = z.object({ _id: z.string().uuid() })
export const LikeCommentInputSchema = LikeInputSchema.extend({ commentId: z.string().uuid() })

export type LikeInputType = z.infer<typeof LikeInputSchema>
export type LikeCommentInputType = z.infer<typeof LikeCommentInputSchema>
