import { useContext, useEffect, useState, useRef, useCallback } from "react";
import actions from "../api";
import TheContext from "../contexts/TheContext"
import AudioTimeSlider from "../components/AudioTimeSlider";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import xExit from "../images/exit-x-2.svg";


export default function SaveSongModal({allTakes, currentSong, showSaveSongModal, setShowSaveSongModal, songNameInputRef}) {
  const { user } = useContext(TheContext)
  const [isPlaying, setIsPlaying] = useState(false);
  const [songNameInput, setSongNameInput] = useState();
  const [songCaptionInput, setSongCaptionInput] = useState();
  const songCaptionInputRef = useRef();
  const buttonCloseRef = useRef();
  const saveSongPopUpRef = useRef();
  const [selectedOption, setSelectedOption] = useState();
  const selectTakesRef = useRef();

  const handleSaveSong = (e) => {
    e.preventDefault()
    if (allTakes.length === 0) {
      console.log('You have no Flows to save')
    } else {
      const fileName = user._id + songNameInput.replaceAll(" ", "-")
    //   let takeName = selectedOption.name
      currentSong.caption = songCaptionInput
      currentSong.name = songNameInput
      currentSong.date = new Date()

      // songUploadObject.songName = songNameInput
      // songUploadObject.songCaption = songCaptionInput
      // songUploadObject.songDate = new Date()

      actions
        .uploadFile(
          {
            fileName: fileName,
            fileType: 'audio/mpeg-3',
            file: currentSong.song_URL,
            kind: 'song',
          },
          currentSong,
        )
        .then(res => {
          console.log(res)
        //   setAllTakes(prevTakes => prevTakes.map(each => {
        //     if (each.name === takeName) return currentSong
        //     else return each
        //   }))

        })
        .catch(console.error)
    }
    // setSaveSongMenu(false)
    songNameInputRef.current.value =  ""
    songCaptionInputRef.current.value =  ""
  }
  
  const loadTake = (e) => {
    console.log('allTakes index log:', allTakes[e.target.selectedIndex])
    setSelectedOption(e.target.value)
    songNameInputRef.current.focus()
    // setLoadSelectedTake(allTakes[e.target.selectedIndex])
  };

  const chooseTake = useCallback(() => {
    if (allTakes.length === 0) {
      return <option>Your Takes</option>
    } 
    else {
      return allTakes.map((element, index) => {
        return (
          <option value={element.song_URL} key={`${index}_${element.song_URL}`}>
            {element.name}
          </option>
        )
      })
    }
  }, [allTakes])

  return (
    <div className={`SaveSongModal ${showSaveSongModal ? "SaveSongModal--show" : "SaveSongModal--hide"}`}> 
      <div className={`save-song_modal-container ${showSaveSongModal ? "save-song_modal-container--transition-in" : "save-song_modal-container--transition-out"}`}>
        <div className="save-song_header">
          <div className="save-song_header-shadow-inset">
            <div className="save-song_header-container">
              <div className="save-song_header-shadow-outset">
                <h1>Save Your Flow</h1>
              </div>
            </div>
            <div className="save-song_btn-container">
              <button
                className="save-song_btn"
                ref={buttonCloseRef}
                type="button"
                onClick={() => setShowSaveSongModal(false)}
              >
                <img className="button-icons" src={xExit} alt="exit" />
              </button>
            </div>
          </div>
        </div>

        <div className="flow-controls-container">
          <div className="flow-controls-1_playback-display">
            <div className="play-btn-container">
              <div className="play-btn-container_shadow-div-outset">
                <div className="play-btn-container_shadow-div-inset">
                  <button
                    className={`play-btn_shadow-div-outset ${isPlaying ? "pause" : "play"}`}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <img
                      className={`button-icons ${isPlaying ? "bi-pause" : "bi-play"}`}
                      id="play-stop-img"
                      src={isPlaying ? pause : play}
                      alt="play or pause icon"
                    />
                  </button>
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
                      // currentSong={songUploadObject}
                      // location={recordingBooth}
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
                </div>

                <div className="SaveSongDisplay" ref={saveSongPopUpRef}>
                  <form className="song-inputs-container" onSubmit={(e) => handleSaveSong(e)}>
                    <div className="section-title">
                        Upload A Take
                    </div>

                    <div className="section-inputs">
                      <div className="section-1_song-name">
                        <input
                          className="song-name-input"
                          ref={songNameInputRef}
                          type="text"
                          placeholder="Name this flow.."
                          onChange={(e) => setSongNameInput(e.target.value)}
                        />
                      </div>

                      <div className="section-2_song-caption">
                        <input
                          className="song-caption-input"
                          ref={songCaptionInputRef}
                          type="text"
                          placeholder="Caption this flow.."
                          onChange={e => setSongCaptionInput(e.target.value)}
                        />
                      </div>  
                    </div>

                    <div className="buttons-container">
                      <div className="buttons-container_shadow-div-inset">
                        <button className="save-song-button" type="submit">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
