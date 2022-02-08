import { useContext } from 'react'
import actions from '../api'
import { SongDataContext } from '../contexts/SongData'
import TheContext from '../contexts/TheContext'

export default function usePostComment() {
  const { user } = useContext(TheContext)
  const { homeFeedSongs, setHomeFeedSongs } = useContext(SongDataContext)

  const addComment = (songId, commentString) => {
    if (songId == null || commentString == null) return

    actions
      .addComment({
        songId: songId,
        comment: commentString,
        date: new Date(),
      })
      .then(res => {
        console.log(
          `ADDED a COMMENT: ---`,
          res.data.comment,
          `--- to ${res.data.song.name}'s song_comments: `,
          res.data.song.song_comments,
        )
        const songComments = res.data.song.song_comments
        updateFeed(songId, songComments)
      })
      .catch(console.error)
  }

  const deleteComment = (songId, toDelete) => {
    if (user?._id !== toDelete.user._id || songId == null || toDelete == null) return

    actions
      .deleteComment({ songId: songId, commentToDelete: toDelete })
      .then(res => {
        console.log(
          `DELETED a COMMENT: ---`,
          res.data.comment,
          `--- from ${res.data.song.name}'s song_comments: `,
          res.data.song.song_comments,
        )
        const songComments = res.data.song.song_comments
        updateFeed(songId, songComments)
      })
      .catch(console.error)
  }

  const editComment = (songId, toEdit, commentString) => {
    if (songId == null || toEdit == null) return

    actions
      .editComment({
        songId: songId,
        commentToEdit: toEdit,
        comment: commentString,
        editDate: new Date(),
      })
      .then(res => {
        console.log(
          `EDITED a COMMENT: ---`,
          res.data.comment,
          `--- from ${res.data.song.name}'s song_comments: `,
          res.data.song.song_comments,
        )
        const songComments = res.data.song.song_comments
        updateFeed(songId, songComments)
      })
  }

  const updateFeed = (songId, songComments) => {
    let updateFeed = homeFeedSongs.map(each => {
      if (each.song._id === songId) {
        return { ...each, song: { ...each.song, song_comments: songComments } }
      } else return each
    })
    setHomeFeedSongs(updateFeed)
  }

  return {
    addComment,
    deleteComment,
    editComment,
  }
}
