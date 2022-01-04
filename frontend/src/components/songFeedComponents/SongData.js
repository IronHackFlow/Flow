import { createContext, useState, useEffect} from "react"
import actions from "../../api"
import gifsArr from "../../images/gifs.json"

export const songData = createContext(SongData)

export default function SongData() {
  const gifsCopy = [...gifsArr];
  const [homeFeedArrTest, setHomeFeedArrTest] = useState([]);
  const [trendingFeedArrTest, setTrendingFeedArrTest] = useState([]);
  const [commentsArrTest, setCommentsArrTest] = useState([])
  const [likesArrTest, setLikesArrTest] = useState([]);
  const [followersArrTest, setFollowersArrTest] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const controller = new AbortController()
    const signal = controller.signal
    
    actions
     .getMostLikedSongs()
     .then(res => {
       console.log(res.data, "SONGDATA COMPONENT WAS CALLED")
       let commentsArray = []
       let likesArray = []
       let followersArray = []
 
       const songsArray = res.data.map((each, index) => {
         commentsArray.push({ songId: each._id, comments: each.songComments })
         likesArray.push({ songId: each._id, likes: each.songLikes })
         followersArray.push({ songId: each._id, followers: each.songUser.followers })
         return { song: each, songVideo: gifsCopy[index].url }
       }).reverse()

       const sortByLikes = res.data.sort((a, b) => b.songLikes.length - a.songLikes.length)
       const trendingArray = sortByLikes.map((each, index) => {   
         return { song: each, songVideo: gifsCopy[index].url }
       })
 
       setTrendingFeedArrTest(trendingArray)
       setCommentsArrTest(commentsArray)
       setFollowersArrTest(followersArray)
       setLikesArrTest(likesArray)
       setHomeFeedArrTest(songsArray)
       setIsLoading(false)
     }, signal)
     .catch(console.error)
  }, [])

  return { 
    homeFeedArrTest, setHomeFeedArrTest, 
    trendingFeedArrTest, setTrendingFeedArrTest, 
    commentsArrTest, setCommentsArrTest,
    likesArrTest, setLikesArrTest,
    followersArrTest, setFollowersArrTest,
    isLoading, setIsLoading
  }
}
