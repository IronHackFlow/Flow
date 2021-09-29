import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AudioTimeSlider from "./AudioTimeSlider";
import edit from "../images/edit.svg";
import del from "../images/delete2.svg";
import exit from "../images/exit-x-2.svg";
import down from "../images/down.svg";
import pause from "../images/pause.svg";
import play from "../images/play.svg";
import beat1 from "../assets/beatsTrack1.m4a";
import beat2 from "../assets/beatsTrack2.m4a";
import beat3 from "../assets/beatsTrack3.m4a";
import beat4 from "../assets/beatsTrack4.m4a";
import beat5 from "../assets/beatsTrack5.m4a";

function EditLyrics(props) {
  const history = useHistory()
  const [tracks, setTracks] = useState([
    { song: beat1, name: "After Dark" },
    { song: beat2, name: "Futurology" },
    { song: beat3, name: "Peacock" },
    { song: beat4, name: "Callback" },
    { song: beat5, name: "Drained" },
  ]);
  const [getTakes, setGetTakes] = useState([])
  const [currentSong, setCurrentSong] = useState()
  const [audioSrc, setAudioSrc] = useState(null);
  const lyricsPopUpRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setGetTakes([...props.location.songs])
    const getCurrentSong = props.location.songs.filter((item) => {
      if (item.songmix === props.location.currentSong) {
        setCurrentSong(item)
        return item
      }
    })
    // setCurrentSong(props.location.songs.filter(item => item.songmix === props.location.currentSong))
    setAudioSrc(currentSong?.songmix)
  }, [])

  const closeWindow = () => {
    history.push({
      pathname: '/recordingBooth',
      songs: props.location.songs
    })
  }

  const mapTakes = useCallback(() => {
    console.log(currentSong, "what it is?")
    return currentSong?.lyrics.map((each, index) => {
      return (
        <li className="lyrics-list-item" key={`${uuidv4()}lyrics${index}`}>
          <div className="list-item-1_edit-lyrics">
            <div className="edit-lyrics-container">
              <div className="edit-lyrics_shadow-div-outset">
                <div className="buttons-container">
                  <div className="buttons-container_shadow-div-inset">
                    <div className="bar-number-container">
                      <div className="bar-num_shadow-div-inset">
                        <div className="bar-num_shadow-div-outset">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="buttons_shadow-div-inset">
                      <button className="buttons_shadow-div-outset">
                        <img className="button-icons" src={edit} alt="edit" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="each-lyric-container">
                  <div className="each-word-container">
                    {each.map((item) => {
                      return (
                        <p>{item}</p>
                      )
                    })}
                  </div>
                </div>
                <div className="close-btn-container">
                  <div className="close-btn_shadow-div-inset">
                    <button className="close-btn_shadow-div-outset">
                      <img className="button-icons" src={del} alt="delete" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-item-2_lyric-suggestions">
            </div>
          </div>
        </li>
      )
    })
  }, [currentSong, props.location])

  const mapMiniLyrics = () => {
    if (getTakes.length !== 0) {
      return currentSong.lyrics.map((each, index) => {
        return (
          <div className="display-each-container">
            <p className="bar-no">{index + 1}</p>
            {each.map((e) => {
              return (
                <p className="each-word">{e}</p>
              )
            })}
          </div>
        )
      })
    }
  }

  // const showMiniLyrics = (bool) => {
  //   if (bool === true) {
  //     lyricsPopUpRef.current.style.height = lyricsPopUpRef.current.scrollHeight
  //     console.log(lyricsPopUpRef.current.scrollHeight, "show it!")
  //   }
  // }
  const chooseTrack = () => {
    return tracks.map((element, index) => {
      return <option key={`${element}_${index}`} value={element.song}>{element.name} </option>;
    });
  };

  const loadTrack = () => {
    let selectBox = document.getElementById("selectBox");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById("song").src = selectedValue;      
  };

  const handlePlayPause = (bool) => {
    if (bool === true) {
      setIsPlaying(true)
    }
    else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="EditLyrics">
      <div className="section-1_profile-el">
          <button className="close-screen" onClick={closeWindow}>
            <img className="button-icons" src={exit} alt="exit" />
          </button>
      </div>
      <div className="section-2_lyrics-el">
          <ul className="lyrics-list-container">
            {mapTakes()}
          </ul>
      </div>
      <div className="section-3_controls">
        <div className="controls-container">
          <div className="controls-1_options">
            <div className="options_shadow-div-outset">
              <div className="options-1_choose-song">

              </div>
              <div className="options-2_toggle-lyrics">

              </div>
            </div>
          </div>
          <div className="controls-2_inner">
            <div className="inner_shadow-div-outset">
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
                        audioSrc={audioSrc}
                        allTakes={getTakes}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
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
        </div>
      </div>
      <div className="section-4_display-lyrics" ref={lyricsPopUpRef}>
        <div className="display-lyrics-container">
          {mapMiniLyrics()}
        </div>
        <div className="menu-down-container">
          <button className="menu-down-btn">
            <img className="button-icons" src={down} alt="menu down" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default EditLyrics;