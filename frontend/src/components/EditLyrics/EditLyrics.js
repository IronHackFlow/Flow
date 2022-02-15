import { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactSortable } from 'react-sortablejs'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import useHistory from '../../hooks/useHistory'
import EditLyricsItem from './EditLyricsItem'
import AudioTimeSlider from '../AudioTimeSlider'
import SelectMenuModal from '../SelectMenuModal'
import { beatList } from '../../constants/index'
import {
  downIcon,
  playIcon,
  pauseIcon,
  goBackIcon,
  undoIcon,
  redoIcon,
} from '../../assets/images/_icons'

function EditLyrics() {
  const { user } = useContext(TheContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongs, propCurrentSong } = location?.state

  const [currentSong, setCurrentSong] = useState(null)
  const [currentBeat, setCurrentBeat] = useState(beatList[0])
  const [allSongs, setAllSongs] = useState([])
  const [initialSongs, setInitialSongs] = useState([])
  const [lyricsArray, setLyricsArray, { history, pointer, back, forward }] = useHistory()
  const [lyricsDisplay, setLyricsDisplay] = useState([])

  const [isPlaying, setIsPlaying] = useState(false)
  const [showSelectBeatMenu, setShowSelectBeatMenu] = useState(false)
  const [showSelectSongMenu, setShowSelectSongMenu] = useState(false)
  const [isBeatPlaying, setIsBeatPlaying] = useState(false)

  const lyricsPopUpRef = useRef()
  const playBeatRef = useRef()
  const [testSongs, setTestSongs] = useState([])

  useEffect(() => {
    actions
      .getUserSongs({ song_user: '604bbcb127022c002165238a' })
      .then(res => {
        setTestSongs(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    setCurrentSong(testSongs[0])
    setAllSongs(testSongs)
    setInitialSongs(testSongs)
  }, [testSongs])

  useEffect(() => {
    let lyricArray = currentSong?.lyrics?.map((each, index) => {
      if (typeof each === 'string') {
        return { id: `${index + 1}${each}`, array: each.split(' ') }
      } else {
        return { id: `${index + 1}${each}`, array: each }
      }
    })
    setLyricsArray(lyricArray)
  }, [currentSong, allSongs])

  useEffect(() => {
    console.log(history, 'what is this look like')
    if (currentSong) {
      let lyricDisplay = lyricsArray?.map((each, index) => {
        return (
          <EditLyricsItem
            line={each}
            index={index}
            updateLyrics={setLyricsArray}
            key={`${each.id}lyric${index}`}
          />
        )
      })
      setLyricsDisplay(lyricDisplay)
    }
  }, [lyricsArray])

  const handlePlayBeat = () => {
    if (isBeatPlaying) {
      playBeatRef.current.pause()
      setIsBeatPlaying(false)
    } else {
      playBeatRef.current.play()
      setIsBeatPlaying(true)
    }
  }

  const onCloseHandler = () => {
    navigate(-1)
  }

  const mapMiniLyrics = useCallback(() => {
    return lyricsArray?.map((each, index) => {
      return (
        <div className="display-each-container" key={each?.id}>
          <p className="bar-no">{index + 1}</p>
          {each?.array?.map((e, i) => {
            return (
              <p className="each-word" key={`${e}and${i}`}>
                {e}
              </p>
            )
          })}
        </div>
      )
    })
  }, [lyricsArray, lyricsDisplay, allSongs, currentSong])

  const setLyricsArrayHandler = e => {
    let getItem = lyricsArray.filter(
      each => each.id === lyricsDisplay[e.newDraggableIndex].props.line.id,
    )
    lyricsArray.splice(e.oldDraggableIndex, 1)
    lyricsArray.splice(e.newDraggableIndex, 0, getItem[0])
    setLyricsArray(lyricsArray)
  }

  const handleSaveLyrics = () => {
    let savedLyrics = lyricsArray.map(each => each.array)
    setAllSongs(prev =>
      prev.map(each => {
        if (each._id === currentSong._id) {
          setCurrentSong({ ...each, lyrics: savedLyrics })
          return { ...each, lyrics: savedLyrics }
        } else {
          return each
        }
      }),
    )
  }

  const handleResetLyrics = () => {
    let replaceSong = initialSongs.filter(each => each._id === currentSong._id)
    setAllSongs(prev =>
      prev.map(each => {
        if (each._id === currentSong._id) {
          setCurrentSong(replaceSong[0])
          return replaceSong[0]
        } else {
          return each
        }
      }),
    )
  }

  const onUndo = () => {
    // console.log(lyricsArray, history, 'UNDO THIS SHIT YO')
    console.log(history[pointer - 1], 'what is it?')
    // if (history[pointer - 1] == null) return
    back()
    // if (history[pointer - 1] !== null || history[pointer - 1] !== undefined) {
    // }
  }

  const onRedo = () => {
    // console.log(lyricsArray, 'redo THIS SHIT YO')
    forward()
  }

  return (
    <div className="EditLyrics">
      <SelectMenuModal
        positionTop={true}
        positionY={6}
        maxHeight={96 - 6}
        list={allSongs}
        currentItem={currentSong}
        setCurrentItem={setCurrentSong}
        isOpen={showSelectSongMenu}
        onClose={setShowSelectSongMenu}
      />

      <SelectMenuModal
        positionTop={false}
        positionY={8}
        maxHeight={96 - 8}
        list={beatList}
        currentItem={currentBeat}
        setCurrentItem={setCurrentBeat}
        isOpen={showSelectBeatMenu}
        onClose={setShowSelectBeatMenu}
      />

      <div className="edit-lyrics__header">
        <div className="edit-lyrics__header--shadow-inset">
          <div className="edit-lyrics__exit--container">
            <button className="edit-lyrics__exit-btn" onClick={() => onCloseHandler()}>
              <img className="button-icons" src={goBackIcon} alt="exit" />
            </button>
          </div>
          <div className="edit-lyrics__title--container">
            <div className="edit-lyrics__title--shadow-outset">
              <p className="edit-lyrics__title">Edit Your Lyrics</p>
              <p className="edit-lyrics__title name">{currentSong?.song_user?.user_name}</p>
            </div>
          </div>
          <div className="edit-lyrics__select-song">
            <div className="edit-lyrics__select-song--shadow-outset">
              <div className="edit-lyrics__select-song--shadow-inset">
                <button
                  className="edit-lyrics__select-song-btn"
                  onClick={() => setShowSelectSongMenu(true)}
                >
                  <p className="edit-lyrics__select-song-text">{currentSong?.name}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="edit-lyrics__lyrics--container">
        <ReactSortable
          tag="ul"
          className="edit-lyrics__lyrics-list"
          list={lyricsDisplay}
          setList={setLyricsDisplay}
          group="groupName"
          ghostClass="ghost"
          animation={200}
          handle=".move-handle__btn"
          onSort={e => setLyricsArrayHandler(e)}
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
              <div className="options-2_toggle-lyrics">
                <div className="save-reset-btn--container">
                  <button className="save-reset-btn reset" onClick={() => handleResetLyrics()}>
                    reset
                  </button>
                </div>
                <div className="edit-lyrics__undo-redo">
                  <button className="edit-lyrics__undo-redo-btn" onClick={() => onUndo()}>
                    <img src={undoIcon} alt="undo" className="button-icons" />
                  </button>
                </div>
                <div className="edit-lyrics__undo-redo">
                  <button className="edit-lyrics__undo-redo-btn" onClick={() => onRedo()}>
                    <img src={redoIcon} alt="redo" className="button-icons" />
                  </button>
                </div>
                <div className="save-reset-btn--container">
                  <button className="save-reset-btn save" onClick={() => handleSaveLyrics()}>
                    save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="controls-2_inner">
            <div className="inner_shadow-div-outset">
              <div className="flow-controls-1_playback-display">
                <div className="play-btn-container">
                  {isPlaying ? (
                    <button
                      className="play-btn_shadow-div-outset play"
                      aria-label="Pause"
                      onClick={() => setIsPlaying(false)}
                    >
                      <img className="button-icons bi-pause" src={pauseIcon} alt="pause icon" />
                    </button>
                  ) : (
                    <button
                      className="play-btn_shadow-div-outset pause"
                      aria-label="Play"
                      onClick={() => setIsPlaying(true)}
                    >
                      <img className="button-icons bi-play" src={playIcon} alt="play icon" />
                    </button>
                  )}
                </div>

                <div className="play-slider-container">
                  <div className="play-slider-container_shadow-div-outset">
                    <div className="play-slider-container_shadow-div-inset">
                      <div className="play-slider_shadow-div-outset">
                        <AudioTimeSlider
                          isPlaying={isPlaying}
                          setIsPlaying={setIsPlaying}
                          currentSong={currentSong}
                          bgColor={`#4d4d4d`}
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
                    <button className="play-beat_shadow-div-inset" onClick={handlePlayBeat}>
                      <img
                        className="button-icons bi-play"
                        src={isBeatPlaying ? pauseIcon : playIcon}
                        alt="play or pause icon"
                      />
                    </button>
                    <audio src={currentBeat?.song} ref={playBeatRef} />
                  </div>

                  <button className="select-beat_shadow-div-outset">
                    <div className="select-beat-title">Select A Beat :</div>
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
        <div className="display-lyrics-container">{mapMiniLyrics()}</div>
        <div className="menu-down-container">
          <button className="menu-down-btn">
            <img className="button-icons" src={downIcon} alt="menu down" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default EditLyrics
