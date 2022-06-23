import { createContext, useState, useEffect } from 'react'
import { generateSongArray, tempMockSong } from '../../pages/_Home/initialData'
import { ISong } from '../../interfaces/IModels'

// import actions from '../api'
// import gifsArr from '../assets/images/gifs.json'
// import { Comments, Song } from '../constants/Types'
// import { useSongs } from '../../hooks/useQueries_REFACTOR/useSongs'

// const UseGetSongs = () => {
//   const gifsCopy = [...gifsArr]
//   const [homeFeedSongs, setHomeFeedSongs] = useState<Array<{song: Song, songVideo: string}>>([])
//   const [allSongComments, setAllSongComments] = useState<Array<{songId: string, comments: [Comments]}>>()
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   useEffect(() => {
//     console.time('HOW SLOW IS THIS SONG DATA??')
//     setIsLoading(true)
//     const controller = new AbortController()
//     const signal = controller.signal

//     actions
//       .getAllSongs()
//       .then(
//         (res: any) => {
//           console.log(res.data, 'SONGDATA COMPONENT WAS CALLED')

//           const commentsArray: Array<{songId: string, comments: [Comments]}> = []

//           const songsArray: any = res.data
//             .map((each: Song, index: number) => {
//               if (each.song_comments) {
//                 commentsArray.push({ songId: each._id, comments: each.song_comments })
//               }
//               return { song: each, songVideo: gifsCopy[index].url }
//             })
//             .reverse()

//           setHomeFeedSongs(songsArray)
//           console.log(songsArray, "WHAT")
//           setAllSongComments(commentsArray)

//           console.timeEnd('HOW SLOW IS THIS SONG DATA??')
//         }
//       )
//       .catch(console.error)
//       .finally(() => setIsLoading(false))
//     return () => controller.abort()
//   }, [])

//   return {
//     homeFeedSongs, setHomeFeedSongs, allSongComments, setAllSongComments, isLoading, setIsLoading
//   }
// }
function useSongs() {
  const [songs, setSongs] = useState<ISong[]>([])

  useEffect(() => {
    let getSongs = generateSongArray()
    setSongs(getSongs)
  }, [])

  return { songs, setSongs }
}

const SongDataProvider: React.FunctionComponent = ({ children }: React.PropsWithChildren<{}>) => {
  const values = useSongs()
  return (
    <SongDataContext.Provider
      value={values}
    >
      {children}
    </SongDataContext.Provider>
  )
}
type UseGetSongsType = ReturnType<typeof useSongs>
const SongDataContext = createContext<UseGetSongsType>({ songs: [], setSongs: () => []})


export { SongDataProvider, SongDataContext }
