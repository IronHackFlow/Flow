import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import TheContext from "../TheContext";
import actions from "../api"
import { v4 as uuidv4 } from "uuid";
import AudioTimeSlider from "./AudioTimeSlider";
import edit from "../images/edit.svg";
import save from "../images/save-disk.svg";
import del from "../images/delete2.svg";
import exit from "../images/exit-x-2.svg";
import down from "../images/down.svg";
import pause from "../images/pause.svg";
import move from "../images/move.svg";
import play from "../images/play.svg";
import beat1 from "../assets/beatsTrack1.m4a";
import beat2 from "../assets/beatsTrack2.m4a";
import beat3 from "../assets/beatsTrack3.m4a";
import beat4 from "../assets/beatsTrack4.m4a";
import beat5 from "../assets/beatsTrack5.m4a";

function EditLyrics(props) {
  const { user } = React.useContext(TheContext)
  const history = useHistory()

  const [tracks, setTracks] = useState([
    { song: beat1, name: "After Dark" },
    { song: beat2, name: "Futurology" },
    { song: beat3, name: "Peacock" },
    { song: beat4, name: "Callback" },
    { song: beat5, name: "Drained" },
  ]);
  const [getTakes, setGetTakes] = useState([]);
  const [thisUserSongs, setThisUserSongs] = useState([])
  const [currentSong, setCurrentSong] = useState();
  const [lyricsArray, setLyricsArray] = useState([]);
  const [allSongs, setAllSongs] = useState([])
  const [lyricsDisplay, setLyricsDisplay] = useState([]);
  const [selectedSong, setSelectedSong] = useState();
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [linkLocation, setLinkLocation] = useState();
  const [editLyrics] = useState(`#363636`);

  const lyricsPopUpRef = useRef();
  
  useEffect(() => {
    if (props.location.pathname === `/recordingBooth/EditLyrics`) {
      setLinkLocation(true)
      setGetTakes([...props.location.songs])
      setCurrentSong(props.location.currentSong)
    } else if (props.location.pathname === `/profile/${user?._id}/EditLyrics`) {
      setLinkLocation(false)
      setCurrentSong(props.location.currentSong)
      setSelectedSong(props.location.currentSong.songURL)
    }
    console.log(getTakes, "i wanna see this ok?")
  }, [linkLocation])

  useEffect(() => {
    setAudioSrc(currentSong?.songURL)
  }, [currentSong])

  useEffect(() => {
    if (props.location.currentSong === undefined) {
      setCurrentSong(thisUserSongs[0])
    }
  }, [thisUserSongs])
  
  useEffect(() => {
    actions
      .getUserSongs({ songUser: user._id })
      .then(res => {
        setThisUserSongs(res.data)
      })
      .catch(console.error)
  }, [])
 
  useEffect(() => {
    if (getTakes?.length > 0) {
      const combineArr = [...getTakes, ...thisUserSongs]
      setAllSongs(combineArr)
    } else {
      setAllSongs(thisUserSongs)
    }
  }, [getTakes, thisUserSongs])

  useEffect(() => {
    let lyricArray = currentSong?.songLyricsStr.map((each, index) => {
      if (typeof each === 'string') {
        return { id: `${index}${each}`, array: each.split(' ') }
      } else {
        return { id: `${index}${each}`, array: each }
      }
    })
    console.log(lyricArray, "wLSKJDFLKSDJFLKSJDFLKSJDFkdkdffkjd DKJFS sdkfj")
    setLyricsArray(lyricArray)

  }, [currentSong])

  const closeWindow = () => {
    if (linkLocation === true) {
      history.push({
        pathname: '/recordingBooth',
        songs: props.location.songs
      })
    } else {
      history.push({
        pathname: `/profile/${user?._id}`,
        songs: props.location.songs
      })
    }
  }
  const [editToggle, setEditToggle] = useState(false);
  const [targetLine, setTargetLine] = useState();

  function EachLyricLine(each, index) {

    const editLyricLine = (each) => {
      setTargetLine(each)
      setEditToggle(true)
      console.log(targetLine, "WTF")
      console.log(each, "editing")
    }

    const deleteLyricLine = (e) => {
      console.log(e, "deleted")
    }
    
    const saveLyricLine = (e) => {
      setEditToggle(false)
      console.log(e, "saved")
    }

    const mapEachLyric = useCallback((wordArr) => {
      console.log(wordArr, "WHATAMAIDOING?")
      console.log(targetLine, "WWWWHHAHAHAHTDOING?")
      if (editToggle) {
        if (wordArr.id === targetLine.id) {
          console.log('guess so')
          wordArr.array.map((each, index) => {
            console.log(each, "YO Y O YO WHATF THE FUCK")
            return (
              <input placeholder={`${each}`} key={`${each}++${index}`}></input>
            )
          })
        }
      } else {
        console.log("GUESSSS NOT")
        return wordArr.array?.map((each, index) => {
          return <p key={`${each}+${index}`} id={`${each}`}>{each}</p>
        })
      }
    }, [editToggle])

    return (
      <li className="lyrics-list-item" key={`${each.id}+++${index}`}>
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
                    {editToggle ? (
                      <button className="buttons_shadow-div-outset" onClick={() => saveLyricLine(each)}>
                        <img className="button-icons" src={save} alt="save" />
                      </button>
                    ) : (
                      <button className="buttons_shadow-div-outset" onClick={() => editLyricLine(each)}>
                        <img className="button-icons" src={edit} alt="edit" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="each-lyric-container">
                <div className="each-word-container">
                  {mapEachLyric(each)}
                </div>
              </div>

              <div className="close-btn-container">
                <div className="close-btn_shadow-div-inset">
                  <button className="close-btn_shadow-div-outset" onClick={(e) => deleteLyricLine(e)}>
                    <img className="button-icons" src={del} alt="delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="list-item-2_lyric-suggestions">
            <div className="handle">
              <img className="button-icons" src={move} alt="move" />
            </div>
          </div>
        </div>
      </li>
    )
  }
  
  useEffect(() => {
    if (currentSong) {
      let lyricDisplay = lyricsArray?.map((each, index) => {
        return (
          <EachLyricLine {...each} index={index} />
        )
      })
      setLyricsDisplay(lyricDisplay)
    }
  }, [lyricsArray, props.location, editToggle])

  const mapMiniLyrics = () => {
    return currentSong?.songLyricsStr.map((each, index) => {
      if (!(Array.isArray(each))) {
        each = each.split(' ')
      }
      return (
        <div className="display-each-container" key={`${uuidv4()}cont${each}and${index}`}>
          <p className="bar-no">{index + 1}</p>
            {each.map((e, i) => {
              return (
                <p className="each-word" key={`${e}and${i}`}>{e}</p>
              )
            })}
        </div>
      )
    })
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

  const chooseSongs = () => {
    return allSongs.map((each, index) => {
      return (
        <option value={each.songURL} key={`${index}+${each._id}`}>
          {each.songName}
        </option>
      )
    })
  }

  const loadSong = (e) => {
    setSelectedSong(e.target.value)
    setCurrentSong(allSongs[e.target.selectedIndex])
    console.log(allSongs[e.target.selectedIndex], "sdkfsdkfd")
    console.log(selectedSong, "what itsdfs fkdjfs")
  }

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
        <ReactSortable 
          className="lyrics-list-container"
          list={lyricsDisplay}
          setList={setLyricsDisplay}
          group="groupName"
          ghostClass="ghost"
          animation={200}
          handle=".handle"
          delayOnTouchStart={true}
          delay={2}
        >
          {lyricsDisplay}
        </ReactSortable>
      </div>

      <div className="section-3_controls">
        <div className="controls-container">
          <div className="controls-1_options">
            <div className="options_shadow-div-outset">
              <div className="options-1_choose-song">
                <div className="choose-song_shadow-div-inset">
                  <div className="choose-song-title">
                    Select A Song:
                  </div>
                  <select
                    className="select-songs"
                    value={selectedSong}
                    onChange={(e) => loadSong(e)}
                  >
                    {chooseSongs()}
                  </select>
                </div>
              </div>
              <div className="options-2_toggle-lyrics">
                <div className="save-btn-container">
                  <button className="save-btn">
                    Save
                  </button>
                </div>
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
                            src={play}
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
                          location={editLyrics}
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