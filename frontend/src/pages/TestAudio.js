import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { v4 as uuidv4 } from "uuid";
import datamuse from "datamuse";
import TheContext from "../TheContext";
import AudioTimeSlider from "../components/AudioTimeSlider";
import RecordingBoothModal from "../components/RecordingBoothModal";
import useDebugInformation from "../utils/useDebugInformation"
import useEventListener from "../utils/useEventListener"
import useRefilterProfanity from "../utils/useRefilterProfanity"
import useBeats from '../utils/useBeats'
import actions from "../api";
import NavBar from "../components/NavBar";
import mic from "../images/modern-mic.svg";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import stop from "../images/stop.svg";
import xExit from "../images/exit-x-2.svg";
import save from "../images/save-disk.svg";
import locked from "../images/locked.svg";
import shuffle from "../images/shuffle.svg";
import modal from "../images/modal.svg";

function TestAudio(props) {
  const { user, windowSize } = React.useContext(TheContext)
  
  useDebugInformation("TestAudio", props)
  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('TestAudio').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('TestAudio').style.height = `${onChange}px`
    }
  })
  
  const { refilterProfanity } = useRefilterProfanity()
  const { 
    beatOption, isBeatPlaying,
    mapBeatOptions, selectBeatOption,
    playSelectBeat
  } = useBeats()

  const commands = [
    {
      command: /\b(\w(\S{4,}))/g, 
      callback: (command) => getActionWords(command),
      matchInterim: true,
    }
  ]

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const initialState = {
    recordingMinutes: 0,
    recordingSeconds: 0,
    initRecording: false,
    mediaStream: null,
    mediaRecorder: null,
    audio: null,
  }
  const [recorderState, setRecorderState] = useState(initialState);
  const [audioSrc, setAudioSrc] = useState(null);

  const [silent, setSilent] = useState(false);
  const [saveSongMenu, setSaveSongMenu] = useState(false);
  const [recordingDisplay, setRecordingDisplay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allTakes, setAllTakes] = useState([]);
  const [songUploadObject, setSongUploadObject] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [songNameUpdate, setSongNameUpdate] = useState();
  const [songNameInput, setSongNameInput] = useState();
  const [songCaptionInput, setSongCaptionInput] = useState();
  const [lyricsArr, setLyricsArr] = useState([]);
  const [rhymeWordHolder, setRhymeWordHolder] = useState("");
  const [lockRhymeHolder, setLockRhymeHolder] = useState();
  const [retrievedRhymes, setRetrievedRhymes] = useState([]);
  const [retrievedSelectedRhymes, setRetrievedSelectedRhymes] = useState([]);
  const [retrievedActionRhymes, setRetrievedActionRhymes] = useState([]);
  const [selectedRhymeNo, setSelectedRhymeNo] = useState(5);
  const [selectedWordHolder, setSelectedWordHolder] = useState();
  const [topRhymes, setTopRhymes] = useState([]);
  const [lockedRhymes, setLockedRhymes] = useState([]);
  const [selectedRhymes, setSelectedRhymes] = useState([]);
  const [loadSelectedTake, setLoadSelectedTake] = useState();
  const [showLyricsLine, setShowLyricsLine] = useState([]);
  const [blobData, setBlobData] = useState({})
  const [dateBefore, setDateBefore] = useState();
  const [dateAfter, setDateAfter] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [focusBorder, setFocusBorder] = useState(null)

  const modalBtnRef = useRef();
  const playBeatRef = useRef();
  const recordAudioRef = useRef();
  const scrollRef = useRef();
  const saveSongPopUpRef = useRef();
  const songNameInputRef = useRef();
  const songCaptionInputRef = useRef();
  const buttonCloseRef = useRef();
  const selectTakesRef = useRef();
  const keyRef = useRef(0);
  const barNumberRef = useRef(1)
  const [recordingBooth] = useState(`#363636`);

  const songObject = {
    songName: '',
    songUser: user,
    songBlob: null,
    songURL: null,
    songLyricsStr: [],
    songDate: null,
    songDuration: 0,
    songCaption: '',
    songBg: null
  }

  class SongData {
    constructor(songName, songBlob, songURL, lyrics, date, songDuration) {
      this.songName = songName;
      this.songBlob = songBlob;
      this.songURL = songURL;
      this.songLyricsStr = lyrics;
      this.songDate = date;
      this.songDuration = songDuration
      this.songUser = user;
      this.songCaption = null;
      this.songBG = null;
    }
  }

  useEffect(() => {
    if (silent && recorderState.initRecording === true) {
      setRetrievedActionRhymes([])
      getDatamuseRhymes()
      setLyricsHandler()
    }
  }, [silent])

  useEffect(() => {
    if (Object.keys(blobData).length !== 0) {
      const songDate = new Date();
      const songDuration = (dateAfter - dateBefore) - 200;
      const songObject = new SongData(blobData.songName, blobData.songBlob, blobData.songURL, [...lyricsArr], songDate, songDuration)
      setAudioSrc(songObject.songURL)
      setSelectedOption(songObject.songURL)
      setSongUploadObject(songObject)
      setAllTakes(eachTake => [...eachTake, {...songObject}])
      setBlobData({})
    }
    console.log('Check out the updated AllTakes: ', allTakes)
  }, [blobData])

  useEffect(() => {
    setRetrievedSelectedRhymes([])
    if (selectedWordHolder !== undefined) {
      datamuse.request(`words?rel_rhy=${selectedWordHolder}&max=20`)
        .then((res) => {
          if (res.length !== 0) {
            res.forEach((each) => {
              setRetrievedSelectedRhymes(oldRhymes => [...oldRhymes, each.word])
            })
          }
        })
        .catch(console.error)
    }
  }, [selectedWordHolder])

  useEffect(() => {
    if (recorderState.mediaStream) {
      setRecorderState((prevState) => {
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream)
        }
      })
    }
  }, [recorderState.mediaStream])

  useEffect(() => {
    const recorder = recorderState.mediaRecorder
    let chunks = []

    if (recorder && recorder.state === "inactive") {
      recorder.start()
      setDateBefore(Date.now())

      recorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }
      
      recorder.onstop = () => {
        setDateAfter(Date.now())
        const mpegBlob = new Blob(chunks, { type: "audio/mpeg-3" });
        const url = window.URL.createObjectURL(mpegBlob);
        keyRef.current++
        setBlobData({ songName: `Take ${keyRef.current}`, songBlob: mpegBlob, songURL: url })
        chunks = []
  
        setRecorderState((prevState) => {
          if (prevState.mediaRecorder) {
            return {
              ...initialState,
              audio: url
            }
          }
          else {
            return initialState
          }
        })
      }
    }

    return () => {
      if (recorder) {
        recorder.stream.getAudioTracks().forEach((track) => track.stop())
      }
    }
  }, [recorderState.mediaRecorder])

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
        <p className="each-action-word" key={`${uuidv4()}action${index}`}>{each}</p>
      )
    })
  }, [retrievedActionRhymes])

  const autoScroll = () => {
    let scrollLyrics = document.getElementById('currentTranscript')
    scrollLyrics.scrollTop = scrollLyrics.scrollHeight
  }

  // const profanityRefilter = (curse) => {
  //   let regexp = /\b\w\**(\*)/gm
  //   let curseWord = curse.match(regexp)

  //   if (curseWord[0].charAt(0) === "f") {
  //     if (curseWord[0].length === 4) {
  //       return "fuck"
  //     } else if (curseWord[0].length === 7) {
  //       return "fucking"
  //     } else {
  //       return "fucked"
  //     }
  //   } else if (curseWord[0].charAt(0) === "b") {
  //     if (curseWord[0].length === 5) {
  //       return "bitch"
  //     } else {
  //       return "bitches"
  //     }
  //   } else if (curseWord[0].charAt(0) === "c") {
  //     if (curseWord[0].length === 4) {
  //       return "cunt"
  //     } else {
  //       return "cunts"
  //     }
  //   } else if (curseWord[0].charAt(0) === "p") {
  //     return "pussy"
  //   } else if (curseWord[0].charAt(0) === "a") {
  //     return "asshole"
  //   } else if (curseWord[0].charAt(0) === "s") {
  //     return "shit"
  //   } else if (curseWord[0].charAt(0) === "n") {
  //     if (curseWord[0].length === 6) {
  //       return "niggas"
  //     } else if (curseWord[0].length === 7) {
  //       return "niggas"
  //     }
  //   }
  // }

  async function getActionWords(regex) {
    let finalWord = regex
    if (regex.includes("*")) {
      // finalWord = profanityRefilter(regex)
      finalWord = refilterProfanity(regex)
    }

    const getData = await datamuse.request(`words?rel_trg=${finalWord}&max=20`)
      .then((res) => {
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
    console.log(retrievedActionRhymes, "RETRIEVED ACTIONS VERBS")
  }

  async function getDatamuseRhymes() {
    let splitScript = transcript.split(" ")

    if (splitScript[0] !== "") {
      let lastWord = splitScript[splitScript.length - 1]
      let finalWord = lastWord

      if (lastWord.includes("'")) {
        finalWord = lastWord.split("'").join('')
      }
      if (lastWord.includes("*")) {
        finalWord = refilterProfanity(lastWord)
        // finalWord = profanityRefilter(lastWord)
      }

      setRhymeWordHolder(finalWord)
      setRetrievedRhymes([])
      console.log(finalWord, " - this is the last word")

      const getData = await datamuse.request(`words?rel_rhy=${finalWord}&max=30`)
        .then((res) => {
          console.log(res, "I'm gonna need to see what I'm working with here")
          if (res.length !== 0) {
            res.forEach((each) => {
              setRetrievedRhymes(oldRhymes => [...oldRhymes, each.word])
            })
          }
        })
        .catch(console.error)
    }
  }

  const setLyricsHandler = () => {
    const splitTranscript = transcript.split(" ")
    const filterTranscript = splitTranscript.filter(each => each.length > 0)
    if (filterTranscript.length !== 0) {
      setLyricsArr(oldArr => [...oldArr, filterTranscript])
      setShowLyricsLine(oldLine => [...oldLine, createLyricLine(filterTranscript)])
    }
    resetTranscript()
    autoScroll()
  }

  const createLyricLine = (transcript) => {
    return (
      <div className="prev-transcript-container">
        <div className="transcript-bar-no">
          {`${barNumberRef.current++}`}
        </div>
        <div className="transcript-word-container">
          {transcript.map((each, index) => {
            return (
              <p 
                className="prev-transcript-word" 
                key={`transcript${uuidv4()}and${index}`}
                onClick={(e) => showSelectedWord(e)}
                >
                  {each}
              </p>
            )
          })}
        </div>
      </div>
    )
  }

  const displayTakeLyrics = useCallback(() => {
    if (allTakes.length === 0) {
      return <p className="no-takes-msg">Start flowing to see your lyrics!</p>
    } else {
      return (
        <>
          {loadSelectedTake?.songLyricsStr.map((row, index) => {
            return (
              <div className="prev-transcript-container" key={`${uuidv4()}_${row}_${index}`}>
                <div className="transcript-bar-no">
                  {`${index + 1}`}
                </div>
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
  }, [allTakes, loadSelectedTake])

  const showRhymes = (array) => {
    if (array?.length >= selectedRhymeNo) {
      return array.slice(0, selectedRhymeNo).map((each, index) => {
        if (index === selectedRhymeNo - 1) {
          return <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>{each}</p>
        } else {
          return <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>{each}{' '}{'\u2022'}</p>
        }
      })
    } else {
      return array?.map((each, index) => {
        if (index === array.length - 1) {
          return <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>{each}</p>
        } else {
          return <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>{each}{' '}{'\u2022'}</p>
        }
      })
    }
  }

  const showRhymeWord = (holder) => {
    let uppercasedWord = holder.charAt(0).toUpperCase() + holder.slice(1)
    return uppercasedWord
  }
  
  const showSelectedWord = (e) => {
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
      if (theState === "topRhymes") {
        setRetrievedRhymes(randomRhymeArr)
      }
      else {
        setRetrievedSelectedRhymes(randomRhymeArr)
      }
    }
  }

  const lockSuggestion = () => {
    if (retrievedRhymes) {
      setLockRhymeHolder(rhymeWordHolder)
      const copyRhyme = [...retrievedRhymes];
      setLockedRhymes(copyRhyme);
    }
  };

  let myReq; //animation frame ID
  const detectSilence = (stream, silence_delay = 50, min_decibels = -80) => {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const streamNode = ctx.createMediaStreamSource(stream);
    streamNode.connect(analyser)
    analyser.minDecibels = min_decibels
    const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
    let silence_start = performance.now();
    let triggered = false; // trigger only once per silence event

    const loop = (time) => {
      myReq = requestAnimationFrame(loop);
       // we'll loop every 60th of a second to check
      analyser.getByteFrequencyData(data); // get current data
      if (data.some((v) => v)) {
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
    setLyricsArr([])
    setShowLyricsLine([])
    setRhymeWordHolder(null)
    setLockRhymeHolder(null)
    setSelectedWordHolder(null)
    setRetrievedRhymes([])
    setLockedRhymes([])
    setSelectedRhymes([])
    resetTranscript()
    barNumberRef.current = 1
  }

  async function startRecording() {
    try {
      resetSuggestions()
      const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true })
      SpeechRecognition.startListening({ continuous: true });

      var audio = document.getElementById("song").captureStream();
      document.getElementById("song").play();

      detectSilence(stream1)

      const audioContext = new AudioContext();
      let audioIn_01 = audioContext.createMediaStreamSource(stream1)
      let audioIn_02 = audioContext.createMediaStreamSource(audio)
      let dest = audioContext.createMediaStreamDestination()

      audioIn_01.connect(dest)
      audioIn_02.connect(dest)

      setRecorderState((prevState) => {
        return {
          ...prevState,
          initRecording: true,
          mediaStream: dest.stream,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const stopRecording = () => {
    if (recorderState.mediaRecorder !== null) {
      if (recorderState.mediaRecorder.state !== "inactive") {
        SpeechRecognition.stopListening();
        recorderState.mediaRecorder.stop()
        recordAudioRef.current.pause();
        recordAudioRef.current.currentTime = 0;
        setLyricsHandler()
        setRecorderState((prevState) => {
          return {
            ...prevState,
            initRecording: false,
          }
        })
      }
    }
  }

  const handlePlayPause = (bool) => {
    if ((allTakes.length !== 0)) {
      if (bool === true) {
        setIsPlaying(true)
      }
      else {
        setIsPlaying(false)
      }
    }
  }

  const loadTake = (e) => {
    console.log('allTakes index log:', allTakes[e.target.selectedIndex])
    setSelectedOption(e.target.value)
    setLoadSelectedTake(allTakes[e.target.selectedIndex])
    setAudioSrc(e.target.value)
    setSongUploadObject(allTakes[e.target.selectedIndex])
    setRecordingDisplay(false)
  };

  const chooseTake = useCallback(() => {
    if (allTakes.length === 0) {
      return <option>Your Takes</option>
    } 
    else {
      return allTakes.map((element, index) => {
        return (
          <option value={element.songURL} key={`${index}_${element.songURL}`}>
            {element.songName}
          </option>
        )
      })
    }
  }, [allTakes, songNameUpdate])

  const deleteOneTake = () => {
    setAllTakes(eachTake => eachTake.filter(item => item.songURL !== selectedOption))
  }

  const handleSaveSong = (e) => {
    e.preventDefault()
    if (allTakes.length === 0) {
      console.log('You have no Flows to save')
    } else {
      const fileName = songUploadObject.songUser._id + songNameInput.replaceAll(" ", "-")
      songUploadObject.songName = songNameInput
      songUploadObject.songCaption = songCaptionInput
      songUploadObject.songDate = new Date()

      actions
        .uploadFile(
          {
            fileName: fileName,
            fileType: 'audio/mpeg-3',
            file: songUploadObject.songURL,
            kind: 'song',
          },
          songUploadObject,
        )
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    }
    setSaveSongMenu(false)
    setSongNameUpdate(songUploadObject.songName)
    songNameInputRef.current.value =  ""
    songCaptionInputRef.current.value =  ""
  }

  const toggleSaveSongMenu = () => {
    if (saveSongMenu === false) {
      setSaveSongMenu(true)
    } else {
      setSaveSongMenu(false)
    }
  }
  
  const saveSongDisplay = () => {
    if (saveSongMenu === true) {
      return (
        <div className="SaveSongDisplay" ref={saveSongPopUpRef}>
          <form className="song-inputs-container" onSubmit={(e) => handleSaveSong(e)}>
            <div className="section-title">
              Upload A Take
            </div>

            <div className="section-1_song-name">
              <input
                className="song-name-input"
                ref={songNameInputRef}
                type="text"
                placeholder="Name this flow.."
                onChange={(e) => setSongNameInput(e.target.value)}
                autoFocus
                />
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
              <div className={`select-beat_shadow-div-inset ${focusBorder === 10 ? "focus-border" : ""}`}>
                <div className="select-beat_play-container">
                  <button 
                    className="select-beat_play-btn"
                    onClick={() => playSelectBeat(playBeatRef)}
                    >
                    <img className="button-icons" src={isBeatPlaying ? pause : play} alt="play or pause" />
                  </button>
                  <audio src={beatOption} ref={playBeatRef} />
                </div>
                <div className="select-beat_shadow-div-outset">
                  <div className="select-beat-title">
                    Select A Beat :
                  </div>
                  <select 
                    id="selectBox" 
                    className="track-select" 
                    value={beatOption} 
                    onChange={(e) => selectBeatOption(e)}
                  >
                    {mapBeatOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div id="TestAudio" className="TestAudio">
      <RecordingBoothModal 
       toggleModal={toggleModal} 
       setToggleModal={setToggleModal}
       modalBtnRef={modalBtnRef}
       focusBorder={focusBorder}
       setFocusBorder={setFocusBorder}
      />
      <audio id="song" src={beatOption} loop={true} ref={recordAudioRef}></audio>
      <div className="section-1_speech">
        <button 
          className="modal-toggle-btn"
          ref={modalBtnRef} 
          onClick={() => toggleModalHandler()}
        >
          <img className="button-icons" src={modal} alt="modal" />
        </button>

        <div className={`scroll-rhymes-container ${focusBorder === 31 ? "focus-border" : ""}`} id="currentTranscript" ref={scrollRef}>
          {recordingDisplay ? showLyricsLine : displayTakeLyrics()}
        </div>
        <div className={`scroll-rhymes-line ${focusBorder === 30 ? "focus-border" : ""}`}>
          <p className="transcript-line-2">{transcript}</p>
        </div>
      </div>
      
      <div className={saveSongMenu ? "section-2_control-panel save-menu-active" : "section-2_control-panel"}>
        <div className="section-2a_flow-suggestions">
          <div className="next-bar-container">
            <div className="action-word-container">
              {(retrievedActionRhymes && recordingDisplay) ? displayActionWords() : <p className="initial-prompt" style={{color: '#464646', fontSize: '12px'}}>Suggestions for your next bar will be here.</p>}
            </div>
          </div>

          <div className={`suggestions ${focusBorder === 20 ? "focus-border" : ""}`}>
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset">
                {(rhymeWordHolder && recordingDisplay) ? <p className="top-word-holder">{showRhymeWord(rhymeWordHolder)}</p> : <p>Top Rhymes</p>}
              </div>
              <div className="custom-rhyme-inner">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {(rhymeWordHolder && recordingDisplay) ? showRhymes(retrievedRhymes) : <p className="initial-prompt">Start recording to see your top rhymes.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="rhyme-lock-container">
              <div className="rhyme-lock-button">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn" onClick={() => shuffleRhymeHandler(retrievedRhymes, "topRhymes")}>
                    <img className="button-icons" src={shuffle} alt="shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`suggestions ${focusBorder === 21 ? "focus-border" : ""}`}>
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset rw-two">
                  {(lockRhymeHolder && recordingDisplay) ? <p className="locked-word-holder">{showRhymeWord(lockRhymeHolder)}</p> : <p>Locked Rhymes</p>}
                </div>
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {(lockRhymeHolder && recordingDisplay) ? showRhymes(lockedRhymes) : <p className="initial-prompt">Click lock button above to save top rhymes here.</p>}
                  </div>
                </div>
              </div>

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

          <div className={`suggestions ${focusBorder === 22 ? "focus-border" : ""}`}>
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset rw-three">
                {(selectedWordHolder && recordingDisplay) ? <p className="selected-word-holder">{selectedWordHolder}</p> : <p>Selected Rhymes</p>}
              </div>
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {(selectedWordHolder && recordingDisplay) ? showRhymes(retrievedSelectedRhymes) : <p className="initial-prompt">Click any flowed lyric to generate rhymes here.</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="rhyme-lock-container">
              <div className="rhyme-lock-button">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn" onClick={() => shuffleRhymeHandler(retrievedSelectedRhymes, "selectedRhymes")}>
                    <img className="button-icons" src={shuffle} alt="shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="suggestion-button-container">
            <div className="rhyme-lock-container">
              <div className="rhyme-lock-button rlb-1">
                <div className="rhyme-lock-outset">
                  <select 
                    className="rhyme-lock-btn select-no" 
                    value={selectedRhymeNo}
                    onChange={(e) => setSelectedRhymeNo(e.target.value)}
                    >
                      {rhymeOptionNoHandler()}
                  </select>
                </div>
              </div>
 
              <div className="rhyme-lock-button rlb-3">
                <div className="rhyme-lock-outset">
                  <Link 
                    to="/recordingBooth/editLyrics" 
                    state={{ propSongTakes: allTakes, propCurrentSong: songUploadObject}} 
                    className="rhyme-lock-btn"
                  >
                    Edit Lyrics
                  </Link>
                </div>
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
                          src={pause}
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
                        src={play}
                        alt="play icon"
                      />
                    </button>
                    )
                  }
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
                        currentSong={songUploadObject}
                        location={recordingBooth}
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
                            <select 
                              id="takes" 
                              className="select-takes_shadow-div-outset" 
                              value={selectedOption}
                              ref={selectTakesRef}
                              onChange={(e) => loadTake(e)}
                            >
                              {chooseTake()}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flow-takes-2_takes-actions">
                      <div className="takes-actions-container">
                        <div className={`actions-btn-container ${focusBorder === 12 ? "focus-border" : ""}`}>
                          <div 
                            className="actions-btn_shadow-div-outset ab-save" 
                            onClick={toggleSaveSongMenu}>
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

          <div className={`record-2_record-btn ${saveSongMenu ? "slideOut" : "slideIn"}`}>
            <div className={`record-btn_shadow-div-inset ${focusBorder === 11 ? "focus-border" : ""}`}>
              {recorderState.initRecording ? (
                <button
                  className="record-btn_shadow-div-outset"
                  onClick={stopRecording}
                >
                  <img
                    className="button-icons"
                    id="record-stop-img"
                    src={stop}
                    alt="record stop icon"
                    />
                </button>
              ) : (
                <button
                  className="record-btn_shadow-div-outset"
                  onClick={startRecording}
                >
                  <img
                    className="button-icons"
                    id="record-stop-img"
                    src={mic}
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
  )
}
export default TestAudio;