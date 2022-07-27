import { createRouter, TRPCError } from '../utils/trpc'
import {
  CreateCommentSchema,
  EditCommentSchema,
  DeleteCommentSchema,
} from '../schema/comments.schema'
import {
  createCommentHandler,
  editCommentHandler,
  deleteCommentHandler,
} from '../controllers/comments.controllers'

export const commentsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw TRPCError('UNAUTHORIZED', 'you must be logged in to access this resource')
    }
    return next()
  })
  .mutation('create', {
    input: CreateCommentSchema,
    resolve: async ({ ctx, input }) => createCommentHandler({ ctx, input }),
  })
  .mutation('edit', {
    input: EditCommentSchema,
    resolve: async ({ ctx, input }) => editCommentHandler({ ctx, input }),
  })
  .mutation('delete', {
    input: DeleteCommentSchema,
    resolve: async ({ ctx, input }) => deleteCommentHandler({ ctx, input }),
  })

export type CommentsRouter = typeof commentsRouter
