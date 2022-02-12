import { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactSortable } from 'react-sortablejs'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import EditLyricsItem from './EditLyricsItem'
import AudioTimeSlider from '../AudioTimeSlider'
import SelectMenuModal from '../SelectMenuModal'
import { beatList } from '../../constants/index'
import { closeIcon, downIcon, playIcon, pauseIcon } from '../../assets/images/_icons'

function EditLyrics() {
  const { user } = useContext(TheContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongs, propCurrentSong } = location?.state

  const [currentSong, setCurrentSong] = useState(null)
  const [currentBeat, setCurrentBeat] = useState(beatList[0])
  const [allSongs, setAllSongs] = useState([])
  const [lyricsArray, setLyricsArray] = useState([])
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
  }, [currentSong])

  useEffect(() => {
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

  const closeWindow = () => {
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
  }, [lyricsArray, lyricsDisplay])

  const setLyricsArrayHandler = e => {
    let getItem = lyricsArray.filter(
      each => each.id === lyricsDisplay[e.newDraggableIndex].props.line.id,
    )
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
        maxHeight={96 - 8}
        list={beatList}
        currentItem={currentBeat}
        setCurrentItem={setCurrentBeat}
        isOpen={showSelectBeatMenu}
        onClose={setShowSelectBeatMenu}
      />

      <div className="section-1_profile-el">
        <h1
          style={{
            position: 'absolute',
            top: '10px',
            left: '30px',
            color: 'white',
            fontSize: '16px',
          }}
        >
          This is A Work In Progress
        </h1>
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
          handle=".move-handle__btn"
          onSort={e => setLyricsArrayHandler(e)}
          delayOnTouchStart={true}
          delay={2}
        >
          {lyricsDisplay}
        </ReactSortable>
        <div className="padding--container"></div>
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
                  <button className="choose-song--shadow-outset">
                    <div className="choose-song-title">Song:</div>
                    <div className="select-songs">
                      <p>{currentSong?.name}</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="options-2_toggle-lyrics">
                <div className="save-reset-btn--container">
                  <button className="save-reset-btn reset">reset</button>
                </div>
                <div className="save-reset-btn--container">
                  <button className="save-reset-btn save">Save</button>
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
