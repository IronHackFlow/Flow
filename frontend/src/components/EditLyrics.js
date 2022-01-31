import { useContext, useState, useEffect, useRef, useCallback } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import TheContext from "../contexts/TheContext";
import AudioTimeSlider from "./AudioTimeSlider";
import SelectMenuModal from "./SelectMenuModal"
import { beatList } from '../constants/index'
import { editIcon, saveIcon, deleteIcon, closeIcon, downIcon, playIcon, pauseIcon, moveIcon } from "../assets/images/_icons"


function EditLyrics() {
  const { user } = useContext(TheContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongs, propCurrentSong } = location?.state

  const [currentSong, setCurrentSong] = useState(null)
  const [currentBeat, setCurrentBeat] = useState(beatList[0])
  const [allSongs, setAllSongs] = useState([])
  const [lyricsArray, setLyricsArray] = useState([]);
  const [lyricsDisplay, setLyricsDisplay] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSelectBeatMenu, setShowSelectBeatMenu] = useState(false)
  const [showSelectSongMenu, setShowSelectSongMenu] = useState(false)
  const [isBeatPlaying, setIsBeatPlaying] = useState(false)
  const [editToggle, setEditToggle] = useState(false);
  const [targetLine, setTargetLine] = useState();

  const lyricsPopUpRef = useRef();
  const playBeatRef = useRef();

  useEffect(() => {
    setCurrentSong(propCurrentSong)
    setAllSongs(propSongs)
  }, [])

  useEffect(() => {
    let lyricArray = currentSong?.lyrics?.map((each, index) => {
      if (typeof each === 'string') {
        return { id: `${index + 1}${each}`, array: each.split(' ') }
      } else {
        return { id: `${index + 1}${each}`, array: each }
      }
    })
    setLyricsArray(lyricArray)
  }, [currentSong])
  
  useEffect(() => {
    if (currentSong) {
      let lyricDisplay = lyricsArray?.map((each, index) => {
        return (
          <EachLyricLine {...each} index={index} key={`${each.id}lyric${index}`} />
        )
      })
      setLyricsDisplay(lyricDisplay)
    }
  }, [lyricsArray, editToggle, targetLine])

  const handlePlayBeat = () => {
    if (isBeatPlaying) {
      playBeatRef.current.pause()
      setIsBeatPlaying(false)
    } else {
      playBeatRef.current.play()
      setIsBeatPlaying(true)
    }
  }

  const closeWindow = () => {
    navigate(-1)
  }

  function EachLyricLine(each) {
    const [deleteBool, setDeleteBool] = useState(false);
    const lyricRefs = useRef();
    const regexNo = /^(?:\d*)/g

    const editLyricLine = (each) => {
      setTargetLine(each)
      setEditToggle(true)
      console.log(each, "editing")
    }

    const deleteLyricLine = (e) => {
      setLyricsArray(prevArr => prevArr.filter((each) => each.id !== e.id))
    }
    
    const saveLyricLine = (e) => {
      setEditToggle(false)
      console.log(e, "saved")
    }
    
    const setLyricRefs = useCallback((node) => {
      lyricRefs.current = node
    }, [])

    const mapEachLyric = useCallback((wordArr) => {
      if (editToggle) {
        return wordArr.array.map((each, index) => {
          if (wordArr.id === targetLine.id) {
            return <input placeholder={`${each}`} key={`${each}++${index}`} style={{width: `${each.length * 6 + 16}px`}}></input>
          } else {
            return <p key={`${each}+${index}`} id={`${each}`}>{each}</p>
          }
        })
      } else {
        return wordArr.array?.map((each, index) => {
          return <p key={`${each}+${index}`} id={`${each}`}>{each}</p>
        })
      }
    }, [])

    return (
      <li className="lyrics-list-item" ref={setLyricRefs}>
        <div className="list-item-1_edit-lyrics">
          <div className="edit-lyrics-container">
            <div className="edit-lyrics_shadow-div-outset">
              <div className="buttons-container">
                <div className="buttons-container_shadow-div-inset">
                  <div className="bar-number-container">
                    <div className="bar-num_shadow-div-inset">
                      <div className="bar-num_shadow-div-outset">
                        {each.id.match(regexNo)}
                      </div>
                    </div>
                  </div>
                  <div className="buttons_shadow-div-inset">
                    {(editToggle && (targetLine.id === each.id)) ? (
                      <button className="buttons_shadow-div-outset" onClick={() => saveLyricLine(each)}>
                        <img className="button-icons" src={saveIcon} alt="save" />
                      </button>
                    ) : (
                      <button className="buttons_shadow-div-outset" onClick={() => editLyricLine(each)}>
                        <img className="button-icons" src={editIcon} alt="edit" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="each-lyric-container">
                {deleteBool ? (
                  <div className="confirm-delete-container">
                    <div className="confirm-delete-title">
                      <p style={{color: "pink"}}>Do you want to delete this line?</p>
                    </div>
                    <div className="word-btn-container">
                      <button className="word-cancel" onClick={() => setDeleteBool(false)}>
                        Cancel
                      </button>
                      <button className="word-delete" onClick={() => deleteLyricLine(each)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="each-word-container">
                    {mapEachLyric(each)}
                  </div>
                )}
              </div>

              <div className="close-btn-container">
                <div className="close-btn_shadow-div-inset">
                  <button className="close-btn_shadow-div-outset" onClick={() => setDeleteBool(true)}>
                    <img className="button-icons" src={deleteIcon} alt="delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="list-item-2_lyric-suggestions">
            <div className="handle">
              <img className="button-icons" src={moveIcon} alt="move" />
            </div>
          </div>
        </div>
      </li>
    )
  }
  
  const mapMiniLyrics = useCallback(() => {
    return lyricsArray?.map((each, index) => {
      return (
        <div className="display-each-container" key={`cont${each.id}and${index}`}>
          <p className="bar-no">{index + 1}</p>
          {each.array.map((e, i) => {
              return (
                <p className="each-word" key={`${e}and${i}`}>{e}</p>
              )
            })}
        </div>
      )
    })
  }, [lyricsArray, lyricsDisplay])


  const setLyricsArrayHandler = (e) => {
    let getItem = lyricsArray.filter((each) => each.id === lyricsDisplay[e.newDraggableIndex].props.id)
    lyricsArray.splice(e.oldDraggableIndex, 1)
    lyricsArray.splice(e.newDraggableIndex, 0, getItem[0])
  }

  return (
    <div className="EditLyrics">
      
      <SelectMenuModal
        positionTop={false}
        positionY={21}
        maxHeight={96 - 21}
        list={allSongs}
        currentItem={currentSong}
        setCurrentItem={setCurrentSong}
        isOpen={showSelectSongMenu}
        onClose={setShowSelectSongMenu}
      />

      <SelectMenuModal 
        positionTop={false}
        positionY={8}
        maxHeight={96-8}
        list={beatList}
        currentItem={currentBeat}
        setCurrentItem={setCurrentBeat}
        isOpen={showSelectBeatMenu}
        onClose={setShowSelectBeatMenu}
      />

      <div className="section-1_profile-el">
        <h1 style={{position: "absolute", top: "10px", left: "30px", color: "white", fontSize: "16px"}}>This is A Work In Progress</h1>
        <button className="close-screen" onClick={closeWindow}>
          <img className="button-icons" src={closeIcon} alt="exit" />
        </button>
      </div>

      <div className="section-2_lyrics-el">
        <ReactSortable 
          tag="ul"
          className="lyrics-list-container"
          list={lyricsDisplay}
          setList={setLyricsDisplay}
          group="groupName"
          ghostClass="ghost"
          animation={200}
          handle=".handle"
          onSort={(e) => setLyricsArrayHandler(e)}
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
                <div 
                  className="choose-song_shadow-div-inset"
                  onClick={() => setShowSelectSongMenu(true)}
                >
                  <div className="choose-song-title">
                    Select A Song:
                  </div>
                  <div className="select-songs">
                    <p>{currentSong?.name}</p>
                  </div>
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
                          onClick={() => setIsPlaying(false)}
                        >
                          <img
                            className="button-icons bi-pause"
                            src={pauseIcon}
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
                          bgColor={`#363636`}
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
                  <div className="play-beat_shadow-div-outset">
                    <button 
                      className="play-beat_shadow-div-inset"
                      onClick={handlePlayBeat}>
                      <img
                        className="button-icons bi-play"
                        src={isBeatPlaying ? pauseIcon : playIcon }
                        alt="play or pause icon"
                      />
                    </button>
                    <audio src={currentBeat?.song} ref={playBeatRef} />
                  </div>

                  <button className="select-beat_shadow-div-outset">
                    <div className="select-beat-title">
                      Select A Beat :
                    </div>
                    <div 
                      id="selectBox" 
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

      <div className="section-4_display-lyrics" ref={lyricsPopUpRef}>
        <div className="display-lyrics-container">
          {mapMiniLyrics()}
        </div>
        <div className="menu-down-container">
          <button className="menu-down-btn">
            <img className="button-icons" src={downIcon} alt="menu down" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default EditLyrics;