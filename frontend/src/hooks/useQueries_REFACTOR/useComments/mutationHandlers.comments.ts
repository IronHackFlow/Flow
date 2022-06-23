import { useQueryClient } from 'react-query'
import { IComment, ISong } from '../../../interfaces/IModels'

const handleUpdateSocialList = (_action: 'add' | 'delete', _list: string[], _userId: string) => {
  if (_action === 'add') return [..._list, _userId]
  return [..._list].filter(each => each !== _userId)
}

const handleUpdateCommentsList = (
  _action: 'add' | 'delete' | 'edit',
  _list: IComment[],
  _updateValue: any,
  _id: string,
) => {
  if (_action === 'add') {
    return [..._list, _updateValue]
  } else if (_action === 'edit') {
    const removeEdited = [..._list].filter(each => each._id !== _id)
    return [...removeEdited, _updateValue]
  } else {
    return [..._list].filter(each => each._id !== _id)
  }
}

export function useHandleCommentOnMutate() {
  const queryClient = useQueryClient()

  const onMutate = (
    _action: 'add' | 'delete' | 'edit',
    _data: { song: ISong; userId: string; id: string },
  ) => {
    const previousSongs = queryClient.getQueryData('songs')

    queryClient.setQueryData('songs', (prevSongs: any) => {
      return prevSongs.map((song: any) => {
        if (song._id === _data.song._id) {
          // const updatedComments = handleUpdateCommentsList(_action, song.comments)
          // return { ...song, comments: updatedComments }
        }
        return song
      })
    })

    return previousSongs
  }

  const onError = (prevSongs: ISong[]) => {
    queryClient.setQueryData(['songs'], prevSongs)
  }

  const onSettled = () => {
    queryClient.invalidateQueries(['songs'])
  }

  return { onMutate, onError, onSettled }
}
