import { useMutation } from 'react-query'
import { addLike, deleteLike } from '../../../apis/actions/likes.actions'
// import { ISong } from '../../../interfaces/IModels'
import { ISong } from '../../../../../backend/src/models/Song'
import { useHandleLikeOrFollowOnMutate } from './mutationHandlers.likesFollows'

type LikeProps = {
  id: string
  type: string
  song: ISong
  userId: string
}

export function useAddLike() {
  const { onMutate, onError, onSettled } = useHandleLikeOrFollowOnMutate()

  return useMutation(['songs'], ({ id, type, song, userId }: LikeProps) => addLike(id, type), {
    onMutate: async data => {
      onMutate('likes', 'add', data)
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

export function useDeleteLike() {
  const { onMutate, onError, onSettled } = useHandleLikeOrFollowOnMutate()

  return useMutation(['songs'], ({ id, type }: LikeProps) => deleteLike(id, type), {
    onMutate: async data => {
      onMutate('likes', 'delete', data)
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
