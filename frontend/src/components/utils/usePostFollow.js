import React, { useState } from "react";
import actions from "../../api.js";
import TheContext from "../../TheContext.js"

export default function usePostFollow() {
  const { user } = React.useContext(TheContext);
  const [totalFollowers, setTotalFollowers] = useState();
  const [updateFollowFeed, setUpdateFollowFeed] = useState();

  function followCheck(id) {
    if (user._id === id) {
      console.log(`You can't follow yourself`)
    } else {
      actions
      .getAUser({ id: id })
      .then(res => {
        let deleteObj = null
        
        res.data.followers.forEach(each => {
          if (each.follower === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj) return deleteFollow(id, deleteObj)
        else return postFollow(id)
      })
      .catch(console.error)
    }
  }
    
  const postFollow = (id) => {
    actions
      .addFollow({ followedUser: id, followDate: new Date() })
      .then(res => {
        console.log(`added a follow to: `, res.data.followedData._doc)
        setTotalFollowers(res.data.followedData._doc.followers.length)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows.reverse())
      })
      .catch(console.error)
  }
    
  const deleteFollow = (id, deleteObj) => {
    actions
      .deleteFollow({ followedUser: id, deleteObj: deleteObj })
      .then(res => {
        console.log(`deleted a follow from: `, res.data.followerData._doc)
        setTotalFollowers(res.data.followedData._doc.followers.length)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows.reverse())
      })
      .catch(console.error)
  }

  const handlePostFollow = (id) => {
    console.log("Gonna handle this Follow", id)
    followCheck(id)
  }

  return { handlePostFollow, totalFollowers, setTotalFollowers, updateFollowFeed, setUpdateFollowFeed}
}