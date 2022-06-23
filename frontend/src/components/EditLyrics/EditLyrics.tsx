import { useContext, useState, useEffect, useRef, useCallback } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { ReactSortable } from 'react-sortablejs'
// import actions from '../../api'
// import { UserContext } from '../../contexts/AuthContext'
// import useHistory from '../../hooks/useHistory'
// import EditLyricsItem from './EditLyricsItem'
// import AudioTimeSlider from '../AudioTimeSlider'
// import SelectMenuModal from '../SelectMenuModal'
// import { beatList } from '../../constants/index'
// import { Song } from '../../constants/Types'
// import {
//   downIcon,
//   playIcon,
//   pauseIcon,
//   goBackIcon,
//   undoIcon,
//   redoIcon,
// } from '../../assets/images/_icons'
// import { string } from 'yup'
// import { LayoutThree, LayoutTwo } from '../__Layout/LayoutWrappers'
// import { PlayButton } from '../_Buttons/PlayButton'

// type LocationPropTypes = {
//   propSongs: Array<Song>,
//   propCurrentSong: Song,
// }

// export default function EditLyrics() {
//   const { user } = useContext(UserContext)
//   const navigate = useNavigate()
//   const location = useLocation()
//   const state = location.state as LocationPropTypes
//   const { propSongs, propCurrentSong } = state

//   const [currentSong, setCurrentSong] = useState<Song>()
//   const [currentBeat, setCurrentBeat] = useState(beatList[0])
//   const [allSongs, setAllSongs] = useState<Array<Song>>([])
//   const [initialSongs, setInitialSongs] = useState<Array<Song>>([])
//   const [lyricsArray, setLyricsArray, { history, pointer, back, forward }] = useHistory([])
//   const [lyricsDisplay, setLyricsDisplay] = useState<Array<HTMLLIElement>>([])

//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [showSelectBeatMenu, setShowSelectBeatMenu] = useState<boolean>(false)
//   const [showSelectSongMenu, setShowSelectSongMenu] = useState<boolean>(false)
//   const [isBeatPlaying, setIsBeatPlaying] = useState<boolean>(false)

//   const lyricsPopUpRef = useRef<HTMLDivElement>(null)
//   const playBeatRef = useRef<HTMLAudioElement>(null)
//   const [testSongs, setTestSongs] = useState<Array<Song>>()

//   useEffect(() => {
//     actions
//       .getUserSongs({ song_user: '604bbcb127022c002165238a' })
//       .then(res => {
//         setTestSongs(res.data)
//       })
//       .catch(err => console.log(err))
//   }, [])

//   useEffect(() => {
//     if (testSongs == null) return
//     setCurrentSong(testSongs[0])
//     setAllSongs(testSongs)
//     setInitialSongs(testSongs)
//   }, [testSongs])

//   useEffect(() => {
//     let lyricArray = currentSong?.lyrics?.map((each: string | Array<string>, index) => {
//       if (typeof each === 'string') {
//         return { id: `${index + 1}${each}`, array: each.split(' ') }
//       } else {
//         return { id: `${index + 1}${each}`, array: each }
//       }
//     })
//     setLyricsArray(lyricArray)
//   }, [currentSong, allSongs])

//   useEffect(() => {
//     if (currentSong) {
//       let lyricDisplay = lyricsArray?.map((each: {id: string, array: Array<string>}, index: number) => {
//         return (
//           <EditLyricsItem
//             line={each}
//             index={index}
//             updateLyrics={setLyricsArray}
//             key={`${each.id}lyric${index}`}
//           />
//         )
//       })
//       setLyricsDisplay(lyricDisplay)
//     }
//   }, [lyricsArray])

//   const handlePlayBeat = () => {
//     if (!playBeatRef.current) return
//     if (isBeatPlaying) {
//       playBeatRef.current.pause()
//       setIsBeatPlaying(false)
//     } else {
//       playBeatRef.current.play()
//       setIsBeatPlaying(true)
//     }
//   }

//   const onCloseHandler = () => {
//     navigate(-1)
//   }

//   const mapMiniLyrics = useCallback(() => {
//     return lyricsArray?.map((each: {id: string, array: Array<string>}, index: number) => {
//       return (
//         <div className="display-each-container" key={each?.id}>
//           <p className="bar-no">{index + 1}</p>
//           {each?.array?.map((e, i) => {
//             return (
//               <p className="each-word" key={`${e}and${i}`}>
//                 {e}
//               </p>
//             )
//           })}
//         </div>
//       )
//     })
//   }, [lyricsArray, lyricsDisplay, allSongs, currentSong])

//   const setLyricsArrayHandler = (e: any) => {
//     if (lyricsDisplay == null) return
//     let getItem = lyricsArray.filter(
//       (each: {id: string, array: Array<string>}) => each.id === lyricsDisplay[e.newDraggableIndex].id,
//     )
//     lyricsArray.splice(e.oldDraggableIndex, 1)
//     lyricsArray.splice(e.newDraggableIndex, 0, getItem[0])
//     setLyricsArray(lyricsArray)
//   }

//   const handleSaveLyrics = () => {
//     if (!currentSong) return
//     let savedLyrics = lyricsArray.map((each: {id: string, array: Array<string>}) => each.array)
//     setAllSongs(prev =>
//       prev.map(each => {
//         if (each._id === currentSong._id) {
//           setCurrentSong({ ...each, lyrics: savedLyrics })
//           return { ...each, lyrics: savedLyrics }
//         } else {
//           return each
//         }
//       }),
//     )
//   }

//   const handleResetLyrics = () => {
//     if (!currentSong) return
//     let replaceSong = initialSongs.filter(each => each._id === currentSong._id)
//     setAllSongs(prev =>
//       prev.map(each => {
//         if (each._id === currentSong._id) {
//           setCurrentSong(replaceSong[0])
//           return replaceSong[0]
//         } else {
//           return each
//         }
//       }),
//     )
//   }

//   const onUndo = () => {
//     // console.log(lyricsArray, history, 'UNDO THIS SHIT YO')
//     console.log(history[pointer - 1], 'what is it?')
//     // if (history[pointer - 1] == null) return
//     back()
//     // if (history[pointer - 1] !== null || history[pointer - 1] !== undefined) {
//     // }
//   }

//   const onRedo = () => {
//     // console.log(lyricsArray, 'redo THIS SHIT YO')
//     forward()
//   }

//   return (
//     <div className="EditLyrics">
//       <SelectMenuModal
//         positionTop={true}
//         positionY={6}
//         maxHeight={96 - 6}
//         list={allSongs}
//         currentItem={currentSong}
//         setCurrentItem={setCurrentSong}
//         isOpen={showSelectSongMenu}
//         onClose={setShowSelectSongMenu}
//       />

//       <SelectMenuModal
//         positionTop={false}
//         positionY={8}
//         maxHeight={96 - 8}
//         list={beatList}
//         currentItem={currentBeat}
//         setCurrentItem={setCurrentBeat}
//         isOpen={showSelectBeatMenu}
//         onClose={setShowSelectBeatMenu}
//       />

//       <LayoutTwo classes={["edit-lyrics__header","edit-lyrics__header--shadow-inset"]}>
//         <div className="edit-lyrics__exit--container">
//           <button className="edit-lyrics__exit-btn" onClick={() => onCloseHandler()}>
//             <img className="button-icons" src={goBackIcon} alt="exit" />
//           </button>
//         </div>
//         <div className="edit-lyrics__title--container">
//           <div className="edit-lyrics__title--shadow-outset">
//             <p className="edit-lyrics__title">Edit Your Lyrics</p>
//             <p className="edit-lyrics__title name">{currentSong?.song_user?.user_name}</p>
//           </div>
//         </div>
//         <LayoutThree classes={["edit-lyrics__select-song","edit-lyrics__select-song--shadow-outset","edit-lyrics__select-song--shadow-inset"]}>
//           <button
//             className="edit-lyrics__select-song-btn"
//             onClick={() => setShowSelectSongMenu(true)}
//           >
//             <p className="edit-lyrics__select-song-text">{currentSong?.name}</p>
//           </button>
//         </LayoutThree>
//       </LayoutTwo>

//       <div className="edit-lyrics__lyrics--container">
//         <ReactSortable
//           tag="ul"
//           className="edit-lyrics__lyrics-list"
//           list={lyricsDisplay}
//           setList={setLyricsDisplay}
//           group="groupName"
//           ghostClass="ghost"
//           animation={200}
//           handle=".move-handle__btn"
//           onSort={e => setLyricsArrayHandler(e)}
//           // delayOnTouchStart={true}
//           delay={2}
//         >
//           {lyricsDisplay}
//         </ReactSortable>
//       </div>

//       <LayoutTwo classes={["section-3_controls","controls-container"]}>

//         <LayoutThree classes={["controls-1_options","options_shadow-div-outset","options-2_toggle-lyrics"]}>
//           <div className="save-reset-btn--container">
//             <button className="save-reset-btn reset" onClick={() => handleResetLyrics()}>
//               reset
//             </button>
//           </div>
//           <div className="edit-lyrics__undo-redo">
//             <button className="edit-lyrics__undo-redo-btn" onClick={() => onUndo()}>
//               <img src={undoIcon} alt="undo" className="button-icons" />
//             </button>
//           </div>
//           <div className="edit-lyrics__undo-redo">
//             <button className="edit-lyrics__undo-redo-btn" onClick={() => onRedo()}>
//               <img src={redoIcon} alt="redo" className="button-icons" />
//             </button>
//           </div>
//           <div className="save-reset-btn--container">
//             <button className="save-reset-btn save" onClick={() => handleSaveLyrics()}>
//               save
//             </button>
//           </div>
//         </LayoutThree>

//         <LayoutThree classes={["controls-2_inner","inner_shadow-div-outset","flow-controls-1_playback-display"]}>
//           <div className="play-btn-container">
//             <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
//           </div>

//           <LayoutTwo classes={["play-slider-container","play-slider-container_shadow-div-outset"]}>
//             <LayoutTwo classes={["play-slider-container_shadow-div-inset","play-slider_shadow-div-outset"]}>
//               {currentSong && (
//                 <AudioTimeSlider
//                   isPlaying={isPlaying}
//                   setIsPlaying={setIsPlaying}
//                   currentSong={currentSong}
//                   bgColor={`#4d4d4d`}
//                 />
//               )}
//             </LayoutTwo>
//           </LayoutTwo>
//         </LayoutThree>

//         <LayoutTwo classes={["actions-2_record","record-container"]}>
//           <LayoutTwo classes={["record-1_select-beat","select-beat_shadow-div-inset"]}>
//             <div className="play-beat_shadow-div-outset">
//               <PlayButton isPlaying={isBeatPlaying} setIsPlaying={setIsBeatPlaying} audio={currentBeat?.song} />
//             </div>

//             <button className="select-beat_shadow-div-outset">
//               <div className="select-beat-title">Beat:</div>
//               <div
//                 id="selectBox"
//                 className="track-select"
//                 onClick={() => setShowSelectBeatMenu(true)}
//               >
//                 {currentBeat?.name}
//               </div>
//             </button>
//           </LayoutTwo>
//         </LayoutTwo>
//       </LayoutTwo> 

//       <div className="section-4_display-lyrics" ref={lyricsPopUpRef}>
//         <div className="display-lyrics-container">{mapMiniLyrics()}</div>
//         <div className="menu-down-container">
//           <button className="menu-down-btn">
//             <img className="button-icons" src={downIcon} alt="menu down" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
