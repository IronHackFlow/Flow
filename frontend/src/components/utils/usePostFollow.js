import { useContext, useState } from "react";
import actions from "../../api.js";
import TheContext from "../../TheContext.js"
import { songData } from "../songFeedComponents/SongData.js"

export default function usePostFollow() {
  const { user } = useContext(TheContext);
  const { followersArrTest, setFollowersArrTest } = useContext(songData)
  const initialFollowers = {
    IS_FOLLOWED: false,
    ADD_FOLLOW: false,
    DELETE_FOLLOW: false,
    USERS_FOLLOW_TO_DELETE: null,
    TOTAL_FOLLOWERS: null,
  }
  const [followers, setFollowers] = useState(initialFollowers)
  
  const postFollow = async (songId, songUserId) => {
    await actions
      .addFollow({ followedUser: songUserId, followDate: new Date() })
      .then(res => {
        console.log(`ADDED a FOLLOW to: `, res.data.followedData._doc)
        const songUserFollowers = res.data.followedData._doc.followers
        const userToDelete = res.data.newFollow

        setFollowers(prevFollowers => ({
          ...prevFollowers,
          IS_FOLLOWED: true,
          TOTAL_FOLLOWERS: songUserFollowers.length,
          USERS_FOLLOW_TO_DELETE: userToDelete
        }))
        
        let newFollowersArr = followersArrTest.map(song => {
          if (song.songUserId === songUserId) {
            return { ...song, followers: songUserFollowers }
          } else {
            return song
          }
        })
        setFollowersArrTest(newFollowersArr)
      })
      .catch(console.error)
  }
    
  const deleteFollow = async (songId, songUserId, toDelete) => {
    await actions
      .deleteFollow({ followedUser: songUserId, deleteObj: toDelete })
      .then(res => {
        console.log(`DELETED a FOLLOW from: `, res.data.followedData._doc)
        const songUserFollowers = res.data.followedData._doc.followers

        setFollowers(prevFollowers => ({
          ...prevFollowers,
          IS_FOLLOWED: false,
          TOTAL_FOLLOWERS: songUserFollowers.length,
          USERS_FOLLOW_TO_DELETE: null
        }))

        let newFollowersArr = followersArrTest?.map(song => {
          if (song.songUserId === songUserId) {
            return {...song, followers: songUserFollowers }
          } else {
            return song
          }
        })
        setFollowersArrTest(newFollowersArr)
        
      })
      .catch(console.error)
  }

  const handlePostFollow = (songId, songUserId, isFollowed, toDelete) => {
    if (songUserId === user._id) return 
    else if (isFollowed) return deleteFollow(songId, songUserId, toDelete)
    else return postFollow(songId, songUserId)
  }

  async function handleInViewFollowers(songId) {
    if (songId == null) return
    setFollowers(initialFollowers)
    let followed = false
    let followToDelete = {}
    let totalFollowers

    await followersArrTest.filter(each => {
      if (each.songId === songId) {
        totalFollowers = each.followers.length

        each.followers.filter(each => {
          if (each.follower === user._id) {
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

  return { 
    handlePostFollow, 
    handleInViewFollowers,
    initialFollowers,
    followers, 
    setFollowers
  }
}