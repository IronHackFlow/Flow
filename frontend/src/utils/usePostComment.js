import { useContext, useState } from "react"
import actions from "../api"
import { songData } from "../contexts/SongData"
import TheContext from "../contexts/TheContext"

export default function usePostComment() {
  const { user } = useContext(TheContext)
  const { allSongComments, setAllSongComments } = useContext(songData)

  const initialComments = {
    USERS_COMMENT: false,
    USER_COMMENT_TO_DELETE: null,
    TOTAL_COMMENTS: null
  }
  const [comments, setComments] = useState(initialComments)

  const handlePostComment = (songId, commentString) => {
    actions
      .addComment({
        songId: songId,
        comment: commentString,
        date: new Date(),
      })
      .then(res => {
        console.log(`ADDED a COMMENT: ---`, res.data.comment, `--- to ${res.data.song.name}'s song_comments: `, res.data.song.song_comments)
        const songComments = res.data.song.song_comments
        const commentToDelete = res.data.comment

        setComments(prevComments => ({
            ...prevComments,
            TOTAL_COMMENTS: songComments,
            USER_COMMENT_TO_DELETE: commentToDelete,
        }))
        
        let newCommentsArr = allSongComments.map(comment => {
            if (comment.songId === songId) {
              return {...comment, comments: songComments }
            } else {
              return comment
            }
          })

        setAllSongComments(newCommentsArr)
      })
      .catch(console.error)
  }

  const handleDeleteComment = (songId, toDelete) => {
    if (user?._id !== toDelete.user._id) return
    actions
      .deleteComment({ songId: songId, commentToDelete: toDelete })
      .then(res => {
        console.log(`DELETED a COMMENT: ---`, res.data.comment, `--- from ${res.data.song.name}'s song_comments: `, res.data.song.song_comments)
        const songComments = res.data.song.song_comments

        setComments(prevComments => ({
          ...prevComments,
          TOTAL_COMMENTS: songComments,
          USER_COMMENT_TO_DELETE: null
        }))

        let newCommentsArr = allSongComments.map(comment => {
          if (comment.songId === songId) {
            return {...comment, comments: songComments }
          } else {
            return comment
          }
        })

        setAllSongComments(newCommentsArr)
      
      })
      .catch(console.error)
  }

  return {
    handlePostComment,
    handleDeleteComment,
    initialComments,
    comments,
    setComments
  }
}