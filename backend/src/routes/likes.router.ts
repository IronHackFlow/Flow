import { createRouter, TRPCError } from '../utils/trpc'
import { LikeCommentInputSchema, LikeSchema } from '../schema/likes.schema'
import {
  likeSongHandler,
  unlikeSongHandler,
  likeCommentHandler,
  unlikeCommentHandler,
} from '../controllers/likes.controllers'

export const likesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw TRPCError('UNAUTHORIZED', 'you must be logged in to access this resource')
    }
    return next()
  })
  .mutation('like-song', {
    input: LikeSchema,
    resolve: async ({ ctx, input }) => likeSongHandler({ ctx, input }),
  })
  .mutation('unlike-song', {
    input: LikeSchema,
    resolve: async ({ ctx, input }) => unlikeSongHandler({ ctx, input }),
  })
  .mutation('like-comment', {
    input: LikeCommentInputSchema,
    resolve: async ({ ctx, input }) => likeCommentHandler({ ctx, input }),
  })
  .mutation('unlike-comment', {
    input: LikeCommentInputSchema,
    resolve: async ({ ctx, input }) => unlikeCommentHandler({ ctx, input }),
  })

export type LikesRouter = typeof likesRouter
