import { useQueryClient } from 'react-query'
import { ISong } from '../../../interfaces/IModels'

const handleUpdateSocialList = (_action: 'add' | 'delete', _list: string[], _userId: string) => {
  if (_action === 'add') return [..._list, _userId]
  return [..._list].filter(each => each !== _userId)
}

export function useHandleLikeOrFollowOnMutate() {
  const queryClient = useQueryClient()

  const onMutate = (
    _type: 'likes' | 'followers',
    _action: 'add' | 'delete',
    _data: { song: ISong; userId: string; id: string },
  ) => {
    const previousSongs = queryClient.getQueryData('songs')

    queryClient.setQueryData('songs', (prevSongs: any) => {
      return prevSongs.map((song: any) => {
        if (_type === 'likes') {
          if (song._id === _data.id) {
            const updatedLikes = handleUpdateSocialList(_action, song.likes, _data.userId)
            return { ...song, likes: updatedLikes }
          }
          return song
        } else {
          if (song.user._id === _data.song.user._id) {
            const updatedFollowers = handleUpdateSocialList(
              _action,
              song.user.followers,
              _data.userId,
            )
            return { ...song, user: { ...song.user, followers: updatedFollowers } }
          }
          return song
        }
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
