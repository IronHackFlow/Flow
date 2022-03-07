import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { v4 as uuidv4 } from 'uuid'
import datamuse from 'datamuse'
import TheContext from '../contexts/TheContext'
import RecordBoothContext from '../contexts/RecordBoothContext'
import RhymeActionBar from './Record/RhymeActionBar'
import SelectMenuModal from '../components/SelectMenuModal'
import ErrorModal from '../components/ErrorModal'
import AudioTimeSlider from '../components/AudioTimeSlider'
import SaveSongModal from '../components/SaveSongModal'
import RecordingBoothModal from '../components/RecordingBoothModal'
import useRefilterProfanity from '../utils/useRefilterProfanity'
import { beatList, rhymeNumList } from '../constants/index'
import actions from '../api'
import NavBar from '../components/NavBar'
import LyricLine from './Record/LyricLine'
import {
  micIcon,
  playIcon,
  pauseIcon,
  stopIcon,
  closeIcon,
  saveIcon,
  helpFilledIcon,
  editIcon,
  selectArrowDownIcon,
  selectArrowUpIcon,
} from '../assets/images/_icons'

function TestAudio(props) {
  const { user } = React.useContext(TheContext)

  const navigate = useNavigate()
  const { refilterProfanity } = useRefilterProfanity()

  const commands = [
    {
      command: /\b(\w(\S{4,}))/g,
      callback: command => getActionWords(`${command}`),
      matchInterim: true,
    },
    // {
    //   command: /(?:\w[*]+)/,
    //   callback: (command) => refilterProfanity(command),
    //   matchInterim: true,
    // }
  ]

  const { transcript, resetTranscript } = useSpeechRecognition({ commands })
  const initialState = {
    recordingMinutes: 0,
    recordingSeconds: 0,
    initRecording: false,
    mediaStream: null,
    mediaRecorder: null,
    audio: null,
  }
  const initialSongObject = {
    name: null,
    song_user: user,
    blob: null,
    song_URL: null,
    lyrics: [],
    date: null,
    duration: 0,
    caption: '',
    video: null,
  }

  const [recorderState, setRecorderState] = useState(initialState)
  const [currentSong, setCurrentSong] = useState(initialSongObject)
  const [currentBeat, setCurrentBeat] = useState(beatList[0])
  const [currentRhymeNum, setCurrentRhymeNum] = useState(rhymeNumList[4])

  const [silent, setSilent] = useState(false)
  const [recordingDisplay, setRecordingDisplay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBeatPlaying, setIsBeatPlaying] = useState(false)
  const [showSaveSongModal, setShowSaveSongModal] = useState(false)
  const [showSelectSongMenu, setShowSelectSongMenu] = useState(false)
  const [showSelectBeatMenu, setShowSelectBeatMenu] = useState(false)
  const [showSelectRhymeNumMenu, setShowSelectRhymeNumMenu] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [toggleModal, setToggleModal] = useState(false)

  const [allTakes, setAllTakes] = useState([])
  const [lyricsArr, setLyricsArr] = useState([])

  const [rhymeWord, setRhymeWord] = useState('')
  const [rhymeWordLocked, setRhymeWordLocked] = useState('')
  const [rhymeWordSelected, setRhymeWordSelected] = useState('')

  const [rhymes, setRhymes] = useState([])
  const [rhymesLocked, setRhymesLocked] = useState([])
  const [rhymesSelected, setRhymesSelected] = useState([])
  const [retrievedActionRhymes, setRetrievedActionRhymes] = useState([])

  const [showLyricsLine, setShowLyricsLine] = useState([])
  const [blobData, setBlobData] = useState({})
  const [dateBefore, setDateBefore] = useState()
  const [dateAfter, setDateAfter] = useState()
  const [focusBorder, setFocusBorder] = useState(null)
  const [selectTitle, setSelectTitle] = useState('')

  const modalBtnRef = useRef()
  const playBeatRef = useRef()
  const recordAudioRef = useRef()
  const scrollRef = useRef()
  const keyRef = useRef(0)
  const barNumberRef = useRef(1)

  useEffect(() => {
    if (silent && recorderState.initRecording) {
      setRetrievedActionRhymes([])
      getDatamuseRhymes(transcript)
      setLyricsHandler()
      resetTranscript()
      autoScroll()
    }
  }, [silent])

  useEffect(() => {
    if (Object.keys(blobData).length !== 0) {
      const songDate = new Date()
      const songDuration = dateAfter - dateBefore - 200
      const songObject = {
        name: blobData.name,
        song_user: user,
        blob: blobData.blob,
        song_URL: blobData.song_URL,
        lyrics: [...lyricsArr],
        date: songDate,
        duration: songDuration,
        caption: '',
        video: null,
      }

      setCurrentSong(songObject)
      setBlobData({})
      setAllTakes(eachTake => [...eachTake, { ...songObject }])
    }
    console.log('Check out the updated AllTakes: ', allTakes, currentSong)
  }, [blobData])

  useEffect(() => {
    if (recorderState.mediaStream) {
      setRecorderState(prevState => {
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        }
      })
    }
  }, [recorderState.mediaStream])

  useEffect(() => {
    const recorder = recorderState.mediaRecorder

    if (recorder && recorder.state === 'inactive') {
      setDateBefore(Date.now())
      recorder.start()
      let chunks = []
      let url

      recorder.ondataavailable = event => {
        setDateAfter(Date.now())
        chunks.push(event.data)
        let mpegBlob = new Blob(chunks, { type: 'audio/mpeg-3' })
        url = URL.createObjectURL(mpegBlob)
        keyRef.current++
        setBlobData({ name: `Flow ${keyRef.current}`, blob: mpegBlob, song_URL: url })
      }

      recorder.onstop = () => {
        chunks = []
        recorderState.otherMediaStream.getAudioTracks().forEach(track => track.stop())
        setRecorderState(prevState => {
          if (prevState.mediaRecorder) {
            return {
              ...initialState,
              audio: url,
            }
          } else {
            return initialState
          }
        })
      }
    }

    return () => {
      if (recorder) {
        recorder.stream.getAudioTracks().forEach(track => track.stop())
      }
    }
  }, [recorderState.mediaRecorder])

  useEffect(() => {
    if (allTakes.length === 0 && !recorderState.initRecording)
      return setSelectTitle('No Recorded Flows')
    if (recorderState.initRecording) return setSelectTitle('Recording...')
    else if (currentSong.name === '' && !recorderState.initRecording)
      return setSelectTitle('No Recorded Flows')
    else return setSelectTitle(`${currentSong.name}`)
  }, [allTakes, currentSong, recorderState.initRecording])

  useEffect(() => {
    if (isBeatPlaying) {
      playBeatRef.current.play()
    } else {
      playBeatRef.current.pause()
    }
  }, [isBeatPlaying])

  const toggleModalHandler = () => {
    if (toggleModal) {
      setToggleModal(false)
    } else {
      setToggleModal(true)
    }
  }

  const displayActionWords = useCallback(() => {
    return retrievedActionRhymes.slice(0, 5).map((each, index) => {
      return (
        <p className="rhyme-actions__action-rhyme-text" key={`${uuidv4()}action${index}`}>
          <span>{index !== 0 ? String.fromCodePoint(8226) : ''}</span>
          {each}
        </p>
      )
    })
  }, [retrievedActionRhymes])

  const autoScroll = useCallback(() => {
    let scrollLyrics = document.getElementById('currentTranscript')
    scrollLyrics.scrollTop = scrollLyrics.scrollHeight + 26
  }, [lyricsArr])

  async function getActionWords(regex) {
    let finalWord = regex
    if (regex.includes('*')) {
      finalWord = refilterProfanity(regex)
    }

    const getData = await datamuse
      .request(`words?rel_trg=${finalWord}&max=20`)
      .then(res => {
        if (res.length !== 0) {
          console.log(res)
          for (let i = 0; i < 1; i++) {
            let randomIndex = Math.floor(Math.random() * (res.length - 1))
            console.log(randomIndex, res[randomIndex].word)
            setRetrievedActionRhymes(oldRhymes => [...oldRhymes, res[randomIndex].word])
          }
        }
      })
      .catch(console.error)
    console.log(retrievedActionRhymes, 'RETRIEVED ACTIONS VERBS')
  }

  const getDatamuseRhymes = useCallback(async transcript => {
    const validated = validateTranscript(transcript, 'word')
    if (validated == null || validated === ' ' || validated === '') return

    setRhymeWord(validated)
    setRhymes([])

    await datamuse
      .request(`words?rel_rhy=${validated}&max=30`)
      .then(res => {
        // console.log(res, "I'm gonna need to see what I'm working with here")
        if (res.length !== 0) {
          let fillRhymes = res.map(each => each.word)
          setRhymes(fillRhymes)
        }
      })
      .catch(console.error)
  }, [])

  const setLyricsHandler = () => {
    const validated = validateTranscript(transcript, 'list')
    if (validated?.length === 0 || validated == null) return
    setLyricsArr(oldArr => [...oldArr, validated])
  }

  const displayTakeLyrics = useCallback(() => {
    if (allTakes.length === 0 && !recorderState.initRecording) {
      return (
        <li className="record__lyrics-item">
          <div className="record__item-words">
            <p className="record__item-words-text initial-prompt">
              Start flowing to see your lyrics!
            </p>
          </div>
        </li>
      )
    }
    if (recorderState.initRecording) {
      return lyricsArr.map((row, index) => {
        return <LyricLine row={row} index={index} />
      })
    } else {
      return currentSong.lyrics.map((row, index) => {
        return <LyricLine row={row} index={index} />
      })
    }
  }, [allTakes, currentSong, lyricsArr, recorderState.initRecording])

  let myReq //animation frame ID
  const detectSilence = (stream, silence_delay = 50, min_decibels = -80) => {
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    const streamNode = ctx.createMediaStreamSource(stream)
    streamNode.connect(analyser)
    analyser.minDecibels = min_decibels
    const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
    let silence_start = performance.now()
    let triggered = false // trigger only once per silence event

    const loop = time => {
      myReq = requestAnimationFrame(loop)
      // we'll loop every 60th of a second to check
      analyser.getByteFrequencyData(data) // get current data
      if (data.some(v => v)) {
        // if there is data above the given db limit
        if (triggered) {
          triggered = false
          setSilent(false)
        }
        silence_start = time // set it to now
      }
      if (!triggered && time - silence_start > silence_delay) {
        setSilent(true)
        triggered = true
      }
    }
    loop()
  }

  const resetRecording = () => {
    // setRecordingDisplay(true)
    setCurrentSong(initialSongObject)
    setLyricsArr([])
    setShowLyricsLine([])
    setRhymeWord(null)
    setRhymeWordLocked(null)
    setRhymeWordSelected(null)
    setRhymes([])
    setRhymesLocked([])
    resetTranscript()
    barNumberRef.current = 1
  }

  async function startRecording() {
    resetRecording()
    try {
      const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true })
      SpeechRecognition.startListening({ continuous: true })

      var audio = document.getElementById('song').captureStream()
      document.getElementById('song').play()

      detectSilence(stream1)
      const audioContext = new AudioContext()
      let audioIn_01 = audioContext.createMediaStreamSource(stream1)
      let audioIn_02 = audioContext.createMediaStreamSource(audio)
      let dest = audioContext.createMediaStreamDestination()

      audioIn_01.connect(dest)
      audioIn_02.connect(dest)

      setRecorderState(prevState => {
        return {
          ...prevState,
          initRecording: true,
          mediaStream: dest.stream,
          otherMediaStream: stream1,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const stopRecording = () => {
    if (recorderState.mediaRecorder !== null) {
      if (recorderState.mediaRecorder.state !== 'inactive') {
        SpeechRecognition.stopListening()
        recorderState.mediaRecorder.stop()
        recordAudioRef.current.pause()
        recordAudioRef.current.currentTime = 0
        setLyricsHandler()
        setRecordingDisplay(false)
        resetTranscript()
        setRecorderState(prevState => {
          return {
            ...prevState,
            initRecording: false,
          }
        })
      }
    }
  }

  const handlePlayPause = bool => {
    if (allTakes.length !== 0) {
      if (bool === true) {
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }
  }

  //TODO: find better method of playing, pausing, and stopping audio
  const handlePlayBeat = () => {
    if (isBeatPlaying) {
      playBeatRef.current.pause()
      setIsBeatPlaying(false)
    } else {
      playBeatRef.current.play()
      setIsBeatPlaying(true)
    }
  }

  const handleDeleteFlow = () => {
    let newTakes = allTakes.filter((each, index) => {
      if (each.name === currentSong.name) {
        if (allTakes[index - 1] == null) setCurrentSong(allTakes[index + 1])
        else setCurrentSong(allTakes[index - 1])
      } else {
        return each
      }
    })
    setAllTakes(newTakes)

    if (newTakes.length === 0) keyRef.current = 0
  }

  const handleSaveSongMenu = () => {
    // if (allTakes.length === 0) return setShowErrorModal(true)
    setShowSaveSongModal(true)
  }

  const navigateToEditLyrics = async () => {
    await actions
      .getUserSongs({ song_user: user?._id })
      .then(res => {
        let userSongs = res.data
        let allSongs = [...allTakes, ...userSongs]

        if (userSongs.length === 0 && allTakes.length === 0) {
          setShowErrorModal(true)
        } else {
          navigate('/editLyrics', {
            state: {
              propSongs: allSongs,
              propCurrentSong: currentSong.name ? currentSong : userSongs[0],
            },
          })
        }
      })
      .catch(console.error)
  }

  const validateTranscript = useCallback((transcript, returnValue) => {
    if (transcript == null || transcript === '' || transcript === ' ') return
    const copyTranscript = transcript.slice().trim()
    const transcriptArray = copyTranscript.split(' ')

    if (returnValue === 'word') {
      const refilteredWord = refilterProfanity(transcriptArray[transcriptArray.length - 1])
      if (refilteredWord.includes("'")) {
        return refilteredWord.split("'").join('')
      }
      return refilteredWord
    } else {
      const filteredArray = transcriptArray.map(each => {
        const filterWord = refilterProfanity(each)
        return filterWord
      })
      return filteredArray
    }
  }, [])

  return (
    <RecordBoothContext.Provider
      value={{
        focusBorder,
        recorderState,
        allTakes,
        setAllTakes,
        currentSong,
        setCurrentSong,
        showSaveSongModal,
        setShowSaveSongModal,
        currentRhymeNum,
        setCurrentRhymeNum,
        rhymeWord,
        setRhymeWord,
        rhymeWordLocked,
        setRhymeWordLocked,
        rhymeWordSelected,
        setRhymeWordSelected,
        rhymes,
        setRhymes,
        rhymesLocked,
        setRhymesLocked,
        rhymesSelected,
        setRhymesSelected,
        retrievedActionRhymes,
        setRetrievedActionRhymes,
      }}
    >
      <div className="Record">
        <RecordingBoothModal
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          modalBtnRef={modalBtnRef}
          focusBorder={focusBorder}
          setFocusBorder={setFocusBorder}
        />

        <SaveSongModal />

        <SelectMenuModal
          positionTop={false}
          positionY={41}
          maxHeight={96 - 39}
          list={rhymeNumList}
          currentItem={currentRhymeNum}
          setCurrentItem={setCurrentRhymeNum}
          isOpen={showSelectRhymeNumMenu}
          onClose={setShowSelectRhymeNumMenu}
        />
        <SelectMenuModal
          positionTop={false}
          positionY={25}
          maxHeight={96 - 25}
          list={allTakes}
          currentItem={currentSong}
          setCurrentItem={setCurrentSong}
          isOpen={showSelectSongMenu}
          onClose={setShowSelectSongMenu}
        />
        <SelectMenuModal
          positionTop={false}
          positionY={20}
          maxHeight={96 - 20}
          list={beatList}
          currentItem={currentBeat}
          setCurrentItem={setCurrentBeat}
          isOpen={showSelectBeatMenu}
          onClose={setShowSelectBeatMenu}
        />

        <audio id="song" src={currentBeat?.song} loop={true} ref={recordAudioRef}></audio>

        <div className="record__transcript-lyrics">
          <div className="record__lyrics--container">
            <div className="record__lyrics">
              <ul
                className={`record__lyrics-list ${focusBorder === 31 ? 'focus-border' : ''}`}
                id="currentTranscript"
                ref={scrollRef}
              >
                {displayTakeLyrics()}
              </ul>
            </div>
          </div>
          <div className="record__transcript--container">
            <div className={`record__transcript ${focusBorder === 30 ? 'focus-border' : ''}`}>
              <p className="record__transcript-text">{transcript}</p>
            </div>
          </div>
        </div>

        <div className="record__rhyme-actions">
          <div className="rhyme-actions">
            <div className="rhyme-actions__bar continuous-rhymes">
              <div className="rhyme-actions__action-rhyme">
                {retrievedActionRhymes && recorderState.initRecording ? (
                  displayActionWords()
                ) : (
                  <p className="rhyme-actions__action-rhyme-text initial-prompt">
                    Suggestions for your next bar will be here.
                  </p>
                )}
              </div>
            </div>

            <RhymeActionBar type="rhyme" tutBorder={20} />

            <RhymeActionBar type="lock" tutBorder={21} />

            <RhymeActionBar type="select" tutBorder={22} />

            <div className="interactions__options--container">
              <div className="interactions__options--shadow-inset">
                <div className="interactions__btn--container rhyme-num">
                  <button
                    className="interactions__btn--shadow-outset"
                    onClick={() => setShowSelectRhymeNumMenu(true)}
                  >
                    <div className="interactions__btn-text" style={{ justifyContent: 'flex-end' }}>
                      {currentRhymeNum.name}
                    </div>
                    <div className="interactions__btn-icon--container rhyme-num">
                      <div className="interactions__btn-icon--shadow-inset">
                        <img
                          className="button-icons"
                          src={showSelectRhymeNumMenu ? selectArrowUpIcon : selectArrowDownIcon}
                          alt="modal"
                        />
                      </div>
                    </div>
                  </button>
                </div>

                <div className="interactions__btn--container tutorial">
                  <button
                    className="interactions__btn--shadow-outset"
                    ref={modalBtnRef}
                    onClick={() => toggleModalHandler()}
                  >
                    <div className="interactions__btn-icon--container tutorial">
                      <div className="interactions__btn-icon--shadow-inset">
                        <img className="button-icons" src={helpFilledIcon} alt="modal" />
                      </div>
                    </div>
                    <div className="interactions__btn-text">tutorial</div>
                  </button>
                </div>

                <div className="interactions__btn--container edit-lyrics">
                  <button
                    className="interactions__btn--shadow-outset"
                    onClick={() => navigateToEditLyrics()}
                  >
                    <div className="interactions__btn-icon--container edit-lyrics">
                      <div className="interactions__btn-icon--shadow-inset">
                        <img className="interactions__btn-icon" src={editIcon} alt="" />
                      </div>
                    </div>
                    <div className="interactions__btn-text">edit lyrics</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="section-2b_flow-controls">
            <div className="flow-controls-container">
              <div className="flow-controls-1_playback-display">
                <div className="play-btn-container">
                  <div className="play-btn-container_shadow-div-outset">
                    <div className="play-btn-container_shadow-div-inset">
                      {isPlaying ? (
                        <button
                          className="play-btn_shadow-div-outset play"
                          aria-label="Pause"
                          onClick={() => handlePlayPause(false)}
                        >
                          <img
                            className="button-icons bi-pause"
                            id="play-stop-img"
                            src={pauseIcon}
                            alt="pause icon"
                          />
                        </button>
                      ) : (
                        <button
                          className="play-btn_shadow-div-outset pause"
                          aria-label="Play"
                          onClick={() => handlePlayPause(true)}
                        >
                          <img
                            className="button-icons bi-play"
                            id="play-stop-img"
                            src={playIcon}
                            alt="play icon"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="play-slider-container">
                  <div className="play-slider-container_shadow-div-outset">
                    <div className="play-slider-container_shadow-div-inset">
                      <div className="play-slider_shadow-div-outset">
                        <AudioTimeSlider
                          isPlaying={isPlaying}
                          setIsPlaying={setIsPlaying}
                          currentSong={currentSong}
                          bgColor={'#474747'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flow-controls-2_actions">
                <div className="actions-container_shadow-div-outset">
                  <div className="actions-container_shadow-div-inset">
                    <div className="actions-1_flow-takes">
                      <div className="flow-takes-1_select-takes">
                        <div className="select-takes-container_shadow-div-outset">
                          <div className="select-takes-container">
                            <button
                              className="select-takes_shadow-div-inset"
                              onClick={() =>
                                allTakes?.length !== 0 ? setShowSelectSongMenu(true) : null
                              }
                            >
                              <div className="select-takes_shadow-div-outset">
                                <p>{selectTitle}</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flow-takes-2_takes-actions">
                        <div className="takes-actions-container">
                          <div
                            className={`actions-btn-container ${
                              focusBorder === 12 ? 'focus-border' : ''
                            }`}
                          >
                            <button
                              className="actions-btn_shadow-div-outset ab-save"
                              onClick={handleSaveSongMenu}
                            >
                              <img
                                className="button-icons bi-help"
                                src={saveIcon}
                                alt="save icon"
                              />
                            </button>

                            <ErrorModal
                              isOpen={showErrorModal}
                              onClose={setShowErrorModal}
                              title={'No Recorded Takes to Save'}
                              nextActions={'Press the green mic button to begin Flowing!'}
                              opacity={true}
                              modHeight={56}
                              modWidth={99}
                              placement={0.5}
                            />
                          </div>
                          <div className="actions-btn-container">
                            <button
                              className="actions-btn_shadow-div-outset"
                              onClick={handleDeleteFlow}
                            >
                              <img className="button-icons" src={closeIcon} alt="delete bin icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="actions-2_record">
                      <div className="record-container">
                        <div className="record-1_select-beat">
                          <div
                            className={`select-beat_shadow-div-inset ${
                              focusBorder === 10 ? 'focus-border' : ''
                            }`}
                          >
                            <div className="select-beat_container">
                              <button className="select-beat_shadow-div-outset">
                                <div className="select-beat-title">Beat :</div>
                                <div
                                  className="track-select"
                                  onClick={() => setShowSelectBeatMenu(true)}
                                >
                                  {currentBeat?.name}
                                </div>
                              </button>
                            </div>
                            <div className="select-beat_play-container">
                              <button className="select-beat_play-btn" onClick={handlePlayBeat}>
                                <img
                                  className={`button-icons ${isBeatPlaying ? 'pause' : 'play'}`}
                                  src={isBeatPlaying ? pauseIcon : playIcon}
                                  alt="play or pause"
                                />
                              </button>
                              <audio src={currentBeat?.song} ref={playBeatRef} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="record-2_record-btn">
              <div
                className={`record-btn_shadow-div-inset ${
                  focusBorder === 11 ? 'focus-border' : ''
                }`}
              >
                {recorderState.initRecording ? (
                  <button className="record-btn_shadow-div-outset" onClick={stopRecording}>
                    <img
                      className="button-icons"
                      id="record-stop-img"
                      src={stopIcon}
                      alt="record stop icon"
                    />
                  </button>
                ) : (
                  <button className="record-btn_shadow-div-outset" onClick={startRecording}>
                    <img
                      className="button-icons"
                      id="record-stop-img"
                      src={micIcon}
                      alt="record mic icon"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </RecordBoothContext.Provider>
  )
}
export default TestAudio
