import { useContext } from 'react'
import actions from '../api.js'
import TheContext from '../contexts/TheContext'
import { SongDataContext } from '../contexts/SongData.js'

export default function usePostFollow() {
  const { user } = useContext(TheContext)
  const { homeFeedSongs, setHomeFeedSongs } = useContext(SongDataContext)

  const postFollow = (songUserId, setUsersFollow) => {
    if (songUserId == null || setUsersFollow == null) return
    if (songUserId === user._id) return console.log("You can't follow yourself")
    actions
      .addFollow({ followed_user: songUserId, date: new Date() })
      .then(res => {
        console.log(
          `ADDED a FOLLOW: ---`,
          res.data.follow,
          `--- by ${res.data.user.user_name} to ${res.data.followed_user.user_name}'s followers:`,
          res.data.followed_user.followers,
        )
        const songUserFollowers = res.data.followed_user.followers
        const followToDelete = res.data.follow
        setUsersFollow(followToDelete)

        let toUpdate = homeFeedSongs.map(each => {
          if (each.song.song_user._id === songUserId) {
            return {
              ...each,
              song: {
                ...each.song,
                song_user: { ...each.song.song_user, followers: songUserFollowers },
              },
            }
          } else return each
        })
        setHomeFeedSongs(toUpdate)
      })
      .catch(console.error)
  }

  const deleteFollow = (songUserId, toDelete) => {
    if (songUserId == null || toDelete == null) return
    if (songUserId === user._id) return

    actions
      .deleteFollow({ followed_user: songUserId, followToDelete: toDelete })
      .then(res => {
        console.log(
          `DELETED a FOLLOW: ---`,
          res.data.follow,
          `--- by ${res.data.user.user_name} from ${res.data.followed_user.user_name}'s followers:`,
          res.data.followed_user.followers,
        )
        const songUserFollowers = res.data.followed_user.followers

        let toUpdate = homeFeedSongs.map(each => {
          if (each.song.song_user._id === songUserId) {
            return {
              ...each,
              song: {
                ...each.song,
                song_user: { ...each.song.song_user, followers: songUserFollowers },
              },
            }
          } else return each
        })
        setHomeFeedSongs(toUpdate)
      })
      .catch(console.error)
  }

  return {
    deleteFollow,
    postFollow,
  }
}
