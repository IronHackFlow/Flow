import { useContext, useState } from "react";
import actions from "../api.js";
import { SongDataContext } from "../contexts/SongData";
import TheContext from "../contexts/TheContext.js"

export default function usePostLike() {
  const { user } = useContext(TheContext)
  const {homeFeedSongs, setHomeFeedSongs,  allSongComments, setAllSongComments } = useContext(SongDataContext)

  const initialLikes = {
    TYPE: 'SONG',
    IS_LIKED: false,
    USERS_LIKE_TO_DELETE: null,
    TOTAL_LIKES: null,
  }
  const initialCommentLikes = {
    TYPE: 'COMMENT',
    IS_LIKED: false,
    USERS_COMMENTLIKE_TO_DELETE: null,
    TOTAL_COMMENT_LIKES: null,
  }
  const [likes, setLikes] = useState(initialLikes);
  const [commentLikes, setCommentLikes] = useState(initialCommentLikes);

  const addSongLike = (songId, setUsersLike) => {
    if (songId == null || setUsersLike == null) return

    actions
      .addSongLike({ songId: songId, date: new Date() })
      .then(res => {
        console.log(`ADDED a SONGLIKE: ---`, res.data.like, `--- to ${res.data.song.name}'s song_likes: `, res.data.song.song_likes)
       
        const songLikes = res.data.song.song_likes
        const likeToDelete = res.data.like

        setUsersLike(likeToDelete)

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            return {...each, song: { ...each.song, song_likes: songLikes }}
          }
          else return each
        })

        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  const deleteSongLike = (songId, toDelete) => {
    if (songId == null || toDelete == null) return

    actions
      .deleteSongLike({ songId: songId, likeToDelete: toDelete })
      .then(res => {
        console.log(`DELETED a SONGLIKE: ---`, res.data.like, `--- from ${res.data.song.name}'s song_likes: `, res.data.song.song_likes)
        
        const songLikes = res.data.song.song_likes

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            return {...each, song: { ...each.song, song_likes: songLikes }}
          }
          else return each
        })

        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  const addCommentLike = async (commentId, songId) => {
    await actions
      .addCommentLike({ commentId: commentId, date: new Date() })
      .then(res => {
        console.log(`ADDED a COMMENTLIKE: ---`, res.data.like, `--- to ${res.data.comment._id}'s likes: `, res.data.comment.likes)
        const commentLikes = res.data.comment.likes
        const likeToDelete = res.data.like

        setCommentLikes(prevCommentLikes => ({
          ...prevCommentLikes,
          IS_LIKED: true,
          TOTAL_COMMENT_LIKES: commentLikes.length,
          USERS_COMMENTLIKE_TO_DELETE: likeToDelete
        }))

        updateCommentsArr(commentId, songId, commentLikes)
      })
      .catch(console.error)
  }

  const deleteCommentLike = async (commentId, toDelete, songId) => {
    await actions
      .deleteCommentLike({ commentId: commentId, likeToDelete: toDelete })
      .then(res => {
        console.log(`DELETED a COMMENTLIKE: ---`, res.data.like, `--- from ${res.data.comment._id}'s likes: `, res.data.comment.likes)
        const commentLikes = res.data.comment.likes

        setCommentLikes(prevCommentLikes => ({
          ...prevCommentLikes,
          IS_LIKED: false,
          TOTAL_COMMENT_LIKES: commentLikes.length,
          USERS_COMMENTLIKE_TO_DELETE: null,
        }))

        updateCommentsArr(commentId, songId, commentLikes)
      })
      .catch(console.error)
  }

  // const updateLikesArr = (songId, newLikes) => {
  //   let newLikesArr = allSongLikes.map(like => {
  //     if (like.songId === songId) {
  //       return {...like, likes: newLikes }
  //     } else {
  //       return like
  //     }
  //   })
  //   setAllSongLikes(newLikesArr)
  // }

  const updateCommentsArr = (commentId, songId, newLikes) => {
    let newCommentArr = allSongComments.map(song => {
      if (song.songId === songId) {

        let newCommentLikes = song.comments.map(comment => {
          if (comment._id === commentId) {
            return {...comment, likes: newLikes }
          } else {
            return comment
          }
        })
        return {...song, comments: newCommentLikes }
      } else {
        return song 
      }
    })
    setAllSongComments(newCommentArr)
  }

  const handleInViewCommentLikes = async (commentId, songId) => {
    if (commentId == null) return

    let likeData = await allSongComments.filter(song => song.songId === songId)

    const { liked, likeToDelete, likesArr } = await filterLikesArray(likeData[0]?.comments, '_id', commentId)

    setCommentLikes(prevCommentLikes => ({
      ...prevCommentLikes,
      IS_LIKED: liked,
      TOTAL_COMMENT_LIKES: likesArr?.length,
      USERS_COMMENTLIKE_TO_DELETE: likeToDelete
    }))
  }

  // const handleInViewLikes = async (songId) => {
  //   if (songId == null) return
  //   setLikes(initialLikes)

  //   const { liked, likeToDelete, likesArr } = await filterLikesArray(allSongLikes, 'songId', songId)

  //   setLikes(prevLikes => ({
  //     ...prevLikes,
  //     IS_LIKED: liked,
  //     TOTAL_LIKES: likesArr?.length,
  //     USERS_LIKE_TO_DELETE: likeToDelete
  //   }))
  // }

  const filterLikesArray = async (array, key, id) => {
    let liked = false
    let likeToDelete = null
    let likesArr = []

    await array.filter(each => {
      if (each[key] === id) {
        likesArr = each.likes
        likesArr?.filter(like => {
          if (like.user === user?._id) {
            liked = true
            likeToDelete = like
          }
        })
      }
    })
    return { liked, likeToDelete, likesArr }
  }

  const handlePostLike = (like, commentId, songId, songUserId) => {
    if (like.TYPE === "SONG") {
      if (songUserId === user?._id) return 
      else if (like.IS_LIKED) return deleteSongLike(songId, like.USERS_LIKE_TO_DELETE)
      else return addSongLike(songId)
    } else {
      if (like.IS_LIKED) return deleteCommentLike(commentId, like.USERS_COMMENTLIKE_TO_DELETE, songId)
      else return addCommentLike(commentId, songId)
    }
  }

  return { 
    handlePostLike,
    // handleInViewLikes,
    handleInViewCommentLikes,
    initialLikes,
    likes, 
    setLikes,
    commentLikes, 
    setCommentLikes,
    addSongLike,
    deleteSongLike
  }
}
