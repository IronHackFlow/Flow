import { createContext, useState, useEffect} from "react"
import actions from "../api"
import gifsArr from "../assets/images/gifs.json"

const SongDataContext = createContext()

function SongDataProvider({ children }) {
  const gifsCopy = [...gifsArr];
  const [homeFeedSongs, setHomeFeedSongs] = useState([]);
  const [allSongComments, setAllSongComments] = useState([])
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

      const songsArray = res.data.map((each, index) => {
        commentsArray.push({ songId: each._id, comments: each.song_comments })
        return { song: each, songVideo: gifsCopy[index].url }
      }).reverse()

      setHomeFeedSongs(songsArray)
      setAllSongComments(commentsArray)

      console.timeEnd('HOW SLOW IS THIS SONG DATA??')
    }, { signal: signal})
    .catch(console.error)
    .finally(() => setIsLoading(false))
    return () => controller.abort()
  }, [])

  return (
    <SongDataContext.Provider value={{
      homeFeedSongs, setHomeFeedSongs, 
      allSongComments, setAllSongComments,
      isLoading, setIsLoading
    }}
    >
      {children}
    </SongDataContext.Provider>
  )
}


export { SongDataProvider, SongDataContext }
