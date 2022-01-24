import { useContext, useEffect, useState, useRef, useCallback } from "react";
import actions from "../api";
import axios from "axios";
import TheContext from "../contexts/TheContext"
import RecordBoothContext from "../contexts/RecordBoothContext"
import AudioTimeSlider from "../components/AudioTimeSlider";
import SelectMenuModal from "../components/SelectMenuModal";
import ErrorModal from "./ErrorModal"
import ButtonClearText from "../components/ButtonClearText";
import useDebugInformation from "../utils/useDebugInformation"
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import xExit from "../images/exit-x-2.svg";


export default function SaveSongModal(props) {
  const { user } = useContext(TheContext)
  const { 
    currentSong, setCurrentSong, 
    showSaveSongModal, setShowSaveSongModal 
  } = useContext(RecordBoothContext)

  const [isPlaying, setIsPlaying] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [nameRequired, setNameRequired] = useState(false)
  const [showSelectMenu, setShowSelectMenu] = useState(false)

  const songCaptionInputRef = useRef();
  const songNameInputRef = useRef()
  const buttonCloseRef = useRef();
  const saveSongPopUpRef = useRef();
  const selectTakesRef = useRef();


  useEffect(() => {
    if (showSaveSongModal) {
      songNameInputRef.current.focus()
    } else {
      songNameInputRef.current.value = ""
      songCaptionInputRef.current.value = ""
    }
  }, [showSaveSongModal])

  useEffect(() => {
    if (showErrorModal) {
      setNameRequired(true)
      songNameInputRef.current.focus()
    } else {
      songNameInputRef.current.focus()
      setNameRequired(false)
    }
  }, [showErrorModal])
  
  
  const onErrorModalClose = () => {
    setShowErrorModal(false)
    setNameRequired(false)
    songNameInputRef.current.focus()
  }
  
  const handleInputChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setCurrentSong({
      ...currentSong,
      [name]: value
    })
  }

  const handleSaveSong = async (e) => {
    e.preventDefault()
    if (!songNameInputRef.current.value) {
      setShowErrorModal(true)
    } else {
      const fileName = user?._id + currentSong.name.replaceAll(" ", "-")
      const fileType = "audio/mpeg-3"
      const file = currentSong.blob

      actions
        .getSignedS3({fileName: fileName, fileType: fileType})
          .then(async res => {
            console.log(res.data)
            if (res.data.success) {
              const signedURL = res.data.signedRequest.signed_URL
              const awsURL = res.data.signedRequest.aws_URL
              const options = {
                headers: {
                  'Content-Type': "audio/mpeg-3"
                }
              }

              return axios.put(signedURL, file, options)
                .then(res => {
                  actions
                    .addSong({currentSong, awsURL})
                      .then(res => {
                        if (res.data.success) {
                          console.log(res.data.song, res.data.message)
                          setShowSaveSongModal(false)
                        }
                      })
                      .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            }
          })
          .catch(err => console.log(err))
          .finally(() => {
            songNameInputRef.current.value =  ""
            songCaptionInputRef.current.value =  ""
          })
    }
  }
  
  return (
    <div className={`SaveSongModal ${showSaveSongModal ? "SaveSongModal--show" : "SaveSongModal--hide"}`}> 
      <div className={`save-song_modal-container ${showSaveSongModal ? "save-song_modal-container--transition-in" : "save-song_modal-container--transition-out"}`}>
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={onErrorModalClose} 
        title={"Name is Required"}
        nextActions={"Please add a name to save"}
        opacity={false}
        modHeight={50}
        modWidth={81}
        placement={25.5}
      />
        <div className="save-song_header">
          <div className="save-song_header-shadow-inset">
            <div className="save-song_header-container">
              <div className="save-song_header-shadow-outset">
                <h1>Save Your Flow</h1>
              </div>
            </div>
            <div className="save-song_btn-container">
              <button
                className="save-song_btn--close"
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
                      currentSong={currentSong}
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
                          <div 
                            className="select-takes_shadow-div-outset" 
                            ref={selectTakesRef}
                            onClick={() => setShowSelectMenu(true)}
                          >
                            <p>{currentSong?.name}</p>
                          </div>

                          <SelectMenuModal 
                            type={"song"}
                            positionTop={true}
                            positionY={41.5}
                            isOpen={showSelectMenu}
                            onClose={setShowSelectMenu}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="SaveSongDisplay" ref={saveSongPopUpRef}>
                  <form className="song-inputs-container" onSubmit={(e) => handleSaveSong(e)}>
                    <div className="section-title">
                      <h2>Upload Your Flow</h2>
                    </div>

                    <div className="section-inputs">
                      <div className="input-container">
                        <div className="input-field-container">
                          <input
                            className={`input-field ${nameRequired ? "required" : ""}`}
                            ref={songNameInputRef}
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="off"
                            onChange={handleInputChange}
                          />
                        </div>

                        <ButtonClearText 
                          containerWidth={19} 
                          inset={true} 
                          inputRef={songNameInputRef}
                        />
                      </div>

                      <div className="input-container">
                        <div className="input-field-container">
                          <input
                            className="input-field"
                            ref={songCaptionInputRef}
                            type="text"
                            name="caption"
                            placeholder="Caption"
                            autoComplete="off"
                            onChange={handleInputChange}
                          />
                        </div>

                        <ButtonClearText 
                          containerWidth={19} 
                          inset={true} 
                          inputRef={songCaptionInputRef}
                        />
                      </div>  
                    </div>

                    <div className="buttons-container">
                      <div className="buttons-container_shadow-div-inset">
                        <button className="save-song-button--submit" type="submit">
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
