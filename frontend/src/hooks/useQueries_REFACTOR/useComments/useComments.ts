import { addComment, editComment } from '../../../apis/actions/comments.actions'
import { useMutation, useQueryClient } from 'react-query'
import { ISong } from '../../../interfaces/IModels'

type CommentProps = {
  songId: string
  text: string
}
export function useAddComment() {
  const queryClient = useQueryClient()
  return useMutation(
    ['song', 'comments'],
    ({ songId, text }: { songId: string; text: string }) => addComment(songId, text),
    {
      onMutate: async data => {
        const previousSongs = queryClient.getQueryData('songs')

        if (previousSongs) {
          // queryClient.setQueryData('songs', (prev) => {
          //   if (prev._id === songId) {
          //   }
          // })
        }
      },
    },
  )
}

export function useEditComment() {
  // requires songId && commentId
}

const updateSongsOnMutation = () => {}
// edit -> replace
// delete -> pull
// add -> push -- like, follow, comment --- id, id, whole comment
