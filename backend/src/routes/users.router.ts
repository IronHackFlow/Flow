import { createRouter, TRPCError } from '../utils/trpc'
import { UserInputSchema } from '../schema/user.schema'
import { getMeHandler, getUserHandler } from '../controllers/users.controllers'

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw TRPCError('UNAUTHORIZED', 'you must be logged in to access this resource')
    }
    return next()
  })
  .query('get-me', {
    resolve: async ({ ctx }) => getMeHandler({ ctx }),
  })
  .query('get-user', {
    input: UserInputSchema,
    resolve: async ({ ctx, input }) => getUserHandler({ ctx, input }),
  })

export type UserRouter = typeof userRouter
