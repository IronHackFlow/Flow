import { createContext, useContext, useState, useEffect} from "react"
import actions from "../api"
import gifsArr from "../images/gifs.json"

export const songData = createContext(SongData)

export default function SongData() {
  const gifsCopy = [...gifsArr];
  const [homeFeedSongs, setHomeFeedSongs] = useState([]);
  const [trendingFeedSongs, setTrendingFeedSongs] = useState([]);
  const [followingFeedSongs, setFollowingFeedSongs] = useState([])
  const [allSongComments, setAllSongComments] = useState([])
  const [allSongCommentLikes, setAllSongCommentLikes] = useState([])
  const [allSongLikes, setAllSongLikes] = useState([]);
  const [allSongFollowers, setAllSongFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.time('HOW SLOW IS THIS SONG DATA??')
    setIsLoading(true)
    const controller = new AbortController()
    const signal = controller.signal
    
    actions
    .getMostLikedSongs()
    .then(res => {
      console.log(res.data, "SONGDATA COMPONENT WAS CALLED")
      let commentsArray = []
      let commentLikesArray = []
      let likesArray = []
      let followersArray = []

      const songsArray = res.data.map((each, index) => {
        commentsArray.push({ songId: each._id, comments: each.song_comments })
        likesArray.push({ songId: each._id, likes: each.song_likes })
        followersArray.push({ songId: each._id, songUserId: each.song_user._id, followers: each.song_user.followers })
        return { song: each, songVideo: gifsCopy[index].url }
      }).reverse()

      const sortByLikes = res.data.sort((a, b) => b.song_likes.length - a.song_likes.length)
      const trendingArray = sortByLikes.map((each, index) => {   
        return { song: each, songVideo: gifsCopy[index].url }
      })

      setHomeFeedSongs(songsArray)
      setTrendingFeedSongs(trendingArray)
      setAllSongComments(commentsArray)
      setAllSongCommentLikes(commentLikesArray)
      setAllSongLikes(likesArray)
      setAllSongFollowers(followersArray)
      setIsLoading(false)
      console.timeEnd('HOW SLOW IS THIS SONG DATA??')
    }, signal)
    .catch(console.error)
  }, [])

  useEffect(() => {
      const controller = new AbortController()
      const signal = controller.signal
      
      // let filteredArr = []
      // if (updateFollowFeed?.length) {
      //   updateFollowFeed.filter(each => filteredArr.push(each.followed))
      // } else {
      //   user?.userFollows.filter(each => filteredArr.push(each.followed))
      // }

      actions
      .getUserFollowsSongs()
      .then(res => {

        const songsArray = res.data.map((each, index) => {
          return { song: each, songVideo: gifsCopy[index].url }
        }).reverse()

        setFollowingFeedSongs(songsArray)
      }, signal)
      .catch(console.error)
      return () => controller.abort()
  }, [])



  return { 
    homeFeedSongs, setHomeFeedSongs, 
    trendingFeedSongs, setTrendingFeedSongs, 
    followingFeedSongs, setFollowingFeedSongs,
    allSongComments, setAllSongComments,
    allSongCommentLikes, setAllSongCommentLikes,
    allSongLikes, setAllSongLikes,
    allSongFollowers, setAllSongFollowers,
    isLoading, setIsLoading
  }
}
