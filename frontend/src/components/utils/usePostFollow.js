import { useContext, useState } from "react";
import actions from "../../api.js";
import TheContext from "../../TheContext.js"
import { songData } from "../songFeedComponents/SongData.js"

export default function usePostFollow() {
  const { user } = useContext(TheContext);
  const { followersArrTest, setFollowersArrTest } = useContext(songData)
  const [followers, setFollowers] = useState()
  
  const postFollow = async (songId, songUserId) => {
    await actions
      .addFollow({ followedUser: songUserId, followDate: new Date() })
      .then(res => {
        console.log(`ADDED a FOLLOW to: `, res.data.followedData._doc)
        const songUserFollowers = res.data.followedData._doc.followers
        const userToDelete = res.data.newFollow

        setFollowers(prevFollowers => ({
          ...prevFollowers,
          'IS_FOLLOWED': true,
          'TOTAL_FOLLOWERS': songUserFollowers.length,
          'USERS_FOLLOW_TO_DELETE': userToDelete
        }))
        
        let newFollowersArr = followersArrTest.map(song => {
          if (song.songId === songId) {
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
          'IS_FOLLOWED': false,
          'TOTAL_FOLLOWERS': songUserFollowers.length,
          'USERS_FOLLOW_TO_DELETE': null
        }))

        let newFollowersArr = followersArrTest?.map(song => {
          if (song.songId === songId) {
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

  return { 
    handlePostFollow, 
    followers, 
    setFollowers
  }
}