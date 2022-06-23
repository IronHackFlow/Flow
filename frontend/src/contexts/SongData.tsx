import { createContext, useState, useEffect } from 'react'
// import actions from '../api'
// import gifsArr from '../assets/images/gifs.json'
// import { Comments, Song } from '../constants/Types'

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
// const SongDataProvider: React.FunctionComponent = ({ children }: React.PropsWithChildren<{}>) => {
//   const values = UseGetSongs()
//   return (
//     <SongDataContext.Provider
//       value={values}
//     >
//       {children}
//     </SongDataContext.Provider>
//   )
// }
// type UseGetSongsType = ReturnType<typeof UseGetSongs>
// const SongDataContext = createContext<UseGetSongsType>({
//   homeFeedSongs: [{song: {_id: "", name: "", caption: "", date: new Date(), duration: 0, song_URL: "", lyrics: [[""]], song_user: {_id: "", user_name: "", email: ""} }, songVideo: ""}],
//   setHomeFeedSongs: () => null,
//   allSongComments: [{songId: "", comments: [{_id: "", date: new Date(), comment: "" }]}],
//   setAllSongComments: () => {},
//   isLoading: false,
//   setIsLoading: () => {},
// })


// export { SongDataProvider, SongDataContext }
