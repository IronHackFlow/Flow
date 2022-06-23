import { useContext, useState, useEffect, memo, Dispatch, SetStateAction } from 'react'
// import { SongDataContext } from '../../contexts/SongData'
// import Loading from '../Loading'
// import Video from './Video'
// import useDebugInformation from '../../utils/useDebugInformation'
// import { Song } from '../../constants/Types'




// type Props = {
//   songArray: Array<{song: Song, songVideo: string}>,
//   trackInView: Song,
//   letScroll: boolean,
//   onInView: Dispatch<SetStateAction<string>>
// }
//   const Feed: React.FunctionComponent<Props> = ({ songArray, trackInView, letScroll, onInView }) => {
//     // const { isLoading } = useContext(SongDataContext)
//     useDebugInformation('Feed', { songArray, letScroll })

//     useEffect(() => {
//       console.log(songArray, "WTF IS GOING ON HERE")
//       let scrollTo = document.getElementById(`${trackInView?._id}`)
//       // scrollTo?.scrollIntoView({ behavior: 'instant' })
//     }, [trackInView])

//     return (
//       <ul
//         className="video-scroll-container"
//         style={letScroll ? { overflowY: 'hidden' } : { overflowY: 'scroll' }}
//       >
//         {/* <Loading isLoading={isLoading} /> */}
//         {songArray?.map(item => {
//           return (
//             <Video
//               key={item.song?._id}
//               song={item.song}
//               video={item.songVideo}
//               onInView={onInView}
//             />
//           )
//         })}
//       </ul>
//     )
//   }
// export default Feed