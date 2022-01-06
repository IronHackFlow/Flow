import { useContext } from 'react'
import TheContext from '../../TheContext'
import { songData } from '../songFeedComponents/SongData'

export default function HandleLikeAndFollowData() {
  const { user } = useContext(TheContext)
  const { homeFeedArrTest, likesArrTest, followersArrTest } = useContext(songData)

  const getLikeData = (songId) => {

    const filterSong = likesArrTest.filter(each => each.songId === songId)
    const songLikes = filterSong[0].likes
    const songLikesTotal = filterSong[0].likes.length
    const { liked, likeToDelete } = checkIfLiked(songLikes, user._id)
    return { liked, songLikesTotal, likeToDelete }
  }

  const getFollowData = (songId) => {

    const filterSong = followersArrTest.filter(each => each.songId === songId)
    const followers = filterSong[0].followers
    const followersTotal = filterSong[0].followers.length
    const { followed, followToDelete } = checkIfFollowed(followers, user._id)
    return { followed, followersTotal, followToDelete }
  }
  
  const checkIfLiked = (likes, userId) => {
    let liked = false
    let likeToDelete = {}

    likes.forEach(each => {
      if (each.likeUser === userId) {
        liked = true
        likeToDelete = each
      }
    })
    return { liked, likeToDelete }
  }

  const checkIfFollowed = (followers, userId) => {
    let followed = false
    let followToDelete = {}

    followers.forEach(each => {
      if (each.follower === userId) {
        followed = true
        followToDelete = each
      }
    })
    return { followed, followToDelete }
  }
  const runLikeHandler = (songId) => {
    const { liked, songLikesTotal, likeToDelete } = getLikeData(songId)
    return { liked, songLikesTotal, likeToDelete }
  }
  return {
    getLikeData,
    getFollowData
  }
}