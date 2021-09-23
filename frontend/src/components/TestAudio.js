import React, { useRef, useState, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { v4 as uuidv4 } from "uuid";
import datamuse from "datamuse";
import TheContext from "../TheContext";
import UseAudioPlayer from "./UseAudioPlayer";
import actions from "../api";
import NavBar from "./NavBar";
import Modal from "./ModalMenu";
import beat1 from "../assets/beatsTrack1.m4a";
import beat2 from "../assets/beatsTrack2.m4a";
import beat3 from "../assets/beatsTrack3.m4a";
import beat4 from "../assets/beatsTrack4.m4a";
import beat5 from "../assets/beatsTrack5.m4a";
import mic from "../images/modern-mic.svg";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import stop from "../images/stop.svg";
import xExit from "../images/exit-x-2.svg";
import save from "../images/save-disk.svg";
import locked from "../images/locked.svg";
import edit from "../images/edit.svg";
import shuffle from "../images/shuffle.svg";
import send from "../images/send.svg";
import help from "../images/help2.svg";

function TestAudio(props) {
  const { user } = React.useContext(TheContext)

  const [tracks, setTracks] = useState([
    { song: beat1, name: "After Dark" },
    { song: beat2, name: "Futurology" },
    { song: beat3, name: "Peacock" },
    { song: beat4, name: "Callback" },
    { song: beat5, name: "Drained" },
  ]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const [audioSrc, setAudioSrc] = useState(null);
  const [silent, setSilent] = useState(false);
  const [saveSongMenu, setSaveSongMenu] = useState(false);
  const [recordingDisplay, setRecordingDisplay] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lock, setLock] = useState([]);
  const [allTakes, setAllTakes] = useState([]);
  const [songUploadObject, setSongUploadObject] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [songNameUpdate, setSongNameUpdate] = useState();
  const [songNameInput, setSongNameInput] = useState();
  const [songCaptionInput, setSongCaptionInput] = useState();
  const [lyricsArr, setLyricsArr] = useState([]);
  const [lastWordHolder, setLastWordHolder] = useState("");
  const [retrievedRhymes, setRetrievedRhymes] = useState([]);
  const [retrievedSelectedRhymes, setRetrievedSelectedRhymes] = useState([]);
  const [selectedRhymeNo, setSelectedRhymeNo] = useState(5);
  const [selectedWord, setSelectedWord] = useState();
  const [topRhymes, setTopRhymes] = useState();
  const [selectedRhymes, setSelectedRhymes] = useState([]);
  const [loadSelectedTake, setLoadSelectedTake] = useState();
  const [showLyricsLine, setShowLyricsLine] = useState([]);
  const [blobData, setBlobData] = useState({})
  const [dateBefore, setDateBefore] = useState();
  const [dateAfter, setDateAfter] = useState();

  const recordAudioRef = useRef();
  const scrollRef = useRef();
  const saveSongPopUpRef = useRef();
  const songNameInputRef = useRef();
  const songCaptionInputRef = useRef();
  const buttonCloseRef = useRef();
  const selectTakesRef = useRef();
  const keyRef = useRef(0);
  const barNoRef = useRef(0)

  class SongData {
    constructor(name, blobFile, songmix, lyrics, date, songDuration) {
      this.name = name;
      this.blobFile = blobFile;
      this.songmix = songmix;
      this.lyrics = lyrics;
      this.date = date;
      this.songDuration = songDuration
      this.user = user;
      this.songName = null;
      this.songCaption = null;
      this.background = null;
    }
  }

  useEffect(() => {
    if (silent) {
      setRetrievedActionRhymes([])
      const splitTranscript = transcript.split(" ")
      const filterTranscript = splitTranscript.filter(each => each.length > 0)
      getDatamuseRhymes()
      if (filterTranscript.length !== 0) {
        setLyricsArr(oldArr => [...oldArr, filterTranscript])
        setShowLyricsLine(oldLine => [...oldLine, createLyricLine(filterTranscript)])
      }
      resetTranscript()
      autoScroll()
    }
  }, [silent])

  useEffect(() => {
    if (Object.keys(blobData).length !== 0) {
      const songDuration = (dateAfter - dateBefore) - 200
      pushRecordTake(blobData.name, blobData.blob, blobData.url, songDuration)
      setBlobData({})
    }
    console.log('Check out the updated AllTakes: ', allTakes)
  }, [blobData])
  
  useEffect(() => {
    if (isRecording) {
      console.log("RECORDING STAAAAAAAAAAARRRRTTTTTTTTTTTED")
      setRecordingDisplay(true)
      setLyricsArr([])
      setShowLyricsLine([])
      recordAudio();
    } 
    else {
      console.log("STOPPED REEEECCCCOOOORRRRDDDDDDDDIIING")
      setSilent(true)
      stopRecording();
    }
  }, [isRecording])

  useEffect(() => {
    setRetrievedSelectedRhymes([])
    let selectedHolder = []

    if (selectedWord !== undefined) {
      datamuse.request(`words?rel_rhy=${selectedWord}&max=20`)
        .then((res) => {
          if (res.length !== 0) {
            res.forEach((each) => {
              setRetrievedSelectedRhymes(oldRhymes => [...oldRhymes, each.word])
            })
            for (let i = 1; i <= selectedRhymeNo; i++) {
              selectedHolder.push(res[i].word)
            }
            if (selectedHolder.length !== 0) {
              setSelectedRhymes(selectedHolder)
            }
          }
        })
    }
  }, [selectedWord])

  const [retrievedActionRhymes, setRetrievedActionRhymes] = useState([]);

  useEffect(() => {
    let regex = /\w(?:\w*?)(ing)|\w(?:\w*?)(ed)/gm
    let getVerbs = regex.exec(transcript)
    console.log(transcript, 'this changes A LOT')
    if (getVerbs) {
      datamuse.request(`words?rel_rhy=${getVerbs[0]}&max=10`)
      .then((res) => {
        if (res.length !== 0) {
          for (let i = 0; i < 1; i++) {
            if (!retrievedActionRhymes.includes(res[0].word)) {
              setRetrievedActionRhymes(oldRhymes => [...oldRhymes, res[Math.floor(Math.random() * 9)].word])
            }
          }
          // for (let i = 1; i <= selectedRhymeNo; i++) {
          //   selectedHolder.push(res[i].word)
          // }
          // if (selectedHolder.length !== 0) {
          //   setSelectedRhymes(selectedHolder)
          // }
        }
      })
    }
    console.log(retrievedActionRhymes, "WOOWESEWEEEEE")
  }, [transcript])

  useEffect(() => {
    setSelectedRhymes([...retrievedSelectedRhymes].slice(0, selectedRhymeNo))
  }, [retrievedSelectedRhymes, selectedRhymeNo])
  
  useEffect(() => {
      let rhymeStr = transcript.split(" ")[transcript.split(" ").length - 1]
      let uppercasedStr = rhymeStr.charAt(0).toUpperCase() + rhymeStr.slice(1)
      setLastWordHolder(uppercasedStr)
  }, [topRhymes, lastWordHolder])

  useEffect(() => {
    if (!isRecording)
    barNoRef.current = 1
  }, [isRecording])

  const autoScroll = () => {
    let scrollLyrics = document.getElementById('currentTranscript')
    scrollLyrics.scrollTop = scrollLyrics.scrollHeight
  }

  async function getDatamuseRhymes() {
    const lastWord = transcript.split(" ")[transcript.split(" ").length - 1]
    console.log("this should never be empty: ", lastWord)
    let retrievedRhymesHolder = []

    const getData = await datamuse.request(`words?rel_rhy=${lastWord}&max=20`)
      .then((res) => {
        setRetrievedRhymes([])
        if (res.length !== 0) {
          res.forEach((each) => {
            setRetrievedRhymes(oldRhymes => [...oldRhymes, each.word])
          })
          for (let i = 1; i <= selectedRhymeNo; i++) {
            if (res[i].word !== undefined) {
              retrievedRhymesHolder.push(res[i].word)
            }
          }
          if (retrievedRhymesHolder.length !== 0) {
            setTopRhymes(retrievedRhymesHolder)
          }
        }
      })
  }

  const createLyricLine = (transcript) => {
    return (
      <div className="prev-transcript-container">
        <div className="transcript-bar-no">
          {`${barNoRef.current++}`}
        </div>
        <div className="transcript-word-container">
          {transcript.map((each, index) => {
            return (
              <p 
                className="prev-transcript-word" 
                key={`transcript${uuidv4()}and${index}`}
                onClick={(e) => setSelectedWordHandler(e)}
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
    }
    else {
      return (
        <>
          {loadSelectedTake?.lyrics.map((row, index) => {
            return (
              <div className="prev-transcript-container" key={`${uuidv4()}_${index}`}>
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

  const showTopRhymes = () => {
    return topRhymes.map((each, index) => {
      return <p className="each-top-rhyme" key={`${uuidv4()}toprhymes${index}`}>{each}</p>
    })
  }
  const showSelectedRhymes = () => {
    return selectedRhymes.map((each, index) => {
      return <p className="each-selected-rhyme" key={`${uuidv4()}selectedrhymes${index}`}>{each}</p>
    })
  }
  const showLockedRhymes = () => {
    return lock.map((each, index) => {
      return <p className="each-locked-rhyme" key={`${uuidv4()}lockedrhymes${index}`}>{each}</p>
    })
  }

  const setSelectedWordHandler = (e) => {
    let selectStr = e.target.innerText
    let uppercasedStr = selectStr.charAt(0).toUpperCase() + selectStr.slice(1)
    console.log(uppercasedStr)
    setSelectedWord(uppercasedStr)
  }

  const changeRhymeNo = (e) => {
    setSelectedRhymeNo(e.target.value)
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
    console.log(selectedRhymes, retrievedSelectedRhymes)
    let randomRhymeArr = []
    for (let i = 1; i <= selectedRhymeNo; i++) {
      randomRhymeArr.push(array[Math.floor(Math.random() * 20)])
    }
    if (theState === "topRhymes") {
      setTopRhymes(randomRhymeArr)
    }
    else {
      setSelectedRhymes(randomRhymeArr)
    }
  }

  const lockSuggestion = () => {
    if (topRhymes) {
      setIsLocked(true)
      const copyRhyme = [...topRhymes];
      setLock(copyRhyme);
    }
  };

  const loadTrack = () => {
    if (!isRecording) {
      let selectBox = document.getElementById("selectBox");
      let selectedValue = selectBox.options[selectBox.selectedIndex].value;
      document.getElementById("song").src = selectedValue;      
    }
  };

  const chooseTrack = () => {
    return tracks.map((element, index) => {
      return <option key={`${element}_${index}`} value={element.song}>{element.name} </option>;
    });
  };
  
  let myReq; //animation frame ID
  
  const recordAudio = () => {
    const detectSilence = (
      stream,
      onSoundEnd = _ => {},
      onSoundStart = _ => {},
      silence_delay = 50,
      min_decibels = -80
    ) => {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const streamNode = ctx.createMediaStreamSource(stream);

      streamNode.connect(analyser)
      analyser.minDecibels = min_decibels

      const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
      let silence_start = performance.now();
      let triggered = false; // trigger only once per silence event
      
      const loop = (time) => {
        myReq = requestAnimationFrame(loop); // we'll loop every 60th of a second to check
        analyser.getByteFrequencyData(data); // get current data

        if (data.some((v) => v)) {
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

    const onSilence = () => {
      console.log('silence')
      setSilent(true);
    }
    const onSpeak = () => {
      console.log('speaking');
      setSilent(false);
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(stream => {
        detectSilence(stream, onSilence, onSpeak)

        var audio = recordAudioRef.current.captureStream();
        document.getElementById("song").play();

        mergeStreams(stream, audio);
        SpeechRecognition.startListening({ continuous: true });

      })
      .catch(console.error);

  }

  const mergeStreams = (stream1, stream2) => {
    const audioContext = new AudioContext();

    let audioIn_01 = audioContext.createMediaStreamSource(stream1)
    let audioIn_02 = audioContext.createMediaStreamSource(stream2)

    let dest = audioContext.createMediaStreamDestination()

    audioIn_01.connect(dest)
    audioIn_02.connect(dest)

    const recorder = new MediaRecorder(dest.stream);

    recorder.start(); //console.log('started recording')
    setDateBefore(Date.now())
    let chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
      createBlob(chunks);
      // SpeechRecognition.stopListening();
      console.log('oooooo an event with tasty data!', event)
    };

    document.getElementById("fixer").onclick = () => {
      setDateAfter(Date.now())
      SpeechRecognition.stopListening();
      if (recorder.state === "active") {
        recorder.stop();
      }
      cancelAnimationFrame(myReq);
    };
  }

  const pushRecordTake = (name, blob, audioUrl, songDuration) => {
    const songDate = new Date()
    const songObject = new SongData(name, blob, audioUrl, [...lyricsArr], songDate, songDuration);
    setAudioSrc(songObject.songmix)
    setSelectedOption(songObject.songmix)
    setAllTakes(eachTake => [...eachTake, songObject])
  };

  const createBlob = (blob) => {
    let mpegBlob = new Blob(blob, { type: "audio/mpeg-3" });
    const url = window.URL.createObjectURL(mpegBlob);
    keyRef.current++
    setBlobData({ name: `Take ${keyRef.current}`, blob: mpegBlob, url: url })
  }

  const stopRecording = () => {
    document.getElementById("fixer").click();
    recordAudioRef.current.pause();
    recordAudioRef.current.currentTime = 0;
  };
 
  const handlePlayPause = (bool) => {
    if ((allTakes.length !== 0) && !isRecording) {
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
    } else {
      return allTakes.map((element, index) => {
        return (
          <option value={element.songmix} key={`${index}_${element.songmix}`}>
            {element.songName ? element.songName : element.name}
          </option>
        )
      })
    }
  }, [allTakes, songNameUpdate])

  const deleteOneTake = () => {
    setAllTakes(eachTake => eachTake.filter(item => item.songmix !== selectedOption))
  }

  const handleSaveSong = (e) => {
    e.preventDefault()
    if (allTakes.length === 0) {
      console.log('You have no Flows to save')
    } 
    else {
      const fileName = songUploadObject?.user?._id + songNameInput.replaceAll(" ", "-")
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
    songNameInputRef.current.value =  ""
    songCaptionInputRef.current.value =  ""
  }
  const slideOutMicRef = useRef();

  const toggleSaveSongMenu = () => {
    if (saveSongMenu === false) {
      setSaveSongMenu(true)
      slideOutMicRef.current.className = "record-2_record-btn slideOut"

    } 
    else {
      setSaveSongMenu(false)
      slideOutMicRef.current.className = "record-2_record-btn slideIn"

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
              <div className="select-beat_shadow-div-inset">
                <div className="select-beat_shadow-div-outset">
                  <div className="select-beat-title">
                    Select A Beat :
                  </div>
                  <select id="selectBox" className="track-select" onChange={() => loadTrack()}>
                    {chooseTrack()}
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
    <div className="TestAudio">
      <audio id="song" src={beat1} loop={true} ref={recordAudioRef}></audio>
      <p id="fixer"></p>

      <div className="section-1_speech">
        <div className="scroll-rhymes-container" id="currentTranscript" ref={scrollRef}>
          {recordingDisplay ? showLyricsLine : displayTakeLyrics()}
        </div>
        <div className="scroll-rhymes-line">
          <p className="transcript-line-2">{transcript}</p>
        </div>
      </div>

      <div className={saveSongMenu ? "section-2_control-panel save-menu-active" : "section-2_control-panel"}>
        <div className="section-2a_flow-suggestions">
          <div className="next-bar-container">
            <div className="custom-rhyme">
              <div className="custom-rhyme-inner">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    <p className="inital-prompt" style={{color: '#464646', fontSize: '12px'}}>Suggestions for your next bar will be here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="suggestions sug-1">
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset">
                {recordingDisplay ? <p className="last-word-holder">{lastWordHolder}</p> : <p>Top Rhymes</p>}
              </div>
              <div className="custom-rhyme-inner">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {topRhymes ? showTopRhymes() : <p className="inital-prompt">Start recording to see your top rhymes.</p>}
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

          <div className="suggestions sug-2">
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset rw-two">
                  {(recordingDisplay && isLocked) ? <p className="locked-word-holder">{lastWordHolder}</p> : <p>Locked Rhymes</p>}
                </div>
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {isLocked ? showLockedRhymes() : <p className="inital-prompt">Click lock button above to save top rhymes here.</p>}
                  </div>
                </div>
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

          <div className="suggestions sug-3">
            <div className="custom-rhyme">
              <div className="rhymed-word_shadow-div-inset rw-three">
                {selectedWord ? <p className="select-word-holder">{selectedWord}</p> : <p>Selected Rhymes</p>}
              </div>
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <div className="custom-rhyme_shadow-div-inset">
                  <div className="top-rhymes-container">
                    {selectedWord ? showSelectedRhymes() : <p className="inital-prompt">Click any flowed lyric to generate rhymes here.</p>}
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
                    onChange={(e) => changeRhymeNo(e)}
                    >
                      {rhymeOptionNoHandler()}
                  </select>
                </div>
              </div>
              <div className="rhyme-lock-button rlb-2">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn" onClick={() => shuffleRhymeHandler(retrievedSelectedRhymes, selectedRhymes)}>
                    <img className="button-icons" src={shuffle} alt="shuffle" />
                  </button>
                </div>
              </div>
              <div className="rhyme-lock-button rlb-3">
                <div className="rhyme-lock-outset">
                  <button className="rhyme-lock-btn">
                    Edit Lyrics
                  </button>
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
                      <UseAudioPlayer 
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        audioSrc={audioSrc}
                        setAudioSrc={setAudioSrc}
                        allTakes={allTakes}
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
                              onChange={e => loadTake(e)}
                            >
                              {chooseTake()}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flow-takes-2_takes-actions">
                      <div className="takes-actions-container">
                        <div className="actions-btn-container">
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

          <div className="record-2_record-btn" ref={slideOutMicRef}>
            <div className="record-btn_shadow-div-inset">
              {isRecording ? (
                <button
                  className="record-btn_shadow-div-outset"
                  onClick={() => setIsRecording(false)}
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
                  onClick={() => setIsRecording(true)}
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
        <NavBar />
      </div>
    </div>
  )
}
export default TestAudio;