import { useContext, useState } from "react";
import actions from "../../api.js";
import { songData } from "../songFeedComponents/SongData";
import TheContext from "../../TheContext.js"

export default function usePostLike() {
  const { user } = useContext(TheContext)
  const { likesArrTest, setLikesArrTest } = useContext(songData)

  const initialLikes = {
    TYPE: 'SONG',
    IS_LIKED: false,
    ADD_LIKE: false,
    DELETE_LIKE: false,
    USERS_LIKE_TO_DELETE: null,
    TOTAL_LIKES: null,
  }

  const initialCommentLikes = {
    TYPE: 'COMMENT',
    IS_LIKED: false,
    ADD_LIKE: false,
    DELETE_LIKE: false,
    USERS_COMMENTLIKE_TO_DELETE: null,
    TOTAL_COMMENT_LIKES: null,
  }

  const [likes, setLikes] = useState(initialLikes);
  const [commentLikes, setCommentLikes] = useState(initialCommentLikes);

  const checkCommentLikes = (id) => {
    actions
      .getAComment({ id: id })
      .then(res => {
        let deleteData = null
        let commLikes = res.data.commLikes

        for (let i = 0; i < commLikes.length; i++) {
          if (commLikes[i].likeUser === user._id) {
            deleteData = commLikes[i]
          }
        }

        if (deleteData) return deleteLikeComment(deleteData)
        else return addLikeComment(id)
      })
      .catch(console.error)
  }

  const addLikeSong = async (songId) => {
    await actions
      .addLike({ likerSong: songId, likeDate: new Date(), commLike: false})
      .then(res => {
        console.log('added a like to: ', res.data)
        const songLikes = res.data.song.songLikes
        const usersSongLike = res.data.songLike

        setLikes(prevLikes => ({
          ...prevLikes,
          IS_LIKED: true,
          ADD_LIKE: true,
          DELETE_LIKE: false,
          TOTAL_LIKES: songLikes.length,
          USERS_LIKE_TO_DELETE: usersSongLike
        }))

        let newLikesArr = likesArrTest.map(like => {
          if (like.songId === songId) {
            return {...like, likes: songLikes }
          } else {
            return like
          }
        })
        setLikesArrTest(newLikesArr)
      })
      .catch(console.error)
  }

  const addLikeComment = (id) => {
    actions
    .addLike({ likedComment: id, likeDate: new Date(), commLike: true})
    .then(res => {
      console.log('added a like to: ', res.data)
      const totalCommentLikes = res.data.comment.commLikes.length
      const likeToDelete = res.data.commentLike

      setCommentLikes(prevCommentLikes => ({
        ...prevCommentLikes,
        IS_LIKED: true,
        TOTAL_COMMENT_LIKES: totalCommentLikes,
        USERS_COMMENTLIKE_TO_DELETE: likeToDelete
      }))
    })
    .catch(console.error)
  }

  const deleteLikeSong = async (songId, toDelete) => {
    await actions
      .deleteLike({
        likerSong: songId,
        deleteObj: toDelete,
        commLike: false,
      })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        const songLikes = res.data.song.songLikes

        setLikes(prevLikes => ({
          ...prevLikes,
          IS_LIKED: false,
          DELETE_LIKE: true,
          ADD_LIKE: false,
          TOTAL_LIKES: songLikes.length
        }))
        
        let newLikesArr = likesArrTest.map(like => {
          if (like.songId === songId) {
            return {...like, likes: songLikes }
          } else {
            return like
          }
        })
        setLikesArrTest(newLikesArr)
      })
      .catch(console.error)
  }

  const deleteLikeComment = (deleteData) => {
    actions
      .deleteLike({ deleteObj: deleteData, commLike: true })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        const totalCommentLikes = res.data.commLikes.length

        setCommentLikes(prevCommentLikes => ({
          ...prevCommentLikes,
          IS_LIKED: false,
          TOTAL_COMMENT_LIKES: totalCommentLikes,
        }))
      })
      .catch(console.error)
  }
  
  const handlePostLikeSong = (songId, songUserId, isLiked, toDelete) => {
    if (songUserId === user?._id) return 
    else if (isLiked) return deleteLikeSong(songId, toDelete)
    else return addLikeSong(songId)
  }

  const handlePostLikeComment = (commentId, isLiked, toDelete) => {
    if (isLiked) return deleteLikeComment(toDelete)
    else return addLikeComment(commentId)
  }

  async function handleInViewLikes(songId) {
    if (songId == null) return
    setLikes(initialLikes)
    let liked = false
    let likeToDelete = {}
    let totalLikes

    await likesArrTest.filter(each => {
      if (each.songId === songId) {
        totalLikes = each.likes.length

        each.likes.filter(each => {
          if (each.likeUser === user._id) {
            liked = true
            likeToDelete = each
          }
        })
      }
    })

    setLikes(prevLikes => ({
      ...prevLikes,
      IS_LIKED: liked,
      TOTAL_LIKES: totalLikes,
      USERS_LIKE_TO_DELETE: likeToDelete
    }))
  }

  return { 
    handlePostLikeSong, 
    handlePostLikeComment,
    handleInViewLikes,
    initialLikes,
    likes, 
    setLikes,
    commentLikes, 
    setCommentLikes,
  }
}
