import React, { useState, useEffect } from "react";
import actions from "../api.js";
import TheContext from "../TheContext.js"

export default function useHandleLike() {
  const { user } = React.useContext(TheContext);
  const [model, setModel] = useState("");
  const [id, setId] = useState();
  const [toggleLikeCheck, setToggleLikeCheck] = useState(0)
  const [totalLikes, setTotalLikes] = useState();
  const [totalCommentLikes, setTotalCommentLikes] = useState();

  useEffect(() => {
    if (model === "Song") {
      actions
        .getSong({ id : id })
        .then(res => {
          let deleteData = null
          res.data.songLikes.forEach(each => {
            if (each.likeUser === user._id) {
              deleteData = each
            }
          })
          console.log(deleteData, "is this changing?")
          if (deleteData) return deleteLikeSong(id, deleteData)
          else return addLikeSong(id)
        })
        .catch(console.error)
    } else if (model === "Comment") {
      actions
        .getAComment({ id: id })
        .then(res => {
          let deleteData = null
          res.data.commLikes.forEach(each => {
            if (each.likeUser === user._id) {
              deleteData = each
            }
          })
          if (deleteData) return deleteLikeComment(id, deleteData)
          else return addLikeComment(id)
        })
        .catch(console.error)
    }
  }, [toggleLikeCheck])

  function addLikeSong(id) {
    actions
    .addLike({ likerSong: id, likeDate: new Date(), commLike: false})
    .then(res => {
      console.log(`added a like to: `, res.data)
      setTotalLikes(res.data.songLikes?.length)
    })
    .catch(console.error)
  }

  function addLikeComment(id) {
    actions
    .addLike({ likedComment: id, likeDate: new Date(), commLike: true})
    .then(res => {
      console.log(`added a like to: `, res.data)
      setTotalCommentLikes(res.data.commLikes?.length)

    })
    .catch(console.error)
  }

  function deleteLikeSong(id, deleteData) {
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

  function deleteLikeComment(id, deleteData) {
    actions
      .deleteLike({ deleteObj: deleteData, commLike: true })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        setTotalCommentLikes(res.data.commLikes?.length)
      })
      .catch(console.error)
  }
  const handleLike = (model, id, value) => {
    setModel(model)
    setId(id)
    setToggleLikeCheck(toggleLikeCheck + value)
  }

  return { handleLike, totalLikes, setTotalLikes, totalCommentLikes, setTotalCommentLikes }
}
