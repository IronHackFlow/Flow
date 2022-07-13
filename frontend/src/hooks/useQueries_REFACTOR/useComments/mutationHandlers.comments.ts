import { useQueryClient } from 'react-query'
import { IComment, ISong, IUser } from '../../../interfaces/IModels'

export interface ICommentMutateData {
  songId: string
  user: IUser
  newText: string
  comment?: IComment
}

const getNewCommentList = (
  _action: 'Add' | 'Delete' | 'Edit',
  _list: IComment[],
  _songId: string,
  _user: IUser,
  _newText: string,
  _comment?: IComment,
) => {
  switch (_action) {
    case 'Add':
      const newComment = createTempComment(_songId, _user, _newText)
      return [..._list, newComment]
    case 'Edit':
      if (!_comment) return
      const editedComment = { ..._comment, text: _newText, updatedOn: new Date() }
      const removeEdited = [..._list].filter(each => each._id !== _comment._id)
      return [...removeEdited, editedComment]
    case 'Delete':
      if (!_comment) return
      return [..._list].filter(each => each._id !== _comment._id)
    default:
      return console.log('Input Error')
  }
}

const createTempComment = (_songId: string, _user: IUser, _text: string) => {
  // gonna need entire user
  return {
    _id: Math.random().toString(10),
    song: _songId,
    user: _user,
    likes: [],
    replies: [],
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

export function useHandleCommentOnMutate() {
  const queryClient = useQueryClient()

  const onMutate = (
    _action: 'Add' | 'Delete' | 'Edit',
    _data: { songId: string; user: IUser; newText: string; comment?: IComment },
  ) => {
    // const previousSongs = queryClient.getQueryData('songs')

    const queryKey = ['songs', 'current', _data.songId]
    // queryClient.setQueryData(['songs'], (prevSongs: any) => {
    //   return prevSongs.map((song: any) => {
    //     if (song._id === _data.songId) {
    //       const newCommentList = getNewCommentList(
    //         _action,
    //         song.comments,
    //         _data.songId,
    //         _data.user,
    //         _data.newText,
    //         _data.comment,
    //       )
    //       return { ...song, comments: newCommentList }
    //     }
    //     return song
    //   })
    // })

    const getSongInView: ISong | undefined = queryClient.getQueryData(queryKey)
    if (getSongInView) {
      const newCommentList = getNewCommentList(
        _action,
        getSongInView?.comments,
        _data.songId,
        _data.user,
        _data.newText,
        _data.comment,
      )
      const updatedSongInView = { ...getSongInView, comments: newCommentList }
      queryClient.setQueryData(queryKey, updatedSongInView)
    }
    return getSongInView
  }

  const onError = (prevSongs: ISong) => {
    queryClient.setQueryData(['songs', 'current', prevSongs?._id], prevSongs)
  }

  const onSettled = () => {
    queryClient.invalidateQueries(['songs'])
  }

  return { onMutate, onError, onSettled }
}
