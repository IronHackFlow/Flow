import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { v4 as uuidv4 } from 'uuid'
import datamuse from 'datamuse'
import TheContext from '../contexts/TheContext'
import RecordBoothContext from '../contexts/RecordBoothContext'
import SelectMenuModal from '../components/SelectMenuModal'
import ErrorModal from '../components/ErrorModal'
import AudioTimeSlider from '../components/AudioTimeSlider'
import SaveSongModal from '../components/SaveSongModal'
import RecordingBoothModal from '../components/RecordingBoothModal'
import useRefilterProfanity from '../utils/useRefilterProfanity'
import { beatList } from '../constants/index'
import actions from '../api'
import NavBar from '../components/NavBar'
import {
  micIcon,
  playIcon,
  pauseIcon,
  stopIcon,
  closeIcon,
  saveIcon,
  lockedIcon,
  shuffleIcon,
  guideIcon,
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
  const [silent, setSilent] = useState(false)
  const [recordingDisplay, setRecordingDisplay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBeatPlaying, setIsBeatPlaying] = useState(false)
  const [showSaveSongModal, setShowSaveSongModal] = useState(false)
  const [showSelectSongMenu, setShowSelectSongMenu] = useState(false)
  const [showSelectBeatMenu, setShowSelectBeatMenu] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [allTakes, setAllTakes] = useState([])

  const [lyricsArr, setLyricsArr] = useState([])
  const [rhymeWordHolder, setRhymeWordHolder] = useState('')
  const [lockRhymeHolder, setLockRhymeHolder] = useState()
  const [retrievedRhymes, setRetrievedRhymes] = useState([])
  const [retrievedSelectedRhymes, setRetrievedSelectedRhymes] = useState([])
  const [retrievedActionRhymes, setRetrievedActionRhymes] = useState([])
  const [selectedRhymeNo, setSelectedRhymeNo] = useState(5)
  const [selectedWordHolder, setSelectedWordHolder] = useState()
  const [lockedRhymes, setLockedRhymes] = useState([])

  const [showLyricsLine, setShowLyricsLine] = useState([])
  const [blobData, setBlobData] = useState({})
  const [dateBefore, setDateBefore] = useState()
  const [dateAfter, setDateAfter] = useState()
  const [toggleModal, setToggleModal] = useState(false)
  const [focusBorder, setFocusBorder] = useState(null)
  const [selectTitle, setSelectTitle] = useState('')

  const modalBtnRef = useRef()
  const playBeatRef = useRef()
  const recordAudioRef = useRef()
  const scrollRef = useRef()
  const selectTakesRef = useRef()
  const keyRef = useRef(0)
  const barNumberRef = useRef(1)

  useEffect(() => {
    if (silent && recorderState.initRecording) {
      setRetrievedActionRhymes([])
      getDatamuseRhymes()
      setLyricsHandler()
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
    setRetrievedSelectedRhymes([])
    if (selectedWordHolder !== undefined) {
      datamuse
        .request(`words?rel_rhy=${selectedWordHolder}&max=20`)
        .then(res => {
          if (res.length !== 0) {
            res.forEach(each => {
              setRetrievedSelectedRhymes(oldRhymes => [...oldRhymes, each.word])
            })
          }
        })
        .catch(console.error)
    }
  }, [selectedWordHolder])

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
        <p className="each-action-word" key={`${uuidv4()}action${index}`}>
          {each}
        </p>
      )
    })
  }, [retrievedActionRhymes])

  const autoScroll = () => {
    let scrollLyrics = document.getElementById('currentTranscript')
    scrollLyrics.scrollTop = scrollLyrics.scrollHeight
  }

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

  async function getDatamuseRhymes() {
    let splitScript = transcript.split(' ')

    if (splitScript[0] !== '') {
      let lastWord = splitScript[splitScript.length - 1]
      let finalWord = lastWord

      if (lastWord.includes("'")) {
        finalWord = lastWord.split("'").join('')
      }
      if (lastWord.includes('*')) {
        finalWord = refilterProfanity(lastWord)
      }

      setRhymeWordHolder(finalWord)
      setRetrievedRhymes([])
      console.log(finalWord, ' - this is the last word')

      const getData = await datamuse
        .request(`words?rel_rhy=${finalWord}&max=30`)
        .then(res => {
          console.log(res, "I'm gonna need to see what I'm working with here")
          if (res.length !== 0) {
            res.forEach(each => {
              setRetrievedRhymes(oldRhymes => [...oldRhymes, each.word])
            })
          }
        })
        .catch(console.error)
    }
  }

  const setLyricsHandler = () => {
    const splitTranscript = transcript.split(' ')
    const filterTranscript = splitTranscript.filter(each => each.length > 0)
    if (filterTranscript.length !== 0) {
      setLyricsArr(oldArr => [...oldArr, filterTranscript])
      setShowLyricsLine(oldLine => [...oldLine, createLyricLine(filterTranscript)])
    }
    resetTranscript()
    autoScroll()
  }

  const createLyricLine = transcript => {
    return (
      <div className="prev-transcript-container">
        <div className="transcript-bar-no">{`${barNumberRef.current++}`}</div>
        <div className="transcript-word-container">
          {transcript.map((each, index) => {
            let isCurse = refilterProfanity(each)
            return (
              <p
                className="prev-transcript-word"
                key={`transcript${uuidv4()}and${index}`}
                onClick={e => showSelectedWord(e)}
              >
                {isCurse ? isCurse : each}
              </p>
            )
          })}
        </div>
      </div>
    )
  }

  const displayTakeLyrics = useCallback(() => {
    console.log(currentSong, 'HYOUO')
    if (allTakes.length === 0) {
      return <p className="no-takes-msg">Start flowing to see your lyrics!</p>
    } else {
      return (
        <>
          {currentSong?.lyrics.map((row, index) => {
            return (
              <div className="prev-transcript-container" key={`${uuidv4()}_${row}_${index}`}>
                <div className="transcript-bar-no">{`${index + 1}`}</div>
                <div className="transcript-word-container">
                  {row.map((word, index) => {
                    return (
                      <p className="prev-transcript-word" key={`${uuidv4()}_${index}_${word}`}>
                        {word}
                      </p>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </>
      )
    }
  }, [allTakes, currentSong])

  const showRhymes = array => {
    if (array?.length >= selectedRhymeNo) {
      return array.slice(0, selectedRhymeNo).map((each, index) => {
        if (index === selectedRhymeNo - 1) {
          return (
            <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>
              {each}
            </p>
          )
        } else {
          return (
            <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>
              {each} {'\u2022'}
            </p>
          )
        }
      })
    } else {
      return array?.map((each, index) => {
        if (index === array.length - 1) {
          return (
            <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>
              {each}
            </p>
          )
        } else {
          return (
            <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>
              {each} {'\u2022'}
            </p>
          )
        }
      })
    }
  }

  const showRhymeWord = holder => {
    let uppercasedWord = holder.charAt(0).toUpperCase() + holder.slice(1)
    return uppercasedWord
  }

  const showSelectedWord = e => {
    let selectStr = e.target.innerText
    let uppercasedStr = selectStr.charAt(0).toUpperCase() + selectStr.slice(1)
    setSelectedWordHolder(uppercasedStr)
  }

  const rhymeOptionNoHandler = useCallback(() => {
    let optionHolder = []
    for (let i = 1; i <= 8; i++) {
      optionHolder.push(i)
    }
    return optionHolder.map((each, index) => {
      return (
        <option value={each} key={`${each}-options-${index}`}>
          {index === 0 ? `${each} - rhyme` : `${each} - rhymes`}
        </option>
      )
    })
  }, [selectedRhymeNo])

  const shuffleRhymeHandler = (array, theState) => {
    let randomRhymeArr = []
    if (array.length !== 0) {
      for (let i = 1; i <= selectedRhymeNo; i++) {
        randomRhymeArr.push(array[Math.floor(Math.random() * array?.length)])
      }
      if (theState === 'topRhymes') {
        setRetrievedRhymes(randomRhymeArr)
      } else {
        setRetrievedSelectedRhymes(randomRhymeArr)
      }
    }
  }

  const lockSuggestion = () => {
    if (retrievedRhymes) {
      setLockRhymeHolder(rhymeWordHolder)
      const copyRhyme = [...retrievedRhymes]
      setLockedRhymes(copyRhyme)
    }
  }

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

  const resetSuggestions = () => {
    setRecordingDisplay(true)
    setCurrentSong(initialSongObject)
    setLyricsArr([])
    setShowLyricsLine([])
    setRhymeWordHolder(null)
    setLockRhymeHolder(null)
    setSelectedWordHolder(null)
    setRetrievedRhymes([])
    setLockedRhymes([])
    resetTranscript()
    barNumberRef.current = 1
  }

  async function startRecording() {
    try {
      resetSuggestions()
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

  return (
    <RecordBoothContext.Provider
      value={{
        allTakes,
        setAllTakes,
        currentSong,
        setCurrentSong,
        showSaveSongModal,
        setShowSaveSongModal,
      }}
    >
      <div id="TestAudio" className="TestAudio">
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

        <div className="section-1_speech">
          <div
            className={`scroll-rhymes-container ${focusBorder === 31 ? 'focus-border' : ''}`}
            id="currentTranscript"
            ref={scrollRef}
          >
            {recordingDisplay ? showLyricsLine : displayTakeLyrics()}
          </div>
          <div className={`scroll-rhymes-line ${focusBorder === 30 ? 'focus-border' : ''}`}>
            <p className="transcript-line-2">{transcript}</p>
          </div>
        </div>

        <div className="section-2_control-panel">
          <div className="section-2a_flow-suggestions">
            <div className="next-bar-container">
              <div className="action-word-container">
                {retrievedActionRhymes && recordingDisplay ? (
                  displayActionWords()
                ) : (
                  <p className="initial-prompt" style={{ color: '#464646', fontSize: '12px' }}>
                    Suggestions for your next bar will be here.
                  </p>
                )}
              </div>
            </div>

            <div className={`suggestions ${focusBorder === 20 ? 'focus-border' : ''}`}>
              <div className="custom-rhyme">
                <div className="rhymed-word_shadow-div-inset">
                  {rhymeWordHolder && recordingDisplay ? (
                    <p className="top-word-holder">{showRhymeWord(rhymeWordHolder)}</p>
                  ) : (
                    <p>Top Rhymes</p>
                  )}
                </div>
                <div className="custom-rhyme-inner">
                  <div className="custom-rhyme_shadow-div-inset">
                    <div className="top-rhymes-container">
                      {rhymeWordHolder && recordingDisplay ? (
                        showRhymes(retrievedRhymes)
                      ) : (
                        <p className="initial-prompt">Start recording to see your top rhymes.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rhyme-lock-container">
                <div className="rhyme-lock-button">
                  <div className="rhyme-lock-outset">
                    <button
                      className="rhyme-lock-btn"
                      onClick={() => shuffleRhymeHandler(retrievedRhymes, 'topRhymes')}
                    >
                      <img className="button-icons" src={shuffleIcon} alt="shuffle" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`suggestions ${focusBorder === 21 ? 'focus-border' : ''}`}>
              <div className="custom-rhyme">
                <div className="rhymed-word_shadow-div-inset rw-two">
                  {lockRhymeHolder && recordingDisplay ? (
                    <p className="locked-word-holder">{showRhymeWord(lockRhymeHolder)}</p>
                  ) : (
                    <p>Locked Rhymes</p>
                  )}
                </div>
                <div className="custom-rhyme-inner" id="lockedRhyme">
                  <div className="custom-rhyme_shadow-div-inset">
                    <div className="top-rhymes-container">
                      {lockRhymeHolder && recordingDisplay ? (
                        showRhymes(lockedRhymes)
                      ) : (
                        <p className="initial-prompt">
                          Click lock button above to save top rhymes here.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rhyme-lock-container">
                <div className="rhyme-lock-button">
                  <div className="rhyme-lock-outset">
                    <button className="rhyme-lock-btn" onClick={lockSuggestion}>
                      <img className="button-icons" src={lockedIcon} alt="lock" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`suggestions ${focusBorder === 22 ? 'focus-border' : ''}`}>
              <div className="custom-rhyme">
                <div className="rhymed-word_shadow-div-inset rw-three">
                  {selectedWordHolder && recordingDisplay ? (
                    <p className="selected-word-holder">{selectedWordHolder}</p>
                  ) : (
                    <p>Selected Rhymes</p>
                  )}
                </div>
                <div className="custom-rhyme-inner" id="lockedRhyme">
                  <div className="custom-rhyme_shadow-div-inset">
                    <div className="top-rhymes-container">
                      {selectedWordHolder && recordingDisplay ? (
                        showRhymes(retrievedSelectedRhymes)
                      ) : (
                        <p className="initial-prompt">
                          Click any flowed lyric to generate rhymes here.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rhyme-lock-container">
                <div className="rhyme-lock-button">
                  <div className="rhyme-lock-outset">
                    <button
                      className="rhyme-lock-btn"
                      onClick={() => shuffleRhymeHandler(retrievedSelectedRhymes, 'selectedRhymes')}
                    >
                      <img className="button-icons" src={shuffleIcon} alt="shuffle" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="interactions__options--container">
              <div className="interactions__options--shadow-inset">
                <div className="interactions__btn--container rhyme-no">
                  <select
                    className="interactions__btn--shadow-outset"
                    value={selectedRhymeNo}
                    onChange={e => setSelectedRhymeNo(e.target.value)}
                  >
                    {rhymeOptionNoHandler()}
                  </select>
                </div>
                <button className="interactions__btn--container tutorial">
                  <div
                    className="interactions__btn--shadow-outset"
                    ref={modalBtnRef}
                    onClick={() => toggleModalHandler()}
                  >
                    <img className="button-icons" src={guideIcon} alt="modal" />
                    tutorial
                  </div>
                </button>
                <div className="interactions__btn--container edit-lyrics">
                  <button
                    className="interactions__btn--shadow-outset"
                    onClick={() => navigateToEditLyrics()}
                  >
                    edit lyrics
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
                            <div className="select-takes_shadow-div-inset">
                              <button
                                className="select-takes_shadow-div-outset"
                                ref={selectTakesRef}
                                onClick={() =>
                                  allTakes?.length !== 0 ? setShowSelectSongMenu(true) : null
                                }
                              >
                                <p>{selectTitle}</p>
                              </button>
                            </div>
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
