import { Context, ContextWithInput, TRPCError } from '../utils/trpc'
import { User } from '../models/User'
import { UserInputType } from '../schema/user.schema'

export const getMeHandler = async ({ ctx }: { ctx: Context }) => {
  const user = ctx.user
  if (!user) throw TRPCError('INTERNAL_SERVER_ERROR', 'you must be logged in')
  const getUser = await User.findOne({ username: user.username })
  return getUser
}

export const getUserHandler = async ({ ctx, input }: ContextWithInput<UserInputType>) => {
  const user = await User.findOne({ _id: input._id })
  if (!user) throw TRPCError('BAD_REQUEST', 'user not found')
  return user
}
