import { useRef, useState, useEffect, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom'
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// import { v4 as uuidv4 } from 'uuid'
// // import datamuse from 'datamuse'
// import { useAuth } from '../../contexts/_AuthContext/AuthContext'
// import RhymeActionBar from '../_RecordPage/RhymeActionBar'
// import ErrorModal from '../../components/ErrorModal.js'
// import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
// import SaveSongModal from '../../components/_SaveSongModal/SaveSongModal'
// import { RecordingBoothModal } from '../../components/RecordingBoothModal'
// import useRefilterProfanity from '../../utils/useRefilterProfanity'
// import { beatList, rhymeNumberList } from 'src/constants/index'
// import actions from '../../api'
// import Navbar from '../../components/_Navbar/Navbar'
// import LyricLine from '../_RecordPage/LyricLine'
// import { ActionButton } from '../_RecordPage/ActionButtons'
// import { PlayButton } from '../../components/_Buttons/PlayButton'
// import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
// import { IUser } from '../../interfaces/IModels'
// import { SelectBeat, SelectSong, SelectNumberOfRhymesButton } from '../_RecordPage/Menus/index'
// import { RecordButton } from '../_RecordPage/Buttons/RecordButton'
// import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'
// import { BtnColorsEnum, RoundButton } from 'src/components/_Buttons/RoundButton/RoundButton'
// import { Recording } from '../Recording/Recording'

// export interface ISongTake {
//   _id: string
//   title: string
//   user: IUser
//   blob: any
//   audio: any
//   lyrics: Array<string[]>
//   duration: number
//   caption?: string
//   video?: string
// }

// type MediaRecorderProps = {
//   recordingMinutes: number
//   recordingSeconds: number
//   initRecording: boolean
//   mediaStream: any
//   otherMediaStream?: any
//   mediaRecorder: any
//   audio: any
// }

// enum RhymeActions {
//   Top = 'Top',
//   Locked = 'Locked',
//   Selected = 'Selected',
// }

// export default function Record() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const { refilterProfanity } = useRefilterProfanity()

//   const commands = [
//     {
//       command: /\b(\w(\S{4,}))/g,
//       callback: (command: any) => getActionWords(`${command}`),
//       matchInterim: true,
//     },
//     // {
//     //   command: /(?:\w[*]+)/,
//     //   callback: (command) => refilterProfanity(command),
//     //   matchInterim: true,
//     // }
//   ]

//   const { transcript, resetTranscript } = useSpeechRecognition({ commands })

//   const initialState = {
//     recordingMinutes: 0,
//     recordingSeconds: 0,
//     initRecording: false,
//     mediaStream: null,
//     mediaRecorder: null,
//     audio: null,
//   }

//   const initialSongTake = {
//     _id: '',
//     title: '',
//     user: user,
//     blob: '',
//     audio: '',
//     lyrics: [],
//     duration: 0,
//     caption: '',
//   }

//   const [recorderState, setRecorderState] = useState<MediaRecorderProps>(initialState)
//   const [currentTake, setCurrentTake] = useState<ISongTake>(initialSongTake)
//   const [currentBeat, setCurrentBeat] = useState(beatList[0])
//   const [numberOfRhymes, setNumberOfRhymes] = useState(rhymeNumberList[4])

//   const [silent, setSilent] = useState<boolean>(false)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [showSaveSongModal, setShowSaveSongModal] = useState<boolean>(false)
//   const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
//   const [toggleModal, setToggleModal] = useState<boolean>(false)

//   const [songTakes, setSongTakes] = useState<ISongTake[]>([])
//   const [lyricsArr, setLyricsArr] = useState<Array<string[]>>([])

//   const [rhymeWord, setRhymeWord] = useState<string>('')
//   const [rhymeWordLocked, setRhymeWordLocked] = useState<string>('')
//   const [rhymeWordSelected, setRhymeWordSelected] = useState<string>('')

//   const [rhymes, setRhymes] = useState([])
//   const [rhymesLocked, setRhymesLocked] = useState([])
//   const [rhymesSelected, setRhymesSelected] = useState<string[]>([])
//   const [retrievedActionRhymes, setRetrievedActionRhymes] = useState<string[]>([])

//   const [showLyricsLine, setShowLyricsLine] = useState([])
//   const [blobData, setBlobData] = useState<any>()
//   const [dateBefore, setDateBefore] = useState<number>(0)
//   const [dateAfter, setDateAfter] = useState<number>(0)
//   const [focusBorder, setFocusBorder] = useState<number>(0)

//   const modalBtnRef = useRef<any>(null)
//   const recordAudioRef = useRef<any>(null)
//   const scrollRef = useRef<any>()
//   const keyRef = useRef(0)
//   const barNumberRef = useRef(1)

//   useEffect(() => {
//     if (silent && recorderState.initRecording) {
//       setRetrievedActionRhymes([])
//       getDatamuseRhymes(transcript)
//       setLyricsHandler()
//       resetTranscript()
//       autoScroll()
//     }
//   }, [silent])

//   useEffect(() => {
//     if (!blobData) return
//     if (Object.keys(blobData).length !== 0) {
//       const songDate = new Date()
//       const songDuration = dateAfter - dateBefore - 200
//       const songObject = {
//         _id: blobData.title,
//         title: blobData.title,
//         user: user,
//         blob: blobData.blob,
//         audio: blobData.audio,
//         lyrics: [...lyricsArr],
//         duration: songDuration,
//         caption: '',
//       }

//       setCurrentTake(songObject)
//       setBlobData({})
//       setSongTakes(eachTake => [...eachTake, { ...songObject }])
//     }
//     console.log('Check out the updated songTakes: ', songTakes, currentTake)
//   }, [blobData])

//   useEffect(() => {
//     if (recorderState.mediaStream) {
//       setRecorderState(prevState => {
//         return {
//           ...prevState,
//           mediaRecorder: new MediaRecorder(prevState.mediaStream),
//         }
//       })
//     }
//   }, [recorderState.mediaStream])

//   useEffect(() => {
//     const recorder = recorderState.mediaRecorder

//     if (recorder && recorder.state === 'inactive') {
//       setDateBefore(Date.now())
//       recorder.start()
//       let chunks: any = []
//       let url: any

//       recorder.ondataavailable = (event: any) => {
//         setDateAfter(Date.now())
//         chunks.push(event.data)
//         let mpegBlob = new Blob(chunks, { type: 'audio/mpeg-3' })
//         url = URL.createObjectURL(mpegBlob)
//         keyRef.current++
//         setBlobData({ title: `Flow ${keyRef.current}`, blob: mpegBlob, audio: url })
//       }

//       recorder.onstop = () => {
//         chunks = []
//         recorderState.otherMediaStream.getAudioTracks().forEach((track: any) => track.stop())
//         setRecorderState(prevState => {
//           if (prevState.mediaRecorder) {
//             return {
//               ...initialState,
//               audio: url,
//             }
//           } else {
//             return initialState
//           }
//         })
//       }
//     }

//     return () => {
//       if (recorder) {
//         recorder.stream.getAudioTracks().forEach((track: any) => track.stop())
//       }
//     }
//   }, [recorderState.mediaRecorder])

//   const toggleModalHandler = () => {
//     if (toggleModal) {
//       setToggleModal(false)
//     } else {
//       setToggleModal(true)
//     }
//   }

//   const displayActionWords = useCallback(() => {
//     return retrievedActionRhymes.slice(0, 5).map((each, index) => {
//       return (
//         <p className="rhyme-actions__action-rhyme-text" key={`${uuidv4()}action${index}`}>
//           <span>{index !== 0 ? String.fromCodePoint(8226) : ''}</span>
//           {each}
//         </p>
//       )
//     })
//   }, [retrievedActionRhymes])

//   const autoScroll = useCallback(() => {
//     let scrollLyrics = document.getElementById('currentTranscript')
//     if (scrollLyrics) {
//       scrollLyrics.scrollTop = scrollLyrics.scrollHeight + 26
//     }
//   }, [lyricsArr])

//   async function getActionWords(regex: string) {
//     let finalWord = regex
//     if (regex.includes('*')) {
//       finalWord = refilterProfanity(regex)
//     }

//     // const getData = await datamuse
//     //   .request(`words?rel_trg=${finalWord}&max=20`)
//     //   .then((res: any) => {
//     //     if (res.length !== 0) {
//     //       // console.log(res)
//     //       for (let i = 0; i < 1; i++) {
//     //         let randomIndex = Math.floor(Math.random() * (res.length - 1))
//     //         // console.log(randomIndex, res[randomIndex].word)
//     //         setRetrievedActionRhymes(oldRhymes => [...oldRhymes, res[randomIndex].word])
//     //       }
//     //     }
//     //   })
//     //   .catch(console.error)
//     // console.log(retrievedActionRhymes, 'RETRIEVED ACTIONS VERBS')
//   }

//   const getDatamuseRhymes = useCallback(async transcript => {
//     const validated = validateTranscript(transcript, 'word')
//     if (validated == null || validated === ' ' || validated === '') return

//     setRhymeWord(validated)
//     setRhymes([])

//     // await datamuse
//     //   .request(`words?rel_rhy=${validated}&max=30`)
//     //   .then((res: any) => {
//     //     // console.log(res, "I'm gonna need to see what I'm working with here")
//     //     if (res.length !== 0) {
//     //       let fillRhymes = res.map((each: any) => each.word)
//     //       setRhymes(fillRhymes)
//     //     }
//     //   })
//     //   .catch(console.error)
//   }, [])

//   const validateTranscript = useCallback((transcript, returnValue) => {
//     if (transcript == null || transcript === '' || transcript === ' ') return
//     const copyTranscript = transcript.slice().trim()
//     const transcriptArray = copyTranscript.split(' ')

//     if (returnValue === 'word') {
//       const refilteredWord = refilterProfanity(transcriptArray[transcriptArray.length - 1])
//       if (refilteredWord.includes("'")) {
//         return refilteredWord.split("'").join('')
//       }
//       return refilteredWord
//     } else {
//       const filteredArray = transcriptArray.map((each: any) => {
//         const filterWord = refilterProfanity(each)
//         return filterWord
//       })
//       return filteredArray
//     }
//   }, [])

//   const setLyricsHandler = () => {
//     const validated = validateTranscript(transcript, 'list')
//     if (validated?.length === 0 || validated == null) return
//     setLyricsArr(oldArr => [...oldArr, validated])
//   }

//   const displayTakeLyrics = useCallback(() => {
//     if (songTakes.length === 0 && !recorderState.initRecording) {
//       return (
//         <li className="record__lyrics-item">
//           <div className="record__item-words">
//             <p className="record__item-words-text initial-prompt">
//               Start flowing to see your lyrics!
//             </p>
//           </div>
//         </li>
//       )
//     }
//     if (recorderState.initRecording) {
//       return lyricsArr.map((row, index) => {
//         return <LyricLine row={row} index={index} />
//       })
//     } else {
//       return currentTake?.lyrics?.map((row, index) => {
//         return <LyricLine row={row} index={index} />
//       })
//     }
//   }, [songTakes, currentTake, lyricsArr, recorderState.initRecording])

//   let myReq //animation frame ID
//   // const detectSilence = useCallback(
//   //   (stream, silence_delay = 50, min_decibels = -80) => {
//   //     const ctx = new AudioContext()
//   //     const analyser = ctx.createAnalyser()
//   //     const streamNode = ctx.createMediaStreamSource(stream)
//   //     streamNode.connect(analyser)
//   //     analyser.minDecibels = min_decibels
//   //     const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
//   //     let silence_start = performance.now()
//   //     let triggered = false // trigger only once per silence event

//   //     const loop = time => {
//   //       myReq = requestAnimationFrame(loop)
//   //       // we'll loop every 60th of a second to check
//   //       analyser.getByteFrequencyData(data) // get current data
//   //       if (data.some(v => v)) {
//   //         // if there is data above the given db limit
//   //         if (triggered) {
//   //           triggered = false
//   //           setSilent(false)
//   //         }
//   //         silence_start = time // set it to now
//   //       }
//   //       if (!triggered && time - silence_start > silence_delay) {
//   //         setSilent(true)
//   //         triggered = true
//   //       }
//   //     }
//   //     loop()
//   //   },
//   //   [silent],
//   // )

//   // let rec = SpeechRecognition.getRecognition()
//   // // let recEvent = SpeechRecognition.getRecognition()
//   // useEffect(() => {
//   //   rec.addEventListener('result', () => {
//   //     console.log(rec.results, 'HEY WHTF LKSDFJ SD')
//   //   })
//   // }, [])

//   const resetRecording = () => {
//     setCurrentTake(initialSongTake)
//     setLyricsArr([])
//     setShowLyricsLine([])
//     setRhymeWord('')
//     setRhymeWordLocked('')
//     setRhymeWordSelected('')
//     setRhymes([])
//     setRhymesLocked([])
//     resetTranscript()
//     barNumberRef.current = 1
//   }

//   async function startRecording() {
//     resetRecording()
//     try {
//       const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true })
//       SpeechRecognition.startListening({ continuous: true })

//       var audio = recordAudioRef.current.captureStream()
//       recordAudioRef.current.play()

//       // detectSilence(stream1)
//       const audioContext = new AudioContext()
//       let audioIn_01 = audioContext.createMediaStreamSource(stream1)
//       let audioIn_02 = audioContext.createMediaStreamSource(audio)
//       let dest = audioContext.createMediaStreamDestination()

//       audioIn_01.connect(dest)
//       audioIn_02.connect(dest)

//       setRecorderState(prevState => {
//         return {
//           ...prevState,
//           initRecording: true,
//           mediaStream: dest.stream,
//           otherMediaStream: stream1,
//         }
//       })
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   const stopRecording = () => {
//     if (recorderState.mediaRecorder !== null) {
//       if (recorderState.mediaRecorder.state !== 'inactive') {
//         SpeechRecognition.stopListening()
//         recorderState.mediaRecorder.stop()
//         recordAudioRef.current.pause()
//         recordAudioRef.current.currentTime = 0
//         setLyricsHandler()
//         resetTranscript()
//         setRecorderState(prevState => {
//           return {
//             ...prevState,
//             initRecording: false,
//           }
//         })
//       }
//     }
//   }

//   const handleDeleteFlow = () => {
//     let newTakes = songTakes.filter((each, index) => {
//       if (each.title === currentTake.title) {
//         if (songTakes[index - 1] == null) setCurrentTake(songTakes[index + 1])
//         else setCurrentTake(songTakes[index - 1])
//       } else {
//         return each
//       }
//     })
//     setSongTakes(newTakes)

//     if (newTakes.length === 0) keyRef.current = 0
//   }

//   const handleSaveSongMenu = () => {
//     // if (songTakes.length === 0) return setShowErrorModal(true)
//     setShowSaveSongModal(!showSaveSongModal)
//   }

//   const navigateToEditLyrics = useCallback(async () => {
//     await actions
//       .getUserSongs({ song_user: user?._id })
//       .then(res => {
//         let userSongs = res.data
//         let allSongs = [...songTakes, ...userSongs]

//         if (userSongs.length === 0 && songTakes.length === 0) {
//           setShowErrorModal(true)
//         } else {
//           navigate('/editLyrics', {
//             state: {
//               propSongs: allSongs,
//               propCurrentSong: currentTake.title ? currentTake : userSongs[0],
//             },
//           })
//         }
//       })
//       .catch(console.error)
//   }, [])
//   const [showRecording, setShowRecording] = useState<boolean>(false)
//   const showRecordingMenu = () => {
//     setShowRecording(true)
//   }

//   return (
//     <div className="Record">
//       <RecordingBoothModal
//         toggleModal={toggleModal}
//         setToggleModal={setToggleModal}
//         modalBtnRef={modalBtnRef}
//         focusBorder={focusBorder}
//         setFocusBorder={setFocusBorder}
//       />
//       <Recording isOpen={showRecording} onClose={setShowRecording} />
//       <SaveSongModal
//         isOpen={showSaveSongModal}
//         onClose={setShowSaveSongModal}
//         currentSong={currentTake}
//         setCurrentSong={setCurrentTake}
//         songTakes={songTakes}
//       />

//       <audio id="song" src={currentBeat?.song} loop={true} ref={recordAudioRef}></audio>

//       <div className="record__transcript-lyrics">
//         <div className="record__lyrics--container">
//           <div className={`record__lyrics ${focusBorder === 31 ? 'focus-border' : ''}`}>
//             <ul className="record__lyrics-list" id="currentTranscript" ref={scrollRef}>
//               {displayTakeLyrics()}
//             </ul>
//           </div>
//         </div>
//         <div className="record__transcript--container">
//           <div className={`record__transcript ${focusBorder === 30 ? 'focus-border' : ''}`}>
//             <p className="record__transcript-text">{transcript}</p>
//           </div>
//         </div>
//       </div>

//       <div className="record__rhyme-actions">
//         <div className="rhyme-actions">
//           <LayoutTwo
//             classes={['rhyme-actions__bar continuous-rhymes', 'rhyme-actions__action-rhyme']}
//           >
//             {retrievedActionRhymes && recorderState.initRecording ? (
//               displayActionWords()
//             ) : (
//               <p className="rhyme-actions__action-rhyme-text initial-prompt">
//                 Suggestions for your next bar will be here.
//               </p>
//             )}
//           </LayoutTwo>

//           {/* <RhymeActionBar
//             type={RhymeActions.Top}
//             focusBorder={focusBorder}
//             isRecording={recorderState?.initRecording}
//             suggestionsInitialPrompt={'Click record button below and spit bars to get rhymes here.'}
//           />
//           <RhymeActionBar
//             type={RhymeActions.Locked}
//             focusBorder={focusBorder}
//             isRecording={recorderState?.initRecording}
//             suggestionsInitialPrompt={'Click lock button to the right to save above rhymes here.'}
//           />
//           <RhymeActionBar
//             type={RhymeActions.Selected}
//             focusBorder={focusBorder}
//             isRecording={recorderState?.initRecording}
//             suggestionsInitialPrompt={'Click any Flowed word above to generate rhymes here.'}
//           /> */}

//           <LayoutTwo
//             classes={['interactions__options--container', 'interactions__options--shadow-inset']}
//           >
//             <SelectNumberOfRhymesButton
//               rhymeNumber={numberOfRhymes}
//               setRhymeNumber={setNumberOfRhymes}
//             />

//             {/* <ActionButton type="tutorial" onClick={toggleModalHandler} ref={modalBtnRef}>
//               tutorial
//             </ActionButton> */}

//             <ActionButton type="editLyrics" onClick={navigateToEditLyrics}>
//               edit lyrics
//             </ActionButton>
//           </LayoutTwo>
//         </div>

//         <div className="section-2b_flow-controls">
//           <div className="flow-controls-container">
//             <div className="flow-controls-1_playback-display">
//               <LayoutThree
//                 classes={[
//                   'play-btn-container',
//                   'play-btn-container_shadow-div-outset',
//                   'play-btn-container_shadow-div-inset',
//                 ]}
//               >
//                 <PlayButton
//                   isPlaying={isPlaying}
//                   setIsPlaying={setIsPlaying}
//                   options={{ offset: 8, margin: '0em 0em 0em 0.4em', flexJC: 'flex-start' }}
//                 />
//               </LayoutThree>

//               <LayoutTwo
//                 classes={['play-slider-container', 'play-slider-container_shadow-div-outset']}
//               >
//                 <LayoutTwo
//                   classes={[
//                     'play-slider-container_shadow-div-inset',
//                     'play-slider_shadow-div-outset',
//                   ]}
//                 >
//                   <AudioTimeSlider
//                     isPlaying={isPlaying}
//                     setIsPlaying={setIsPlaying}
//                     currentSong={currentTake}
//                     bgColor={'#474747'}
//                   />
//                 </LayoutTwo>
//               </LayoutTwo>
//             </div>

//             <LayoutThree
//               classes={[
//                 'flow-controls-2_actions',
//                 'actions-container_shadow-div-outset',
//                 'actions-container_shadow-div-inset',
//               ]}
//             >
//               <div className="actions-1_flow-takes">
//                 <LayoutThree
//                   classes={[
//                     'flow-takes-1_select-takes',
//                     'select-takes-container_shadow-div-outset',
//                     'select-takes-container',
//                   ]}
//                 >
//                   <SelectSong
//                     songTakes={songTakes}
//                     isRecording={recorderState.initRecording}
//                     take={currentTake}
//                     setTake={setCurrentTake}
//                   />
//                 </LayoutThree>

//                 <LayoutTwo classes={['flow-takes-2_takes-actions', 'takes-actions-container']}>
//                   <div
//                     className={`actions-btn-container ${focusBorder === 12 ? 'focus-border' : ''}`}
//                   >
//                     <RoundButton
//                       type={ButtonTypes.Save}
//                       btnOptions={{
//                         inset: [true, '4px'],
//                         offset: 10,
//                         bgColor: BtnColorsEnum.Primary,
//                       }}
//                       iconOptions={{ color: 'White', size: 75 }}
//                       onClick={handleSaveSongMenu}
//                     />
//                     <ErrorModal
//                       isOpen={showErrorModal}
//                       onClose={setShowErrorModal}
//                       title={'No Recorded Takes to Save'}
//                       nextActions={'Press the green mic button to begin Flowing!'}
//                       opacity={true}
//                       modHeight={56}
//                       modWidth={99}
//                       placement={0.5}
//                     />
//                   </div>
//                   <div className="actions-btn-container">
//                     <RoundButton
//                       type={ButtonTypes.Close}
//                       btnOptions={{
//                         bgColor: BtnColorsEnum.Initial,
//                         inset: [true, '4px'],
//                         offset: 10,
//                       }}
//                       iconOptions={{ color: 'Primary' }}
//                       onClick={handleDeleteFlow}
//                     />
//                   </div>
//                 </LayoutTwo>
//               </div>

//               <LayoutTwo classes={['actions-2_record', 'record-container']}>
//                 <div className="record-1_select-beat">
//                   <SelectBeat
//                     focusBorder={focusBorder}
//                     beat={currentBeat}
//                     setBeat={setCurrentBeat}
//                   />
//                 </div>
//                 <div className="record-1_record-btn--container">
//                   <div className="record-1_record-btn--bs-inset">
//                     <button className="record-1_record-btn" onClick={() => setShowRecording(true)}>
//                       Record
//                     </button>
//                   </div>
//                 </div>
//               </LayoutTwo>
//             </LayoutThree>
//           </div>
//           {/*
//           <RecordButton
//             focusBorder={focusBorder}
//             isRecording={recorderState.initRecording}
//             startRecording={showRecordingMenu}
//             stopRecording={stopRecording}
//           /> */}
//         </div>
//       </div>
//       <Navbar />
//     </div>
//   )
// }

// JSX VERSION

// import { useContext, useRef, useState, useEffect, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom'
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// import { v4 as uuidv4 } from 'uuid'
// import datamuse from 'datamuse'
// import { UserContext } from '../contexts/AuthContext'
// import RecordBoothContext from '../contexts/RecordBoothContext'
// import RhymeActionBar from './_Record/RhymeActionBar'
// import SelectMenuModal from '../components/SelectMenuModal'
// import ErrorModal from '../components/Errors/ErrorModal'
// import AudioTimeSlider from '../components/AudioTimeSlider'
// import SaveSongModal from '../components/SaveSongModal'
// import RecordingBoothModal from '../components/RecordingBoothModal'
// import useRefilterProfanity from '../hooks/useRefilterProfanity'
// import { beatList, rhymeNumList } from '../constants/index'
// import actions from '../api'
// import NavBar from '../components/NavBar'
// import LyricLine from './_Record/LyricLine'
// import { Song } from '../constants/Types'
// import {
//   micIcon,
//   playIcon,
//   pauseIcon,
//   stopIcon,
//   closeIcon,
//   saveIcon,
//   helpFilledIcon,
//   editIcon,
//   selectArrowDownIcon,
//   selectArrowUpIcon,
// } from '../assets/images/_icons'

// export default function Record() {
//   const { user } = useContext(UserContext)

//   const navigate = useNavigate()
//   const { refilterProfanity } = useRefilterProfanity()

//   const commands = [
//     {
//       command: /\b(\w(\S{4,}))/g,
//       callback: (command ) => getActionWords(`${command}`),
//       matchInterim: true,
//     },
//     // {
//     //   command: /(?:\w[*]+)/,
//     //   callback: (command) => refilterProfanity(command),
//     //   matchInterim: true,
//     // }
//   ]

//   const { transcript, resetTranscript } = useSpeechRecognition({ commands })
//   const initialState = {
//     recordingMinutes: 0,
//     recordingSeconds: 0,
//     initRecording: false,
//     mediaStream: null,
//     mediaRecorder: null,
//     audio: null,
//   }

//   // interface SongTake extends Song {
//   //   blob: Blob | null
//   // }

//   const initialSongObject = {
//     name: "",
//     song_user: user,
//     blob: null,
//     song_URL: "",
//     lyrics: [[]],
//     date: new Date(),
//     duration: 0,
//     caption: '',
//     video: null,
//   }

//   const [recorderState, setRecorderState] = useState(initialState)
//   const [currentSong, setCurrentSong] = useState<SongTake>(initialSongObject)
//   const [currentBeat, setCurrentBeat] = useState(beatList[0])
//   const [currentRhymeNum, setCurrentRhymeNum] = useState(rhymeNumList[4])

//   const [silent, setSilent] = useState<boolean>(false)
//   const [recordingDisplay, setRecordingDisplay] = useState<boolean>(false)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [isBeatPlaying, setIsBeatPlaying] = useState<boolean>(false)
//   const [showSaveSongModal, setShowSaveSongModal] = useState<boolean>(false)
//   const [showSelectSongMenu, setShowSelectSongMenu] = useState<boolean>(false)
//   const [showSelectBeatMenu, setShowSelectBeatMenu] = useState<boolean>(false)
//   const [showSelectRhymeNumMenu, setShowSelectRhymeNumMenu] = useState<boolean>(false)
//   const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
//   const [toggleModal, setToggleModal] = useState<boolean>(false)

//   const [allTakes, setAllTakes] = useState<Array<Song>>([])
//   const [lyricsArr, setLyricsArr] = useState([])

//   const [rhymeWord, setRhymeWord] = useState<string>('')
//   const [rhymeWordLocked, setRhymeWordLocked] = useState<string>('')
//   const [rhymeWordSelected, setRhymeWordSelected] = useState<string>('')

//   const [rhymes, setRhymes] = useState([])
//   const [rhymesLocked, setRhymesLocked] = useState([])
//   const [rhymesSelected, setRhymesSelected] = useState([])
//   const [retrievedActionRhymes, setRetrievedActionRhymes] = useState([])

//   const [showLyricsLine, setShowLyricsLine] = useState([])
//   const [blobData, setBlobData] = useState()
//   const [dateBefore, setDateBefore] = useState<number>(0)
//   const [dateAfter, setDateAfter] = useState<number>(0)
//   const [focusBorder, setFocusBorder] = useState<number>(0)
//   const [selectTitle, setSelectTitle] = useState<string>('')

//   const modalBtnRef = useRef<HTMLDivElement>(null)
//   const playBeatRef = useRef()
//   const recordAudioRef = useRef()
//   const scrollRef = useRef()
//   const keyRef = useRef(0)
//   const barNumberRef = useRef(1)

//   useEffect(() => {
//     if (silent && recorderState.initRecording) {
//       setRetrievedActionRhymes([])
//       getDatamuseRhymes(transcript)
//       setLyricsHandler()
//       resetTranscript()
//       autoScroll()
//     }
//   }, [silent])

//   useEffect(() => {
//     if (!blobData) return
//     if (Object.keys(blobData).length !== 0) {
//       const songDate = new Date()
//       const songDuration = dateAfter - dateBefore - 200
//       const songObject = {
//         name: blobData.name,
//         song_user: user,
//         blob: blobData.blob,
//         song_URL: blobData.song_URL,
//         lyrics: [...lyricsArr],
//         date: songDate,
//         duration: songDuration,
//         caption: '',
//         video: null,
//       }

//       setCurrentSong(songObject)
//       setBlobData({})
//       setAllTakes(eachTake => [...eachTake, { ...songObject }])
//     }
//     console.log('Check out the updated AllTakes: ', allTakes, currentSong)
//   }, [blobData])

//   useEffect(() => {
//     if (recorderState.mediaStream) {
//       setRecorderState(prevState => {
//         return {
//           ...prevState,
//           mediaRecorder: new MediaRecorder(prevState.mediaStream),
//         }
//       })
//     }
//   }, [recorderState.mediaStream])

//   useEffect(() => {
//     const recorder = recorderState.mediaRecorder

//     if (recorder && recorder.state === 'inactive') {
//       setDateBefore(Date.now())
//       recorder.start()
//       let chunks = []
//       let url

//       recorder.ondataavailable = event => {
//         setDateAfter(Date.now())
//         chunks.push(event.data)
//         let mpegBlob = new Blob(chunks, { type: 'audio/mpeg-3' })
//         url = URL.createObjectURL(mpegBlob)
//         keyRef.current++
//         setBlobData({ name: `Flow ${keyRef.current}`, blob: mpegBlob, song_URL: url })
//       }

//       recorder.onstop = () => {
//         chunks = []
//         recorderState.otherMediaStream.getAudioTracks().forEach(track => track.stop())
//         setRecorderState(prevState => {
//           if (prevState.mediaRecorder) {
//             return {
//               ...initialState,
//               audio: url,
//             }
//           } else {
//             return initialState
//           }
//         })
//       }
//     }

//     return () => {
//       if (recorder) {
//         recorder.stream.getAudioTracks().forEach(track => track.stop())
//       }
//     }
//   }, [recorderState.mediaRecorder])

//   useEffect(() => {
//     if (allTakes.length === 0 && !recorderState.initRecording)
//       return setSelectTitle('No Recorded Flows')
//     if (recorderState.initRecording) return setSelectTitle('Recording...')
//     else if (currentSong.name === '' && !recorderState.initRecording)
//       return setSelectTitle('No Recorded Flows')
//     else return setSelectTitle(`${currentSong.name}`)
//   }, [allTakes, currentSong, recorderState.initRecording])

//   useEffect(() => {
//     if (isBeatPlaying) {
//       playBeatRef.current.play()
//     } else {
//       playBeatRef.current.pause()
//     }
//   }, [isBeatPlaying])

//   const toggleModalHandler = () => {
//     if (toggleModal) {
//       setToggleModal(false)
//     } else {
//       setToggleModal(true)
//     }
//   }

//   const displayActionWords = useCallback(() => {
//     return retrievedActionRhymes.slice(0, 5).map((each, index) => {
//       return (
//         <p className="rhyme-actions__action-rhyme-text" key={`${uuidv4()}action${index}`}>
//           <span>{index !== 0 ? String.fromCodePoint(8226) : ''}</span>
//           {each}
//         </p>
//       )
//     })
//   }, [retrievedActionRhymes])

//   const autoScroll = useCallback(() => {
//     let scrollLyrics = document.getElementById('currentTranscript')
//     scrollLyrics.scrollTop = scrollLyrics.scrollHeight + 26
//   }, [lyricsArr])

//   async function getActionWords(regex) {
//     let finalWord = regex
//     if (regex.includes('*')) {
//       finalWord = refilterProfanity(regex)
//     }

//     const getData = await datamuse
//       .request(`words?rel_trg=${finalWord}&max=20`)
//       .then(res => {
//         if (res.length !== 0) {
//           // console.log(res)
//           for (let i = 0; i < 1; i++) {
//             let randomIndex = Math.floor(Math.random() * (res.length - 1))
//             // console.log(randomIndex, res[randomIndex].word)
//             setRetrievedActionRhymes(oldRhymes => [...oldRhymes, res[randomIndex].word])
//           }
//         }
//       })
//       .catch(console.error)
//     // console.log(retrievedActionRhymes, 'RETRIEVED ACTIONS VERBS')
//   }

//   const getDatamuseRhymes = useCallback(async transcript => {
//     const validated = validateTranscript(transcript, 'word')
//     if (validated == null || validated === ' ' || validated === '') return

//     setRhymeWord(validated)
//     setRhymes([])

//     await datamuse
//       .request(`words?rel_rhy=${validated}&max=30`)
//       .then(res => {
//         // console.log(res, "I'm gonna need to see what I'm working with here")
//         if (res.length !== 0) {
//           let fillRhymes = res.map(each => each.word)
//           setRhymes(fillRhymes)
//         }
//       })
//       .catch(console.error)
//   }, [])

//   const setLyricsHandler = () => {
//     const validated = validateTranscript(transcript, 'list')
//     if (validated?.length === 0 || validated == null) return
//     setLyricsArr(oldArr => [...oldArr, validated])
//   }

//   const displayTakeLyrics = useCallback(() => {
//     if (allTakes.length === 0 && !recorderState.initRecording) {
//       return (
//         <li className="record__lyrics-item">
//           <div className="record__item-words">
//             <p className="record__item-words-text initial-prompt">
//               Start flowing to see your lyrics!
//             </p>
//           </div>
//         </li>
//       )
//     }
//     if (recorderState.initRecording) {
//       return lyricsArr.map((row, index) => {
//         return <LyricLine row={row} index={index} />
//       })
//     } else {
//       return currentSong.lyrics.map((row, index) => {
//         return <LyricLine row={row} index={index} />
//       })
//     }
//   }, [allTakes, currentSong, lyricsArr, recorderState.initRecording])

//   let myReq //animation frame ID
//   // const detectSilence = useCallback(
//   //   (stream, silence_delay = 50, min_decibels = -80) => {
//   //     const ctx = new AudioContext()
//   //     const analyser = ctx.createAnalyser()
//   //     const streamNode = ctx.createMediaStreamSource(stream)
//   //     streamNode.connect(analyser)
//   //     analyser.minDecibels = min_decibels
//   //     const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
//   //     let silence_start = performance.now()
//   //     let triggered = false // trigger only once per silence event

//   //     const loop = time => {
//   //       myReq = requestAnimationFrame(loop)
//   //       // we'll loop every 60th of a second to check
//   //       analyser.getByteFrequencyData(data) // get current data
//   //       if (data.some(v => v)) {
//   //         // if there is data above the given db limit
//   //         if (triggered) {
//   //           triggered = false
//   //           setSilent(false)
//   //         }
//   //         silence_start = time // set it to now
//   //       }
//   //       if (!triggered && time - silence_start > silence_delay) {
//   //         setSilent(true)
//   //         triggered = true
//   //       }
//   //     }
//   //     loop()
//   //   },
//   //   [silent],
//   // )

//   let rec = SpeechRecognition.getRecognition()
//   // let recEvent = SpeechRecognition.getRecognition()
//   useEffect(() => {
//     rec.addEventListener('result', () => {
//       console.log(rec.results, 'HEY WHTF LKSDFJ SD')
//     })
//   }, [])

//   const resetRecording = () => {
//     // setRecordingDisplay(true)
//     setCurrentSong(initialSongObject)
//     setLyricsArr([])
//     setShowLyricsLine([])
//     setRhymeWord(null)
//     setRhymeWordLocked(null)
//     setRhymeWordSelected(null)
//     setRhymes([])
//     setRhymesLocked([])
//     resetTranscript()
//     barNumberRef.current = 1
//   }

//   async function startRecording() {
//     resetRecording()
//     try {
//       const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true })
//       SpeechRecognition.startListening({ continuous: true })

//       var audio = document.getElementById('song').captureStream()
//       document.getElementById('song').play()

//       // detectSilence(stream1)
//       const audioContext = new AudioContext()
//       let audioIn_01 = audioContext.createMediaStreamSource(stream1)
//       let audioIn_02 = audioContext.createMediaStreamSource(audio)
//       let dest = audioContext.createMediaStreamDestination()

//       audioIn_01.connect(dest)
//       audioIn_02.connect(dest)

//       setRecorderState(prevState => {
//         return {
//           ...prevState,
//           initRecording: true,
//           mediaStream: dest.stream,
//           otherMediaStream: stream1,
//         }
//       })
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   const stopRecording = () => {
//     if (recorderState.mediaRecorder !== null) {
//       if (recorderState.mediaRecorder.state !== 'inactive') {
//         SpeechRecognition.stopListening()
//         recorderState.mediaRecorder.stop()
//         recordAudioRef.current.pause()
//         recordAudioRef.current.currentTime = 0
//         setLyricsHandler()
//         setRecordingDisplay(false)
//         resetTranscript()
//         setRecorderState(prevState => {
//           return {
//             ...prevState,
//             initRecording: false,
//           }
//         })
//       }
//     }
//   }

//   const handlePlayPause = bool => {
//     if (allTakes.length !== 0) {
//       if (bool === true) {
//         setIsPlaying(true)
//       } else {
//         setIsPlaying(false)
//       }
//     }
//   }

//   //TODO: find better method of playing, pausing, and stopping audio
//   const handlePlayBeat = () => {
//     if (isBeatPlaying) {
//       playBeatRef.current.pause()
//       setIsBeatPlaying(false)
//     } else {
//       playBeatRef.current.play()
//       setIsBeatPlaying(true)
//     }
//   }

//   const handleDeleteFlow = () => {
//     let newTakes = allTakes.filter((each, index) => {
//       if (each.name === currentSong.name) {
//         if (allTakes[index - 1] == null) setCurrentSong(allTakes[index + 1])
//         else setCurrentSong(allTakes[index - 1])
//       } else {
//         return each
//       }
//     })
//     setAllTakes(newTakes)

//     if (newTakes.length === 0) keyRef.current = 0
//   }

//   const handleSaveSongMenu = () => {
//     // if (allTakes.length === 0) return setShowErrorModal(true)
//     setShowSaveSongModal(true)
//   }

//   const navigateToEditLyrics = useCallback(async () => {
//     await actions
//       .getUserSongs({ song_user: user?._id })
//       .then(res => {
//         let userSongs = res.data
//         let allSongs = [...allTakes, ...userSongs]

//         if (userSongs.length === 0 && allTakes.length === 0) {
//           setShowErrorModal(true)
//         } else {
//           navigate('/editLyrics', {
//             state: {
//               propSongs: allSongs,
//               propCurrentSong: currentSong.name ? currentSong : userSongs[0],
//             },
//           })
//         }
//       })
//       .catch(console.error)
//   }, [])

//   const validateTranscript = useCallback((transcript, returnValue) => {
//     if (transcript == null || transcript === '' || transcript === ' ') return
//     const copyTranscript = transcript.slice().trim()
//     const transcriptArray = copyTranscript.split(' ')

//     if (returnValue === 'word') {
//       const refilteredWord = refilterProfanity(transcriptArray[transcriptArray.length - 1])
//       if (refilteredWord.includes("'")) {
//         return refilteredWord.split("'").join('')
//       }
//       return refilteredWord
//     } else {
//       const filteredArray = transcriptArray.map(each => {
//         const filterWord = refilterProfanity(each)
//         return filterWord
//       })
//       return filteredArray
//     }
//   }, [])

//   return (
//     <RecordBoothContext.Provider
//       value={{
//         focusBorder,
//         recorderState,
//         allTakes,
//         setAllTakes,
//         currentSong,
//         setCurrentSong,
//         showSaveSongModal,
//         setShowSaveSongModal,
//         currentRhymeNum,
//         setCurrentRhymeNum,
//         rhymeWord,
//         setRhymeWord,
//         rhymeWordLocked,
//         setRhymeWordLocked,
//         rhymeWordSelected,
//         setRhymeWordSelected,
//         rhymes,
//         setRhymes,
//         rhymesLocked,
//         setRhymesLocked,
//         rhymesSelected,
//         setRhymesSelected,
//         retrievedActionRhymes,
//         setRetrievedActionRhymes,
//       }}
//     >
//       <div className="Record">
//         <RecordingBoothModal
//           toggleModal={toggleModal}
//           setToggleModal={setToggleModal}
//           modalBtnRef={modalBtnRef}
//           focusBorder={focusBorder}
//           setFocusBorder={setFocusBorder}
//         />

//         <SaveSongModal />

//         <SelectMenuModal
//           positionTop={false}
//           positionY={41}
//           maxHeight={96 - 39}
//           list={rhymeNumList}
//           currentItem={currentRhymeNum}
//           setCurrentItem={setCurrentRhymeNum}
//           isOpen={showSelectRhymeNumMenu}
//           onClose={setShowSelectRhymeNumMenu}
//         />
//         <SelectMenuModal
//           positionTop={false}
//           positionY={25}
//           maxHeight={96 - 25}
//           list={allTakes}
//           currentItem={currentSong}
//           setCurrentItem={setCurrentSong}
//           isOpen={showSelectSongMenu}
//           onClose={setShowSelectSongMenu}
//         />
//         <SelectMenuModal
//           positionTop={false}
//           positionY={20}
//           maxHeight={96 - 20}
//           list={beatList}
//           currentItem={currentBeat}
//           setCurrentItem={setCurrentBeat}
//           isOpen={showSelectBeatMenu}
//           onClose={setShowSelectBeatMenu}
//         />

//         <audio id="song" src={currentBeat?.song} loop={true} ref={recordAudioRef}></audio>

//         <div className="record__transcript-lyrics">
//           <div className="record__lyrics--container">
//             <div className={`record__lyrics ${focusBorder === 31 ? 'focus-border' : ''}`}>
//               <ul className="record__lyrics-list" id="currentTranscript" ref={scrollRef}>
//                 {displayTakeLyrics()}
//               </ul>
//             </div>
//           </div>
//           <div className="record__transcript--container">
//             <div className={`record__transcript ${focusBorder === 30 ? 'focus-border' : ''}`}>
//               <p className="record__transcript-text">{transcript}</p>
//             </div>
//           </div>
//         </div>

//         <div className="record__rhyme-actions">
//           <div className="rhyme-actions">
//             <div className="rhyme-actions__bar continuous-rhymes">
//               <div className="rhyme-actions__action-rhyme">
//                 {retrievedActionRhymes && recorderState.initRecording ? (
//                   displayActionWords()
//                 ) : (
//                   <p className="rhyme-actions__action-rhyme-text initial-prompt">
//                     Suggestions for your next bar will be here.
//                   </p>
//                 )}
//               </div>
//             </div>

//             <RhymeActionBar type="rhyme" tutBorder={20} />

//             <RhymeActionBar type="lock" tutBorder={21} />

//             <RhymeActionBar type="select" tutBorder={22} />

//             <div className="interactions__options--container">
//               <div className="interactions__options--shadow-inset">
//                 <div className="interactions__btn--container rhyme-num">
//                   <button
//                     className="interactions__btn--shadow-outset"
//                     onClick={() => setShowSelectRhymeNumMenu(true)}
//                   >
//                     <div className="interactions__btn-text" style={{ justifyContent: 'flex-end' }}>
//                       {currentRhymeNum.name}
//                     </div>
//                     <div className="interactions__btn-icon--container rhyme-num">
//                       <div className="interactions__btn-icon--shadow-inset">
//                         <img
//                           className="button-icons"
//                           src={showSelectRhymeNumMenu ? selectArrowUpIcon : selectArrowDownIcon}
//                           alt="modal"
//                         />
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 <div className="interactions__btn--container tutorial">
//                   <button
//                     className="interactions__btn--shadow-outset"
//                     ref={modalBtnRef}
//                     onClick={() => toggleModalHandler()}
//                   >
//                     <div className="interactions__btn-icon--container tutorial">
//                       <div className="interactions__btn-icon--shadow-inset">
//                         <img className="button-icons" src={helpFilledIcon} alt="modal" />
//                       </div>
//                     </div>
//                     <div className="interactions__btn-text">tutorial</div>
//                   </button>
//                 </div>

//                 <div className="interactions__btn--container edit-lyrics">
//                   <button
//                     className="interactions__btn--shadow-outset"
//                     onClick={() => navigateToEditLyrics()}
//                   >
//                     <div className="interactions__btn-icon--container edit-lyrics">
//                       <div className="interactions__btn-icon--shadow-inset">
//                         <img className="interactions__btn-icon" src={editIcon} alt="" />
//                       </div>
//                     </div>
//                     <div className="interactions__btn-text">edit lyrics</div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="section-2b_flow-controls">
//             <div className="flow-controls-container">
//               <div className="flow-controls-1_playback-display">
//                 <div className="play-btn-container">
//                   <div className="play-btn-container_shadow-div-outset">
//                     <div className="play-btn-container_shadow-div-inset">
//                       {isPlaying ? (
//                         <button
//                           className="play-btn_shadow-div-outset play"
//                           aria-label="Pause"
//                           onClick={() => handlePlayPause(false)}
//                         >
//                           <img
//                             className="button-icons bi-pause"
//                             id="play-stop-img"
//                             src={pauseIcon}
//                             alt="pause icon"
//                           />
//                         </button>
//                       ) : (
//                         <button
//                           className="play-btn_shadow-div-outset pause"
//                           aria-label="Play"
//                           onClick={() => handlePlayPause(true)}
//                         >
//                           <img
//                             className="button-icons bi-play"
//                             id="play-stop-img"
//                             src={playIcon}
//                             alt="play icon"
//                           />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="play-slider-container">
//                   <div className="play-slider-container_shadow-div-outset">
//                     <div className="play-slider-container_shadow-div-inset">
//                       <div className="play-slider_shadow-div-outset">
//                         <AudioTimeSlider
//                           isPlaying={isPlaying}
//                           setIsPlaying={setIsPlaying}
//                           currentSong={currentSong}
//                           bgColor={'#474747'}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flow-controls-2_actions">
//                 <div className="actions-container_shadow-div-outset">
//                   <div className="actions-container_shadow-div-inset">
//                     <div className="actions-1_flow-takes">
//                       <div className="flow-takes-1_select-takes">
//                         <div className="select-takes-container_shadow-div-outset">
//                           <div className="select-takes-container">
//                             <button
//                               className="select-takes_shadow-div-inset"
//                               onClick={() =>
//                                 allTakes?.length !== 0 ? setShowSelectSongMenu(true) : null
//                               }
//                             >
//                               <div className="select-takes_shadow-div-outset">
//                                 <p>{selectTitle}</p>
//                               </div>
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flow-takes-2_takes-actions">
//                         <div className="takes-actions-container">
//                           <div
//                             className={`actions-btn-container ${
//                               focusBorder === 12 ? 'focus-border' : ''
//                             }`}
//                           >
//                             <button
//                               className="actions-btn_shadow-div-outset ab-save"
//                               onClick={handleSaveSongMenu}
//                             >
//                               <img
//                                 className="button-icons bi-help"
//                                 src={saveIcon}
//                                 alt="save icon"
//                               />
//                             </button>

//                             <ErrorModal
//                               isOpen={showErrorModal}
//                               onClose={setShowErrorModal}
//                               title={'No Recorded Takes to Save'}
//                               nextActions={'Press the green mic button to begin Flowing!'}
//                               opacity={true}
//                               modHeight={56}
//                               modWidth={99}
//                               placement={0.5}
//                             />
//                           </div>
//                           <div className="actions-btn-container">
//                             <button
//                               className="actions-btn_shadow-div-outset"
//                               onClick={handleDeleteFlow}
//                             >
//                               <img className="button-icons" src={closeIcon} alt="delete bin icon" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="actions-2_record">
//                       <div className="record-container">
//                         <div className="record-1_select-beat">
//                           <div
//                             className={`select-beat_shadow-div-inset ${
//                               focusBorder === 10 ? 'focus-border' : ''
//                             }`}
//                           >
//                             <div className="select-beat_container">
//                               <button className="select-beat_shadow-div-outset">
//                                 <div className="select-beat-title">Beat :</div>
//                                 <div
//                                   className="track-select"
//                                   onClick={() => setShowSelectBeatMenu(true)}
//                                 >
//                                   {currentBeat?.name}
//                                 </div>
//                               </button>
//                             </div>
//                             <div className="select-beat_play-container">
//                               <button className="select-beat_play-btn" onClick={handlePlayBeat}>
//                                 <img
//                                   className={`button-icons ${isBeatPlaying ? 'pause' : 'play'}`}
//                                   src={isBeatPlaying ? pauseIcon : playIcon}
//                                   alt="play or pause"
//                                 />
//                               </button>
//                               <audio src={currentBeat?.song} ref={playBeatRef} />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <button className={`record-2_record-btn ${focusBorder === 11 ? 'focus-border' : ''}`}>
//               <div className="record-btn_shadow-div-inset">
//                 {recorderState.initRecording ? (
//                   <div className="record-btn_shadow-div-outset" onClick={stopRecording}>
//                     <img
//                       className="button-icons"
//                       id="record-stop-img"
//                       src={stopIcon}
//                       alt="record stop icon"
//                     />
//                   </div>
//                 ) : (
//                   <div className="record-btn_shadow-div-outset" onClick={startRecording}>
//                     <img
//                       className="button-icons"
//                       id="record-stop-img"
//                       src={micIcon}
//                       alt="record mic icon"
//                     />
//                   </div>
//                 )}
//               </div>
//             </button>
//             <div
//               className={`record-2_record-btn--animation-div ${
//                 recorderState.initRecording ? 'record-btn-animation' : ''
//               }`}
//             ></div>
//           </div>
//         </div>
//         <NavBar />
//       </div>
//     </RecordBoothContext.Provider>
//   )
// }
