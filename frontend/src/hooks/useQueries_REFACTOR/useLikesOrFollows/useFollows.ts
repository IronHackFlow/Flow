import { useMutation } from 'react-query'
import { addFollow, deleteFollow } from '../../../apis/actions/follows.actions'
// import { ISong } from '../../../interfaces/IModels'
import { ISong } from '../../../../../backend/src/models/Song'
import { useHandleLikeOrFollowOnMutate } from './mutationHandlers.likesFollows'

type FollowProps = {
  id: string
  song: ISong
  userId: string
}

export function useAddFollow() {
  const { onMutate, onError, onSettled } = useHandleLikeOrFollowOnMutate()

  return useMutation(['songs'], ({ id, song, userId }: FollowProps) => addFollow(id), {
    onMutate: async data => {
      onMutate('followers', 'add', data)
    },
    onError: (err, data, context: any) => {
      console.log(err)
      onError(context.previousSongs)
    },
    onSettled: () => {
      // onSettled()
    },
  })
}

export function useDeleteFollow() {
  const { onMutate, onError, onSettled } = useHandleLikeOrFollowOnMutate()

  return useMutation(['songs'], ({ id, song, userId }: FollowProps) => deleteFollow(id), {
    onMutate: async data => {
      onMutate('followers', 'delete', data)
    },
    onError: (err, data, context: any) => {
      console.log(err)
      onError(context.previousSongs)
    },
    onSettled: () => {
      // onSettled()
    },
  })
}
