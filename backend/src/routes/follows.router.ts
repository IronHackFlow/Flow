import { createRouter, TRPCError } from '../utils/trpc'
import { followHandler, unfollowHandler } from '../controllers/follows.controllers'
import { FollowSchema } from '../schema/follows.schema'

export const followsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw TRPCError('UNAUTHORIZED', 'you must be logged in to access this resource')
    }
    return next()
  })
  .mutation('follow', {
    input: FollowSchema,
    resolve: async ({ ctx, input }) => followHandler({ ctx, input }),
  })
  .mutation('unfollow', {
    input: FollowSchema,
    resolve: async ({ ctx, input }) => unfollowHandler({ ctx, input }),
  })

export type FollowsRouter = typeof followsRouter
