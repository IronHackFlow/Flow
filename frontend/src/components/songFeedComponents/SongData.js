import { createContext, useState, useEffect} from "react"
import actions from "../../api"
import gifsArr from "../../images/gifs.json"

export const songData = createContext(SongData)

export default function SongData() {
  const gifsCopy = [...gifsArr];
  const [homeFeedArrTest, setHomeFeedArrTest] = useState([]);
  const [trendingFeedArrTest, setTrendingFeedArrTest] = useState([]);
  const [commentsArrTest, setCommentsArrTest] = useState([])
  const [commentLikesArrTest, setCommentLikesArrTest] = useState([])
  const [likesArrTest, setLikesArrTest] = useState([]);
  const [followersArrTest, setFollowersArrTest] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.time('HOW SLOW IS THIS SONGDATA??')
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
        // each.song_comments.forEach(each => {
        //   commentLikesArray.push({ commentId: each._id, userId: each.user._id,  likes: each.likes })
        // })
        return { song: each, songVideo: gifsCopy[index].url }
      }).reverse()

      const sortByLikes = res.data.sort((a, b) => b.song_likes.length - a.song_likes.length)
      const trendingArray = sortByLikes.map((each, index) => {   
        return { song: each, songVideo: gifsCopy[index].url }
      })



      setHomeFeedArrTest(songsArray)
      setTrendingFeedArrTest(trendingArray)
      setCommentsArrTest(commentsArray)
      setCommentLikesArrTest(commentLikesArray)
      setLikesArrTest(likesArray)
      setFollowersArrTest(followersArray)
      setIsLoading(false)
    }, signal)
    .catch(console.error)

  console.timeEnd('HOW SLOW IS THIS SONG DATA??')
  }, [])

  return { 
    homeFeedArrTest, setHomeFeedArrTest, 
    trendingFeedArrTest, setTrendingFeedArrTest, 
    commentsArrTest, setCommentsArrTest,
    commentLikesArrTest, setCommentLikesArrTest,
    likesArrTest, setLikesArrTest,
    followersArrTest, setFollowersArrTest,
    isLoading, setIsLoading
  }
}
