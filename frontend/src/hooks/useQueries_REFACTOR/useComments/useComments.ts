import { addComment, editComment, deleteComment } from '../../../apis/actions/comments.actions'
import { useMutation, useQueryClient } from 'react-query'
import { useHandleCommentOnMutate } from './mutationHandlers.comments'
import { IComment, IUser } from '../../../interfaces/IModels'

export type CommentProps = {
  songId: string
  user: IUser
  newText: string
  comment?: IComment
}

export function useAddComment() {
  const { onMutate, onError, onSettled } = useHandleCommentOnMutate()
  return useMutation(
    ['song', 'comments'],
    ({ songId, user, newText, comment }: CommentProps) => addComment(songId, newText),
    {
      onMutate: async data => {
        console.log(data, 'I NEED TO KNOW WHAT THIS IS FOR MY MUTATION!!!!!!!!')
        onMutate('Add', data)
      },
    },
  )
}

export function useEditComment() {
  const { onMutate, onError, onSettled } = useHandleCommentOnMutate()
  return useMutation(
    ['song', 'comments'],
    ({ songId, user, newText, comment }: CommentProps) => editComment(songId, newText, comment),
    {
      onMutate: async data => {
        console.log(data, 'I NEED TO KNOW WHAT THIS IS FOR MY MUTATION!!!!!!!!')
        onMutate('Add', data)
      },
    },
  )
}

export function useDeleteComment() {
  const { onMutate, onError, onSettled } = useHandleCommentOnMutate()
  return useMutation(
    ['song', 'comments'],
    ({ songId, user, newText, comment }: CommentProps) => deleteComment(songId, comment),
    {
      onMutate: async data => {
        console.log(data, 'I NEED TO KNOW WHAT THIS IS FOR MY MUTATION!!!!!!!!')
        onMutate('Delete', data)
      },
    },
  )
}
