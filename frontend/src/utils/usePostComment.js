import { useContext, useState } from 'react'
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
        const commentToDelete = res.data.comment

        // let updateFeed = homeFeedSongs.map(each => {
        //   if (each.song._id === songId) {
        //     return { ...each, song: { ...each.song, song_comments: songComments } }
        //   } else return each
        // })
        // setHomeFeedSongs(updateFeed)

        setHomeFeedSongs(prev =>
          prev.map(each => {
            if (each.song._id === songId)
              return { ...each, song: { ...each.song, song_comments: songComments } }
            else return each
          }),
        )
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

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            return { ...each, song: { ...each.song, song_comments: songComments } }
          } else return each
        })

        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  return {
    addComment,
    deleteComment,
  }
}
