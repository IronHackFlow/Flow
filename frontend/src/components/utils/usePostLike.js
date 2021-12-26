import React, { useCallback, useState } from "react";
import actions from "../../api.js";
import TheContext from "../../TheContext.js"

export default function useHandleLike() {
  const { user } = React.useContext(TheContext);
  const [totalLikes, setTotalLikes] = useState();
  const [totalCommentLikes, setTotalCommentLikes] = useState();
  const [returnLikeSongId, setReturnLikeSongId] = useState();

  const checkSongLikes = (id) => {
    actions
      .getSong({ id : id })
      .then(res => {
        let deleteData = null
        res.data.songLikes.forEach(each => {
          if (each.likeUser === user._id) {
            deleteData = each
          }
        })
        if (deleteData) return deleteLikeSong(id, deleteData)
        else return addLikeSong(id)
      })
      .catch(console.error)
  }

  const checkCommentLikes = (id) => {
    actions
      .getAComment({ id: id })
      .then(res => {
        let deleteData = null
        res.data.commLikes.forEach(each => {
          if (each.likeUser === user._id) {
            deleteData = each
          }
        })
        if (deleteData) return deleteLikeComment(deleteData)
        else return addLikeComment(id)
      })
      .catch(console.error)
  }

  const addLikeSong = (id) => {
    actions
    .addLike({ likerSong: id, likeDate: new Date(), commLike: false})
    .then(res => {
      console.log('added a like to: ', res.data)
      setTotalLikes(res.data.songLikes?.length)
    })
    .catch(console.error)
  }

  const addLikeComment = (id) => {
    actions
    .addLike({ likedComment: id, likeDate: new Date(), commLike: true})
    .then(res => {
      console.log('added a like to: ', res.data)
      setTotalCommentLikes(res.data.commLikes?.length)

    })
    .catch(console.error)
  }

  const deleteLikeSong = (id, deleteData) => {
    actions
    .deleteLike({
      likerSong: id,
      deleteObj: deleteData,
      commLike: false,
    })
    .then(res => {
      console.log(`deleted a like from: `, res.data)
      setTotalLikes(res.data.songLikes?.length)
    })
    .catch(console.error)
  }

  const deleteLikeComment = (deleteData) => {
    actions
      .deleteLike({ deleteObj: deleteData, commLike: true })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        setTotalCommentLikes(res.data.commLikes?.length)
      })
      .catch(console.error)
  }
  
  const handlePostLike = (model, id, arr) => {
    console.log(`Gonna handle this ${model} Like`)
    setReturnLikeSongId(id)
    
    if (model === "Song") {
      checkSongLikes(id)
    } else {
      checkCommentLikes(id)
    }
  }

  return { 
    handlePostLike, 
    returnLikeSongId,
    setReturnLikeSongId,
    totalLikes, 
    setTotalLikes, 
    totalCommentLikes, 
    setTotalCommentLikes 
  }
}
