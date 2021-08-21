import React, { useRef, useState, useEffect } from "react";
import beat1 from "../assets/beatsTrack1.m4a";
import beat2 from "../assets/beatsTrack2.m4a";
import beat3 from "../assets/beatsTrack3.m4a";
import beat4 from "../assets/beatsTrack4.m4a";
import beat5 from "../assets/beatsTrack5.m4a";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import datamuse from "datamuse";
import mic from "../images/modern-mic.svg";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import stop from "../images/stop.svg";
import xExit from "../images/exit-x-2.svg";
import save from "../images/save-disk.svg";
import locked from "../images/locked.svg";
import edit from "../images/edit.svg";
import help from "../images/help2.svg";
import TheContext from "../TheContext";
import Modal from "./ModalMenu";
import actions from "../api";
import NavBar from "./NavBar";

function TestAudio(props) {
  const { user } = React.useContext(TheContext);

  const [recordings, setRecordings] = useState(
    <audio id="userRecording"></audio>
  );
  const [rhymes, setRhymes] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [silent, setSilent] = useState(false);
  const [lock, setLock] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [takes, setTakes] = useState([]);
  const [allTakes, setAllTakes] = useState([]);
  let [fullTranscript, setFullTranscript] = useState("");
  const theTakes=useRef()
  const [tracks, setTracks] = useState([
    { song: beat1, name: "After Dark" },
    { song: beat2, name: "Futurology" },
    { song: beat3, name: "Peacock" },
    { song: beat4, name: "Callback" },
    { song: beat5, name: "Drained" },
  ]);

  //const [words,setWords] =useState()
  class SongData {
    constructor(songmix) {
      this.date = null;
      this.user = user;
      this.songmix = songmix;
      this.lyrics = null;
      this.background = null;
      this.name = null;
      this.songBlob = null;
    }
    setLyrics() {
      this.lyrics = lyricsArr;
    }
    setDate() {
      var today = new Date();

      this.date = today;
    }
    setName() {
      this.name = prompt("What's the name of your song?", "song name");
    }
  }

  useEffect(() => {
    const lastWord = transcript.split(" ")[transcript.split(" ").length - 1];
    let retrievedRhymes = [];
    let retHolder = [];
    datamuse.request(`words?rel_rhy=${lastWord}&max=5`).then((res) => {
      if (res.length !== 0) {
        for (let i = 0; i < 3; i++) {
          retHolder.push(res[Math.floor(Math.random() * res.length)].word);
        }
        retHolder.forEach((element) => {
          retrievedRhymes.push(` ${element} `);
        });
        if (retrievedRhymes.length !== 0) {
          setRhymes(retrievedRhymes);
        }
        addSongLine();
      }
    });
  }, [silent]);

  let myReq; //animation frame ID

  const loadTrack = () => {
    let selectBox = document.getElementById("selectBox");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById("song").src = selectedValue;
  };

  const loadTake = () => {
    let selectedTake = document.getElementById("takes");
    let selectedTakeValue =
      selectedTake.options[selectedTake.selectedIndex].value;
    document.getElementById("userRecording").src = selectedTakeValue;
  };

  const chooseTrack = () => {
    return tracks.map((element, index) => {
      return <option key={index} value={element.song}>{element.name} </option>;
    });
  };

  function recordAudio() {
    function detectSilence(
      stream,
      onSoundEnd = (_) => {},
      onSoundStart = (_) => {},
      silence_delay = 50,
      min_decibels = -80
    ) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const streamNode = ctx.createMediaStreamSource(stream);

      streamNode.connect(analyser);
      analyser.minDecibels = min_decibels;

      const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
      let silence_start = performance.now();
      let triggered = false; // trigger only once per silence event

      function loop(time) {
        myReq = requestAnimationFrame(loop); // we'll loop every 60th of a second to check
        analyser.getByteFrequencyData(data); // get current data
        if (data.some((v) => v)) {
          // if there is data above the given db limit
          if (triggered) {
            triggered = false;
            onSoundStart();
          }
          silence_start = time; // set it to now
        }
        if (!triggered && time - silence_start > silence_delay) {
          onSoundEnd();
          triggered = true;
        }
      }
      loop();
    }

    function onSilence() {
      ////console.log('silence')
      setSilent(true);
    }
    function onSpeak() {
      //console.log('speaking');
      setSilent(false);
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        detectSilence(stream, onSilence, onSpeak);

        var audio = document.getElementById("song").captureStream();
        document.getElementById("song").play();

        mergeStreams(stream, audio);
        SpeechRecognition.startListening({ continuous: true });
      })
      .catch(console.error);
  }

  //add recording to list
  const addRec = (blobby, name, blobFile) => {
    const copyRec = (
      <audio src={blobby} id={"userRecording"} key={name}></audio>
    );
    const songObject = new SongData(blobby);
    allTakes.push(songObject);
    allTakes[allTakes.length - 1].songBlob = blobFile;
    setRecordings(copyRec);
    takes.push(blobby);
  };

  function mergeStreams(stream1, stream2) {
    const audioContext = new AudioContext();

    let audioIn_01 = audioContext.createMediaStreamSource(stream1);
    let audioIn_02 = audioContext.createMediaStreamSource(stream2);

    let dest = audioContext.createMediaStreamDestination();

    audioIn_01.connect(dest);
    audioIn_02.connect(dest);

    const recorder = new MediaRecorder(dest.stream);
    recorder.start();
    //console.log('started recording')

    let chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
      //console.log(chunks)
      go(chunks);
      SpeechRecognition.stopListening();
    };

    document.getElementById("fixer").onclick = () => {
      recorder.stop();
      cancelAnimationFrame(myReq);
      //console.log('stopped recording')
    };
  }
  let key = 0;

  function go(blob) {
    let mpegBlob = new Blob(blob, { type: "audio/mpeg-3" });
    const url = window.URL.createObjectURL(mpegBlob);

    key++;

    addRec(url, `take ${key}`, mpegBlob);
  }

  const stopRecording = () => {
    document.getElementById("song").pause();
    document.getElementById("song").currentTime = 0;
  };
  //currently there exists a delay that needs to be offset when merged.!!!!!!!
  let [lyricsArr, setLyricsArr] = useState([]);

  const songLine = () => {
    const lastLine = transcript;
    lyricsArr.push(lastLine);
    setLyricsArr(lyricsArr);
    setKeyCounter(keyCounter + 1);
    return (
      <p className="transcript-line-1" key={keyCounter}>
        {lastLine}.
      </p>
    );
  };

  let [line, setLine] = useState([]);

  const addSongLine = () => {
    const copyLine = [...line];
    copyLine.push(songLine());
    resetTranscript();
    setLine(copyLine);
    autoScroll()
  };

  const autoScroll=()=>{
    let scrollLyrics= document.getElementById('currentTranscript')
    scrollLyrics.scrollTop
    = scrollLyrics.scrollHeight
  }

  const lockSuggestion = () => {
    const copyRhyme = [...rhymes];
    setLock(copyRhyme);
  };

  const clearLockSuggestions = () => {
    setLock([])
  }

  const handlePlayPause = () => {
    if (document.getElementById("userRecording").paused) {
      document.getElementById("play-stop-img").src = pause;
      document.getElementById("userRecording").play();
    } 
    else {
      document.getElementById("play-stop-img").src = play;
      document.getElementById("userRecording").pause();
    }
  };

  const handleRecStop = () => {
    if (document.getElementById("song").paused) {
      // document.getElementById('record-stop').setAttribute('class', 'button-icons bi-stop')
      document.getElementById("record-stop-img").src = stop;
      recordAudio();
    } else {
      // document.getElementById('record-stop').setAttribute('class', 'button-icons bi-record')
      document.getElementById("record-stop-img").src = mic;
      stopRecording();
      document.getElementById("fixer").click();
    }
  };

  // //make a time slider
  function TimeSlider() {
    const [time, setTime] = useState(0);

    useEffect(() => {
      document.getElementById("userRecording").currentTime = time;
    }, [time]);
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
          onChange={(event) => {
            setTime(event.target.valueAsNumber);
          }}
        />
      </section>
    );
  }
  
  const displayTake = () => {
    if (takes.length === 0) {
    } 
    else {
      let selectedTake = document.getElementById("takes");
      selectedTake.selectedIndex = takes.length - 1;
      const freshTrack = allTakes[takes.length - 1];
      if (freshTrack) {
        freshTrack.setDate();
        freshTrack.setLyrics();
      }
    }
  };

  const chooseTake = () => {
    // //map through takes,

    if (takes.length === 0) {
      return <option>No record</option>;
    } 
    else {
      const takesHolder = takes.map((element, index) => {
        return <option value={element}>Take {index + 1}</option>;
      });
      displayTake();
      return takesHolder;
    }
  };

  const saveFile = () => {
    if (allTakes.length === 0) {
    } 
    else {
      let selUpload = allTakes[theTakes.current.selectedIndex];
      selUpload.setName();

      let chosenFile = selUpload.user._id + selUpload.name.replaceAll(" ", "-");

      actions
        .uploadFile(
          {
            fileName: chosenFile,
            fileType: "audio/mpeg-3",
            file: selUpload.songBlob,
            kind: "song",
          },
          selUpload
        )
        .then(console.log)
        .catch(console.log);
    }
  };

  const modalPopup = () => {
    const modal = document.querySelector(".modal");
    modal.style.bottom = "0vh"
    modal.style.transition = "bottom .5s"
    const closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      modal.style.bottom = "-65vh"
      modal.style.transition = "bottom .5s"
    });
  };

  const deleteTake=()=>{
   setLine([])
   setRhymes([])
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
          <p className="transcript-line-2">
            {transcript}
          </p>
        </div>
      </div>

      <div className="section-2_control-panel">
        <div className="section-2a_flow-suggestions">
          <div className="suggestions sug-1">
            <div className="custom-rhyme">
              <div
                className="custom-rhyme-inner"
                id="suggestion"
                onClick={lockSuggestion}
              >
                <p className="transcript-line-3">
                  {rhymes}
                </p>
              </div>
              <div className="custom-rhyme-title">
                Flyest Rhyme Suggestions
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
              {/* <div className="rhyme-title-container">
                Lock Rhymes
              </div> */}
            </div>
          </div>

          <div className="suggestions sug-2">
            <div className="custom-rhyme">
              <div className="custom-rhyme-inner" id="lockedRhyme">
                <p className="transcript-line-4">{lock}</p>
              </div>
              <div className="custom-rhyme-title" style={{color: "#f9f9bb"}}>
                Locked Rhyme Suggestions
              </div>
            </div>
            <div className="rhyme-lock-container">
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

        <div className="section-2b_flow-controls">
          <div className="flow-controls-container">
            <div className="flow-controls-1_playback-display">
              <div className="play-btn-container">
                <div className="play-btn-container_shadow-div-outset">
                  <div className="play-btn-container_shadow-div-inset">
                    <div
                      className="play-btn_shadow-div-outset"
                      id="playPause"
                      onClick={handlePlayPause}
                    >
                      <img
                        className="button-icons bi-play"
                        id="play-stop-img"
                        src={play}
                        alt="play icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="play-slider-container">
                <div className="play-slider-container_shadow-div-outset">
                  <div className="play-slider-container_shadow-div-inset">
                    <div className="dur-onset" id="duration">
                      {/* <TimeSlider /> */}
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
                              ref={theTakes} 
                              onChange={loadTake}
                              >
                                {chooseTake()}
                            </select>
                          </div>
                          <div className="select-takes-title">
                            {user.userName}'s Takes
                          </div>
                        </div>

                        <div className="edit-takes-container_shadow-div-inset">
                          <div className="edit-takes-btn_shadow-div-outset">
                            <img className="button-icons" src={edit} alt="edit" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flow-takes-2_takes-actions">
                      <div className="takes-actions-container">
                        <div className="actions-btn-container">
                          <div className="actions-btn_shadow-div-outset" onClick={saveFile}>
                            <img className="button-icons bi-help" src={save} alt="save icon" />
                          </div>
                        </div>
                        <div className="actions-btn-container">
                          <div className="actions-btn_shadow-div-outset" onClick={deleteTake}>
                            <img className="button-icons" src={xExit} alt="delete bin icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="actions-2_record">
                    <div className="record-container">
                      <div className="record-1_select-beat">
                        <div className="select-beat-title">
                          Select A Beat :
                        </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
      {recordings}
    </div>
  );
}
export default TestAudio;

// <div className="selected-container" onClick={modalPopup}>
//   <div>
//     <img className="button-icons" src={help} alt="help icon" />
//   </div>
// </div>