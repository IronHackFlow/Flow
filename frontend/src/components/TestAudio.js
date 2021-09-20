import React, { useRef, useState, useEffect, useCallback } from 'react'
import beat1 from '../assets/beatsTrack1.m4a'
import beat2 from '../assets/beatsTrack2.m4a'
import beat3 from '../assets/beatsTrack3.m4a'
import beat4 from '../assets/beatsTrack4.m4a'
import beat5 from '../assets/beatsTrack5.m4a'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import datamuse from 'datamuse'
import mic from '../images/modern-mic.svg'
import play from '../images/play.svg'
import pause from '../images/pause.svg'
import stop from '../images/stop.svg'
import xExit from '../images/exit-x-2.svg'
import save from '../images/save-disk.svg'
import locked from '../images/locked.svg'
import edit from '../images/edit.svg'
import send from '../images/send.svg'
import help from '../images/help2.svg'
import TheContext from '../TheContext'
import Modal from './ModalMenu'
import actions from '../api'
import NavBar from './NavBar'

function TestAudio(props) {
  const { user } = React.useContext(TheContext)

  const [recordings, setRecordings] = useState(<audio id="userRecording"></audio>)
  const [tracks, setTracks] = useState([
    { song: beat1, name: 'After Dark' },
    { song: beat2, name: 'Futurology' },
    { song: beat3, name: 'Peacock' },
    { song: beat4, name: 'Callback' },
    { song: beat5, name: 'Drained' },
  ])
  const [audioSrc, setAudioSrc] = useState(null)
  const [rhymes, setRhymes] = useState([])
  const [silent, setSilent] = useState(false)
  const [lock, setLock] = useState([])
  const [keyCounter, setKeyCounter] = useState(0)
  const [takes, setTakes] = useState([])
  const [allTakes, setAllTakes] = useState([])
  const [songUploadObject, setSongUploadObject] = useState([])
  const [selectedOption, setSelectedOption] = useState()
  const [songNameUpdate, setSongNameUpdate] = useState()
  const [songNameInput, setSongNameInput] = useState()
  const [songCaptionInput, setSongCaptionInput] = useState()
  const [saveSongMenu, setSaveSongMenu] = useState(false)
  const { transcript, resetTranscript } = useSpeechRecognition()

  const saveSongPopUpRef = useRef()
  const section2aRef = useRef()
  const songNameInputRef = useRef()
  const songCaptionInputRef = useRef()
  const buttonCloseRef = useRef()
  const takeAudioRef = useRef('')
  const selectTakesRef = useRef()
  const s2aSuggestions1Ref = useRef()
  const s2aSuggestions2Ref = useRef()
  const s2aCustomRhymeRef = useRef()
  const s2aRhymeLockRef = useRef()
  const saveOutRef1 = useRef()
  const saveOutRef2 = useRef()
  const saveOutRef3 = useRef()
  const saveOutRef4 = useRef()
  const saveOutRef5 = useRef()
  const saveOutRef6 = useRef()
  const saveOutRef7 = useRef()
  const saveOutRef8 = useRef()
  const saveOutRef9 = useRef()
  const saveOutRef10 = useRef()
  const saveOutRef11 = useRef()
  const keyRef = useRef(0)

  class SongData {
    constructor(songmix, name, blobFile) {
      this.songName = null
      this.songCaption = null
      this.date = null
      this.user = user
      this.songmix = songmix
      this.lyrics = null
      this.background = null
      this.name = name
      this.songBlob = blobFile
    }
    setLyrics() {
      this.lyrics = lyricsArr
    }
    setDate() {
      var today = new Date()
      this.date = today
    }
    setName() {
      this.name = prompt("What's the name of your song?", 'song name')
    }
  }

  useEffect(() => {
    const lastWord = transcript.split(' ')[transcript.split(' ').length - 1]
    let retrievedRhymes = []
    let retHolder = []
    datamuse.request(`words?rel_rhy=${lastWord}&max=5`).then(res => {
      if (res.length !== 0) {
        for (let i = 0; i < 3; i++) {
          retHolder.push(res[Math.floor(Math.random() * res.length)].word)
        }
        retHolder.forEach(element => {
          retrievedRhymes.push(` ${element} `)
        })
        if (retrievedRhymes.length !== 0) {
          setRhymes(retrievedRhymes)
        }
        addSongLine()
      }
    })
  }, [silent])

  useEffect(() => {
    takeAudioRef.current.src = audioSrc
  }, [audioSrc])

  let myReq //animation frame ID

  const loadTrack = () => {
    let selectBox = document.getElementById('selectBox')
    let selectedValue = selectBox.options[selectBox.selectedIndex].value
    document.getElementById('song').src = selectedValue
  }

  const chooseTrack = () => {
    return tracks.map((element, index) => {
      return (
        <option key={index} value={element.song}>
          {element.name}{' '}
        </option>
      )
    })
  }

  function recordAudio() {
    function detectSilence(
      stream,
      onSoundEnd = _ => {},
      onSoundStart = _ => {},
      silence_delay = 50,
      min_decibels = -80,
    ) {
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      const streamNode = ctx.createMediaStreamSource(stream)

      streamNode.connect(analyser)
      analyser.minDecibels = min_decibels

      const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
      let silence_start = performance.now()
      let triggered = false // trigger only once per silence event

      function loop(time) {
        myReq = requestAnimationFrame(loop) // we'll loop every 60th of a second to check
        analyser.getByteFrequencyData(data) // get current data
        if (data.some(v => v)) {
          // if there is data above the given db limit
          if (triggered) {
            triggered = false
            onSoundStart()
          }
          silence_start = time // set it to now
        }
        if (!triggered && time - silence_start > silence_delay) {
          onSoundEnd()
          triggered = true
        }
      }
      loop()
    }

    function onSilence() {
      ////console.log('silence')
      setSilent(true)
    }
    function onSpeak() {
      //console.log('speaking');
      setSilent(false)
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(stream => {
        detectSilence(stream, onSilence, onSpeak)

        var audio = document.getElementById('song').captureStream()
        document.getElementById('song').play()

        mergeStreams(stream, audio)
        SpeechRecognition.startListening({ continuous: true })
      })
      .catch(console.error)
  }

  //add recording to list
  const addRec = (blobby, name, blobFile) => {
    // const copyRec = (
    //   <audio src={blobby} id={"userRecording"} key={name} ref={takeAudioRef}></audio>
    // );
    const songObject = new SongData(blobby, name, blobFile)
    setAllTakes(eachTake => [...eachTake, songObject])
    console.log(allTakes, 'this should be solid')
    // setRecordings(copyRec);
    takes.push(blobby)
  }

  function mergeStreams(stream1, stream2) {
    const audioContext = new AudioContext()

    let audioIn_01 = audioContext.createMediaStreamSource(stream1)
    let audioIn_02 = audioContext.createMediaStreamSource(stream2)

    let dest = audioContext.createMediaStreamDestination()

    audioIn_01.connect(dest)
    audioIn_02.connect(dest)

    const recorder = new MediaRecorder(dest.stream)
    recorder.start()
    //console.log('started recording')

    let chunks = []

    recorder.ondataavailable = event => {
      chunks.push(event.data)
      //console.log(chunks)
      go(chunks)
      SpeechRecognition.stopListening()
    }

    document.getElementById('fixer').onclick = () => {
      recorder.stop()
      cancelAnimationFrame(myReq)
      //console.log('stopped recording')
    }
  }

  function go(blob) {
    let mpegBlob = new Blob(blob, { type: 'audio/mpeg-3' })
    const url = window.URL.createObjectURL(mpegBlob)
    keyRef.current++
    addRec(url, `take ${keyRef.current}`, mpegBlob)
  }

  const stopRecording = () => {
    document.getElementById('song').pause()
    document.getElementById('song').currentTime = 0
  }
  //currently there exists a delay that needs to be offset when merged.!!!!!!!
  let [lyricsArr, setLyricsArr] = useState([])

  const songLine = () => {
    const lastLine = transcript
    lyricsArr.push(lastLine)
    setLyricsArr(lyricsArr)
    setKeyCounter(keyCounter + 1)
    return (
      <p className="transcript-line-1" key={keyCounter}>
        {lastLine}.
      </p>
    )
  }

  let [line, setLine] = useState([])

  const addSongLine = () => {
    const copyLine = [...line]
    copyLine.push(songLine())
    resetTranscript()
    setLine(copyLine)
    autoScroll()
  }

  const autoScroll = () => {
    let scrollLyrics = document.getElementById('currentTranscript')
    scrollLyrics.scrollTop = scrollLyrics.scrollHeight
  }

  const lockSuggestion = () => {
    const copyRhyme = [...rhymes]
    setLock(copyRhyme)
  }

  const clearLockSuggestions = () => {
    setLock([])
  }

  const handleRecStop = () => {
    if (document.getElementById('song').paused) {
      // document.getElementById('record-stop').setAttribute('class', 'button-icons bi-stop')
      document.getElementById('record-stop-img').src = stop
      recordAudio()
    } else {
      // document.getElementById('record-stop').setAttribute('class', 'button-icons bi-record')
      document.getElementById('record-stop-img').src = mic
      stopRecording()
      document.getElementById('fixer').click()
    }
  }

  // //make a time slider
  function TimeSlider() {
    const [time, setTime] = useState(0)

    useEffect(() => {
      document.getElementById('userRecording').currentTime = time
    }, [time])
    //change stuff here

    return (
      <section>
        <input
          id="timeSlider"
          type="range"
          min={0}
          max={30}
          step={0.02}
          value={time}
          onChange={event => {
            setTime(event.target.valueAsNumber)
          }}
        />
      </section>
    )
  }

  const handlePlayPause = () => {
    if (takeAudioRef.current.paused) {
      document.getElementById('play-stop-img').src = pause
      takeAudioRef.current.play()
    } else {
      document.getElementById('play-stop-img').src = play
      takeAudioRef.current.pause()
    }
  }

  const loadTake = e => {
    console.log(e.target, 'loaded take target')
    setSelectedOption(e.target.value)
    setAudioSrc(e.target.value)
    setSongUploadObject(allTakes[e.target.selectedIndex])
  }

  const deleteOneTake = () => {
    setAllTakes(eachTake => eachTake.filter(item => item.songmix !== selectedOption))
  }

  const displayTake = () => {
    if (takes.length === 0) {
    } else {
      let selectedTake = document.getElementById('takes')
      selectedTake.selectedIndex = takes.length - 1
      const freshTrack = allTakes[takes.length - 1]
      // console.log(freshTrack, allTakes, 'waht?')

      if (freshTrack) {
        freshTrack.setDate()
        freshTrack.setLyrics()
      }
    }
  }

  const chooseTake = useCallback(() => {
    if (allTakes.length === 0) {
      return <option>Your Takes</option>
    } else {
      return allTakes.map((element, index) => {
        return (
          <option value={element.songmix} key={index}>
            {element.songName ? element.songName : element.name}
          </option>
        )
      })
    }
  }, [allTakes, songNameUpdate])

  const handleSaveSubmit = e => {
    e.preventDefault()
    if (allTakes.length === 0) {
      console.log('no takes')
    } else {
      const fileName = songUploadObject?.user?._id + songNameInput.replaceAll(' ', '-')
      songUploadObject.songName = songNameInput
      songUploadObject.songCaption = songCaptionInput
      songUploadObject.date = new Date()

      actions
        .uploadFile(
          {
            fileName: fileName,
            fileType: 'audio/mpeg-3',
            file: songUploadObject.songBlob,
            kind: 'song',
          },
          songUploadObject,
        )
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    }
    setSongNameUpdate(songUploadObject.songName)

    setTimeout(() => {
      songNameInputRef.current.value = ''
      songCaptionInputRef.current.value = ''
    }, [200])
  }

  const toggleSaveSongMenu = () => {
    if (saveSongMenu === false) {
      setSaveSongMenu(true)
    } else {
      setSaveSongMenu(false)
    }
  }

  useEffect(() => {
    if (saveSongMenu === true) {
      songNameInputRef.current.focus()
      section2aRef.current.style.height = '5%'
      section2aRef.current.style.transition = 'height .3s'
      s2aSuggestions1Ref.current.style.display = 'none'
      s2aSuggestions2Ref.current.style.height = '50%'
      s2aCustomRhymeRef.current.style.opacity = 0
      s2aRhymeLockRef.current.style.opacity = 0
      buttonCloseRef.current.style.opacity = 1
      saveOutRef1.current.style.height = '70%'
      saveOutRef1.current.style.transition = 'height .5s'
      saveOutRef2.current.style.height = '18%'
      saveOutRef2.current.style.transition = 'height .5s'
      saveOutRef3.current.style.height = '81%'
      saveOutRef3.current.style.transition = 'height .5s'
      saveOutRef4.current.style.height = '94%'
      saveOutRef4.current.style.transition = 'height .5s'
      saveOutRef5.current.style.height = '96%'
      saveOutRef5.current.style.transition = 'height .5s'
      saveOutRef6.current.style.height = '24%'
      saveOutRef6.current.style.transition = 'height .5s'
      saveOutRef7.current.style.width = '100%'
      saveOutRef7.current.style.transition = 'width .5s'
      saveOutRef8.current.style.width = '97%'
      saveOutRef8.current.style.transition = 'width .5s'
      saveOutRef9.current.style.opacity = 0
      saveOutRef9.current.style.width = '0'
      saveOutRef9.current.style.transition = 'all .5s'
      saveOutRef10.current.style.opacity = 0
      saveOutRef10.current.style.width = '0'
      saveOutRef11.current.style.width = '95%'
      selectTakesRef.current.style.width = '88%'
    } else {
      section2aRef.current.style.height = '30%'
      section2aRef.current.style.transition = 'height .5s'
      s2aSuggestions1Ref.current.style.display = 'flex'
      s2aSuggestions2Ref.current.style.height = '41%'
      s2aCustomRhymeRef.current.style.opacity = 1
      s2aRhymeLockRef.current.style.opacity = 1
      saveOutRef1.current.style.height = '50%'
      saveOutRef2.current.style.height = '25%'
      saveOutRef3.current.style.height = '75%'
      saveOutRef4.current.style.height = '90%'
      saveOutRef5.current.style.height = '94%'
      saveOutRef6.current.style.height = '45%'
      saveOutRef7.current.style.width = '65%'
      saveOutRef8.current.style.width = '97%'
      saveOutRef9.current.style.opacity = 1
      saveOutRef9.current.style.width = '35%'
      saveOutRef10.current.style.opacity = 1
      saveOutRef10.current.style.width = '22%'
      saveOutRef11.current.style.width = '70%'
      selectTakesRef.current.style.width = '84%'
    }
  }, [saveSongMenu])

  const saveSongDisplay = () => {
    if (saveSongMenu === true) {
      return (
        <div className="SaveSongDisplay" ref={saveSongPopUpRef}>
          <form className="song-inputs-container" onSubmit={handleSaveSubmit}>
            <div className="section-title">Upload A Take</div>

            <div className="section-1_song-name">
              <input
                className="song-name-input"
                ref={songNameInputRef}
                type="text"
                placeholder="Name this flow.."
                onChange={e => setSongNameInput(e.target.value)}
              ></input>
            </div>

            <div className="section-2_song-caption">
              <input
                className="song-caption-input"
                ref={songCaptionInputRef}
                type="text"
                placeholder="Caption this flow.."
                onChange={e => setSongCaptionInput(e.target.value)}
              ></input>
            </div>

            <div className="buttons-container">
              <div className="buttons-container_shadow-div-inset">
                <button
                  className="cancel-save-button"
                  ref={buttonCloseRef}
                  type="button"
                  onClick={toggleSaveSongMenu}
                >
                  <img className="button-icons" src={xExit} alt="exit" />
                </button>

                <button className="save-song-button" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )
    } else {
      return (
        <div className="actions-2_record">
          <div className="record-container">
            <div className="record-1_select-beat">
              <div className="select-beat-title">Select A Beat :</div>
              <div className="select-beat_shadow-div-inset">
                <div className="select-beat_shadow-div-outset">
                  <select id="selectBox" className="track-select" onChange={loadTrack}>
                    {chooseTrack()}
                  </select>
                </div>
              </div>
            </div>

            <div className="record-2_record-btn">
              <div className="record-btn_shadow-div-inset">
                <div
                  className="record-btn_shadow-div-outset"
                  onClick={handleRecStop}
                  id="record-stop"
                >
                  <img
                    className="button-icons bi-record bi-record-float"
                    id="record-stop-img"
                    src={mic}
                    alt="record icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  const modalPopup = () => {
    const modal = document.querySelector('.modal')
    modal.style.bottom = '0vh'
    modal.style.transition = 'bottom .5s'
    const closeBtn = document.querySelector('.close-btn')

    closeBtn.addEventListener('click', () => {
      modal.style.bottom = '-65vh'
      modal.style.transition = 'bottom .5s'
    })
  }

  const deleteTake = () => {
    setLine([])
    setRhymes([])
  }

  const audioRef = useRef(new Audio(audioSrc))
  const [trackIndex, setTrackIndex] = useState(0)
  const [trackProgress, setTrackProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { duration } = audioRef.current
  const intervalRef = useRef()
  const isReady = useRef(false)

  useEffect(() => {
    if (isPlaying) {
      console.log(audioRef.current, 'what?')
      audioRef.current.play()
      startTimer()
    } else {
      clearInterval(intervalRef.current)
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      audioRef.current.pause()
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    audioRef.current.pause()

    audioRef.current = new Audio(audioSrc)
    setTrackProgress(audioRef.current.currentTime)

    // if (isReady.current) {
    //   audioRef.current.play();
    //   setIsPlaying(true);
    //   startTimer();
    // }
    // else {
    //   isReady.current = true
    // }
  }, [selectedOption, audioSrc])

  const currentPercentage = duration ? `${(trackProgress / duration) * 100}%` : '0%'
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #63DEBC), color-stop(${currentPercentage}, #555555))
  `

  const startTimer = () => {
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setIsPlaying(false)
      } else {
        setTrackProgress(audioRef.current.currentTime)
        console.log('audioRef current time: ', audioRef.current.currentTime)
      }
    }, [1000])
  }

  const onScrub = value => {
    clearInterval(intervalRef.current)
    audioRef.current.currentTime = value
    setTrackProgress(audioRef.current.currentTime)
  }

  const onScrubEnd = () => {
    console.log('what happens here?')
    if (!isPlaying) {
      setIsPlaying(true)
    }
    startTimer()
  }

  return (
    <div className="TestAudio">
      <audio id="song" src={beat1} loop={true}></audio>
      <p id="fixer"></p>

      <div className="section-1_speech">
        <div className="scroll-rhymes-container" id="currentTranscript">
          {line}
          {/* <p className="transcript-line-2">{transcript}</p> */}
        </div>
        <div className="scroll-rhymes-line">
          <p className="transcript-line-2">{transcript}</p>
        </div>
      </div>

      <div className="section-2_control-panel">
        <div className="section-2a_flow-suggestions" ref={section2aRef}>
          <div className="suggestions sug-1" ref={s2aSuggestions1Ref}>
            <div className="custom-rhyme">
              <div className="custom-rhyme-inner" id="suggestion" onClick={lockSuggestion}>
                <p className="transcript-line-3">{rhymes}</p>
              </div>
              <div className="custom-rhyme-title">Flyest Rhyme Suggestions</div>
            </div>
            <div className="rhyme-lock-container">
              <div className="rhyme-lock-button">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn" onClick={lockSuggestion}>
                    <img className="button-icons" src={locked} alt="lock" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="suggestions sug-2" ref={s2aSuggestions2Ref}>
            <div className="custom-rhyme" ref={s2aCustomRhymeRef}>
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <p className="transcript-line-4">{lock}</p>
              </div>
              <div className="custom-rhyme-title" style={{ color: '#f9f9bb' }}>
                Locked Rhyme Suggestions
              </div>
            </div>
            <div className="rhyme-lock-container" ref={s2aRhymeLockRef}>
              <div className="rhyme-lock-button">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn" onClick={clearLockSuggestions}>
                    <img className="button-icons" src={xExit} alt="clear locked suggestions" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-2b_flow-controls" ref={saveOutRef1}>
          <div className="flow-controls-container">
            <div className="flow-controls-1_playback-display" ref={saveOutRef2}>
              <div className="play-btn-container">
                <div className="play-btn-container_shadow-div-outset">
                  <div className="play-btn-container_shadow-div-inset">
                    {isPlaying ? (
                      <button
                        className="play-btn_shadow-div-outset play"
                        aria-label="Pause"
                        onClick={() => setIsPlaying(false)}
                      >
                        <img
                          className="button-icons bi-pause"
                          id="play-stop-img"
                          src={pause}
                          alt="pause icon"
                        />
                      </button>
                    ) : (
                      <button
                        className="play-btn_shadow-div-outset pause"
                        aria-label="Play"
                        onClick={() => setIsPlaying(true)}
                      >
                        <img
                          className="button-icons bi-play"
                          id="play-stop-img"
                          src={play}
                          alt="play icon"
                        />
                      </button>
                    )}
                    <audio ref={takeAudioRef} src={audioSrc} />
                  </div>
                </div>
              </div>

              <div className="play-slider-container">
                <div className="play-slider-container_shadow-div-outset">
                  <div className="play-slider-container_shadow-div-inset">
                    <div className="play-slider_shadow-div-outset">
                      <div className="play-slider_shadow-div-inset">
                        <input
                          className="dur-onset progress"
                          type="range"
                          value={trackProgress}
                          step="1"
                          min="0"
                          max={duration ? duration : `${duration}`}
                          onChange={e => onScrub(e.target.value)}
                          onMouseUp={onScrubEnd}
                          onKeyUp={onScrubEnd}
                          style={{ background: trackStyling }}
                        ></input>
                        <div className="time-text-container">
                          <div className="time-text-start">{trackProgress}</div>
                          <div className="time-text-end">{audioRef.current.duration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flow-controls-2_actions" ref={saveOutRef3}>
              <div className="actions-container_shadow-div-outset" ref={saveOutRef4}>
                <div className="actions-container_shadow-div-inset" ref={saveOutRef5}>
                  <div className="actions-1_flow-takes" ref={saveOutRef6}>
                    <div className="flow-takes-1_select-takes" ref={saveOutRef7}>
                      <div className="select-takes-container_shadow-div-outset">
                        <div className="select-takes-container" ref={saveOutRef11}>
                          <div className="select-takes_shadow-div-inset" ref={saveOutRef8}>
                            <select
                              id="takes"
                              className="select-takes_shadow-div-outset"
                              value={selectedOption}
                              ref={selectTakesRef}
                              onChange={e => loadTake(e)}
                            >
                              {chooseTake()}
                            </select>
                          </div>
                          <div className="select-takes-title">{user.userName}'s Takes</div>
                        </div>

                        <div className="edit-takes-container_shadow-div-inset" ref={saveOutRef10}>
                          <div className="edit-takes-btn_shadow-div-outset">
                            <img className="button-icons" src={edit} alt="edit" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flow-takes-2_takes-actions" ref={saveOutRef9}>
                      <div className="takes-actions-container">
                        <div className="actions-btn-container">
                          {/* onClick={saveFile} */}
                          <div
                            className="actions-btn_shadow-div-outset"
                            onClick={toggleSaveSongMenu}
                          >
                            <img className="button-icons bi-help" src={save} alt="save icon" />
                          </div>
                        </div>
                        <div className="actions-btn-container">
                          <div className="actions-btn_shadow-div-outset" onClick={deleteOneTake}>
                            <img className="button-icons" src={xExit} alt="delete bin icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {saveSongDisplay()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavBar />
      </div>
      {recordings}
    </div>
  )
}
export default TestAudio

// <div className="selected-container" onClick={modalPopup}>
//   <div>
//     <img className="button-icons" src={help} alt="help icon" />
//   </div>
// </div>
