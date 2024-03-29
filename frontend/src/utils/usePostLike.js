import { useContext, useState } from 'react'
import actions from '../api.js'
import { SongDataContext } from '../contexts/SongData'

export default function usePostLike() {
  const { homeFeedSongs, setHomeFeedSongs } = useContext(SongDataContext)

  const addSongLike = (songId, setUsersLike) => {
    if (songId == null || setUsersLike == null) return

    actions
      .addSongLike({ songId: songId, date: new Date() })
      .then(res => {
        console.log(
          `ADDED a SONGLIKE: ---`,
          res.data.like,
          `--- to ${res.data.song.name}'s song_likes: `,
          res.data.song.song_likes,
        )

        const songLikes = res.data.song.song_likes
        const likeToDelete = res.data.like

        setUsersLike(likeToDelete)

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            return { ...each, song: { ...each.song, song_likes: songLikes } }
          } else return each
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
        console.log(
          `DELETED a SONGLIKE: ---`,
          res.data.like,
          `--- from ${res.data.song.name}'s song_likes: `,
          res.data.song.song_likes,
        )

        const songLikes = res.data.song.song_likes

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            return { ...each, song: { ...each.song, song_likes: songLikes } }
          } else return each
        })

        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  const addCommentLike = async (commentId, songId, setUsersLike) => {
    if (commentId == null || songId == null || setUsersLike == null) return
    await actions
      .addCommentLike({ commentId: commentId, date: new Date() })
      .then(res => {
        console.log(
          `ADDED a COMMENTLIKE: ---`,
          res.data.like,
          `--- to ${res.data.comment._id}'s likes: `,
          res.data.comment.likes,
        )
        const commentLikes = res.data.comment.likes
        const likeToDelete = res.data.like
        setUsersLike(likeToDelete)

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            let songComments = each.song.song_comments.map(comm => {
              if (comm._id === commentId) {
                return {
                  ...comm,
                  likes: commentLikes,
                }
              } else return comm
            })
            return { ...each, song: { ...each.song, song_comments: songComments } }
          } else return each
        })
        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  const deleteCommentLike = async (commentId, songId, toDelete) => {
    if (commentId == null || songId == null || toDelete == null) return

    await actions
      .deleteCommentLike({ commentId: commentId, likeToDelete: toDelete })
      .then(res => {
        console.log(
          `DELETED a COMMENTLIKE: ---`,
          res.data.like,
          `--- from ${res.data.comment._id}'s likes: `,
          res.data.comment.likes,
        )
        const commentLikes = res.data.comment.likes

        let updateFeed = homeFeedSongs.map(each => {
          if (each.song._id === songId) {
            let songComments = each.song.song_comments.map(comm => {
              if (comm._id === commentId) {
                return {
                  ...comm,
                  likes: commentLikes,
                }
              } else return comm
            })
            return { ...each, song: { ...each.song, song_comments: songComments } }
          } else return each
        })
        setHomeFeedSongs(updateFeed)
      })
      .catch(console.error)
  }

  return {
    addCommentLike,
    deleteCommentLike,
    addSongLike,
    deleteSongLike,
  }
}
