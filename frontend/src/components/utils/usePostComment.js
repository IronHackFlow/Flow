import { useContext, useState } from "react"
import actions from "../../api"
import { songData } from "../songFeedComponents/SongData"
import TheContext from "../../TheContext"

export default function usePostComment() {
  const { user } = useContext(TheContext)
  const { commentsArrTest, setCommentsArrTest } = useContext(songData)
  const [comments, setComments] = useState()

  const postComment = (commentString, songId) => {
    actions
      .addComment({
        comment: commentString,
        commSong: songId,
        commDate: new Date(),
      })
      .then(res => {
        const songComments = res.data.song.songComments
        const userCommentToDelete = res.data.userComment
        console.log(songComments, "new comments comin at ya")

        setComments(prevComments => ({
            ...prevComments,
            'TOTAL_COMMENTS': songComments.length,
            'USER_COMMENT_TO_DELETE': userCommentToDelete,
        }))
        
        let newCommentsArr = commentsArrTest.map(comment => {
            if (comment.songId === songId) {
              return {...comment, comments: songComments }
            } else {
              return comment
            }
          })
        setCommentsArrTest(newCommentsArr)
      })
      .catch(console.error)

  }

  const deleteComment = (toDelete, songId) => {
    if (user._id === toDelete.commUser._id) {
      actions
        .deleteComment({ deleteObj: toDelete, songId: songId })
        .then(res => {
          const songComments = res.data.songComments
        //   resetCommentsArray(comments)
          setComments(prevComments => ({
            ...prevComments,
            'TOTAL_COMMENTS': songComments.length
          }))
  
          let newCommentsArr = commentsArrTest.map(comment => {
            if (comment.songId === songId) {
              return {...comment, comments: songComments }
            } else {
              return comment
            }
          })
          setCommentsArrTest(newCommentsArr)
        
        })
        .catch(console.error)
    } else {
      console.log("You can't delete your friend's comments jerk!")
    }
  }

  const handlePostComment = (e,  songId, commentString, toDelete) => {

  }
  return {
    handlePostComment,
    postComment,
    deleteComment,
    comments,
    setComments
  }
}