import React, { useState, useRef } from "react";
import actions from "../../api.js";
import TheContext from "../../TheContext.js"

export default function usePostFollow() {
  const { user } = React.useContext(TheContext);
  const [totalFollowers, setTotalFollowers] = useState();
  const [returnFollowSongId, setReturnFollowSongId] = useState();
  const [updateFollowFeed, setUpdateFollowFeed] = useState([]);

  const followCheck = (userId) => {
    if (user._id === userId) {
      console.log(`You can't follow yourself`)
    } else {
      actions
      .getAUser({ id: userId })
      .then(res => {
        let deleteObj = null
        let followArr = res.data.followers
        
        for (let i = 0; i < followArr.length; i++) {
          if (followArr[i].follower === user._id) {
            deleteObj = followArr[i]
          }
        }

        if (deleteObj) return deleteFollow(userId, deleteObj)
        else return postFollow(userId)
      })
      .catch(console.error)
    }
  }
    
  const postFollow = (userId) => {
    actions
      .addFollow({ followedUser: userId, followDate: new Date() })
      .then(res => {
        console.log(`added a follow to: `, res.data.followedData._doc)
        setTotalFollowers(res.data.followedData._doc.followers)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows)
      })
      .catch(console.error)
  }
    
  const deleteFollow = (userId, deleteObj) => {
    actions
      .deleteFollow({ followedUser: userId, deleteObj: deleteObj })
      .then(res => {
        console.log(`deleted a follow from: `, res.data.followerData._doc)
        setTotalFollowers(res.data.followedData._doc.followers)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows)
      })
      .catch(console.error)
  }

  const handlePostFollow = (userId, songId) => {
    console.log("Gonna handle this Follow", userId)
    setReturnFollowSongId(songId)
    followCheck(userId)
  }

  return { handlePostFollow, returnFollowSongId, setReturnFollowSongId, totalFollowers, setTotalFollowers, updateFollowFeed }
}