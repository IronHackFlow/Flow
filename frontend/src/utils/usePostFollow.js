import { useContext, useState } from "react";
import actions from "../api.js";
import TheContext from "../contexts/TheContext.js"
import { SongDataContext } from "../contexts/SongData.js"

export default function usePostFollow() {
  const { user } = useContext(TheContext);
  const { homeFeedSongs, setHomeFeedSongs, allSongFollowers, setAllSongFollowers } = useContext(SongDataContext)

  const initialFollowers = {
    IS_FOLLOWED: false,
    USERS_FOLLOW_TO_DELETE: null,
    TOTAL_FOLLOWERS: null,
  }
  const [followers, setFollowers] = useState(initialFollowers)
  
  const postFollow = (songUserId, setUsersFollow) => {
    if (songUserId == null || setUsersFollow == null) return 
    actions
      .addFollow({ followed_user: songUserId, date: new Date() })
      .then(res => {
        console.log(`ADDED a FOLLOW: ---`, res.data.follow, `--- by ${res.data.user.user_name} to ${res.data.followed_user.user_name}'s followers:`, res.data.followed_user.followers)
        const songUserFollowers = res.data.followed_user.followers
        const followToDelete = res.data.follow
        setUsersFollow(followToDelete)

        let toUpdate = homeFeedSongs.map(each => {
          if (each.song.song_user._id === songUserId) {
            return {...each, song: { ...each.song, song_user: { ...each.song.song_user, followers: songUserFollowers }}}
          }
          else return each
        })
        setHomeFeedSongs(toUpdate)

      })
      .catch(console.error)
  }
    
  const deleteFollow = (songUserId, toDelete) => {
    if (songUserId == null || toDelete == null) return 
    actions
      .deleteFollow({ followed_user: songUserId, followToDelete: toDelete })
      .then(res => {
        console.log(`DELETED a FOLLOW: ---`, res.data.follow, `--- by ${res.data.user.user_name} from ${res.data.followed_user.user_name}'s followers:`, res.data.followed_user.followers)
        const songUserFollowers = res.data.followed_user.followers

        let toUpdate = homeFeedSongs.map(each => {
          if (each.song.song_user._id === songUserId) {
            return {...each, song: { ...each.song, song_user: { ...each.song.song_user, followers: songUserFollowers }}}
          }
          else return each
        })
        setHomeFeedSongs(toUpdate)
      })
      .catch(console.error)
  }

  const handleInViewFollowers = async (songId) => {
    if (songId == null) return
    setFollowers(initialFollowers)
    let followed = false
    let followToDelete = null
    let totalFollowers = null

    await allSongFollowers.filter(each => {
      if (each.songId === songId) {
        totalFollowers = each.followers.length

        each.followers.filter(each => {
          if (each.user === user?._id) {
            followed = true
            followToDelete = each
          }
        })
      }
    })

    setFollowers(prevFollowers => ({
      ...prevFollowers,
      IS_FOLLOWED: followed,
      TOTAL_FOLLOWERS: totalFollowers,
      USERS_FOLLOW_TO_DELETE: followToDelete
    }))
  }

  const handlePostFollow = (songUserId, isFollowed, toDelete) => {
    if (songUserId === user._id) return 
    else if (isFollowed) return deleteFollow(songUserId, toDelete)
    else return postFollow(songUserId)
  }

  return { 
    handlePostFollow, 
    handleInViewFollowers,
    deleteFollow,
    postFollow,
    initialFollowers,
    followers, 
    setFollowers
  }
}