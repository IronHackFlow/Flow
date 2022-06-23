import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import actions from '../api'
import axios from 'axios'
import { UserContext } from '../contexts/AuthContext'
import RecordBoothContext from '../contexts/RecordBoothContext'
import AudioTimeSlider from './AudioTimeSlider'
import SelectMenuModal from './SelectMenuModal'
import { saveSongSchema } from '../utils/validationSchemas'
import InputError from './InputError'
import ButtonClearText from './ButtonClearText'
import useDebugInformation from '../utils/useDebugInformation'
import { playIcon, pauseIcon, closeIcon } from '../assets/images/_icons'
import { FormEvent } from 'react'
import { LayoutTwo, LayoutThree } from './__Layout/LayoutWrappers'

export default function SaveSongModal() {
  const { user } = useContext(UserContext)
  const {
    allTakes,
    setAllTakes,
    currentSong,
    setCurrentSong,
    showSaveSongModal,
    setShowSaveSongModal,
  } = useContext(RecordBoothContext)

  const [isPlaying, setIsPlaying] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showSelectMenu, setShowSelectMenu] = useState(false)
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorPath, setErrorPath] = useState('')

  const songCaptionInputRef = useRef < HTMLInputElement > null
  const songNameInputRef = useRef < HTMLInputElement > null
  // const buttonCloseRef = useRef()
  // const saveSongPopUpRef = useRef()

  useEffect(() => {
    if (showSaveSongModal) {
      songNameInputRef.current?.focus()
    } else {
      setErrorPath('')
      setName('')
      setCaption('')
      songNameInputRef.current?.blur()
    }
  }, [showSaveSongModal])

  const handleErrorFocus = errorPath => {
    let name = songNameInputRef.current
    let caption = songCaptionInputRef.current
    if (errorPath === 'name') name?.focus()
    else caption?.focus()
  }

  const validateInputs = e => {
    e.preventDefault()
    const songData = { name: name, caption: caption }
    saveSongSchema
      .validate(songData, { abortEarly: false })
      .then(valid => {
        setShowError(false)
        setErrorPath('')
        handleSaveSong()
      })
      .catch(err => {
        handleErrorFocus(err.inner[0].path)
        setErrorPath(err.inner[0].path)
        setErrorMessage(err.errors[0])
        setShowError(true)
      })
  }

  const handleSaveSong = async () => {
    let currentName = currentSong.name
    currentSong.name = name
    currentSong.caption = caption
    const fileName = user?._id + currentSong.name.replaceAll(' ', '-')
    const fileType = 'audio/mpeg-3'
    const file = currentSong.blob

    actions
      .getSignedS3({ fileName: fileName, fileType: fileType })
      .then(async res => {
        console.log(res.data)
        if (res.data.success) {
          const signedURL = res.data.signedRequest.signed_URL
          const awsURL = res.data.signedRequest.aws_URL
          const options = {
            headers: {
              'Content-Type': 'audio/mpeg-3',
            },
          }
          return axios
            .put(signedURL, file, options)
            .then(res => {
              actions
                .addSong({ currentSong, awsURL })
                .then(res => {
                  if (res.data.success) {
                    console.log(res.data.song, res.data.message)
                    setAllTakes(prevTakes =>
                      prevTakes.map(each => {
                        if (each.name === currentName) {
                          return {
                            ...each,
                            name: currentSong.name,
                            caption: currentSong.caption,
                          }
                        } else {
                          return each
                        }
                      }),
                    )
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
        setName('')
        setCaption('')
      })
  }

  return (
    <div
      className={`SaveSongModal ${
        showSaveSongModal ? 'SaveSongModal--show' : 'SaveSongModal--hide'
      }`}
    >
      <div
        className={`save-song_modal-container ${
          showSaveSongModal
            ? 'save-song_modal-container--transition-in'
            : 'save-song_modal-container--transition-out'
        }`}
      >
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
                // ref={buttonCloseRef}
                type="button"
                onClick={() => {
                  setShowError(false)
                  setShowSaveSongModal(false)
                }}
              >
                <img className="button-icons" src={closeIcon} alt="exit" />
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
                    className={`play-btn_shadow-div-outset ${isPlaying ? 'pause' : 'play'}`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <img
                      className={`button-icons ${isPlaying ? 'bi-pause' : 'bi-play'}`}
                      id="play-stop-img"
                      src={isPlaying ? pauseIcon : playIcon}
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
                      bgColor={''}
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
                          <button
                            className="select-takes_shadow-div-outset"
                            onClick={() => setShowSelectMenu(true)}
                          >
                            <p>{currentSong?.name}</p>
                          </button>

                          <SelectMenuModal
                            positionTop={true}
                            positionY={41.5}
                            maxHeight={96 - 41.5}
                            list={allTakes}
                            currentItem={currentSong}
                            setCurrentItem={setCurrentSong}
                            isOpen={showSelectMenu}
                            onClose={setShowSelectMenu}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="SaveSongDisplay">
                  <InputError
                    isOpen={showError}
                    onClose={setShowError}
                    message={errorMessage}
                    modHeight={45}
                    modWidth={78}
                    top={23}
                    left={10}
                  />
                  <form className="song-inputs-container" onSubmit={e => validateInputs(e)}>
                    <div className="section-title">
                      <h2>Upload Your Flow</h2>
                    </div>

                    <div className="section-inputs">
                      <div className="input-container">
                        <div className="input-field-container">
                          <input
                            className="input-field"
                            style={errorPath === 'name' ? { border: '3px solid #ff6e6e' } : {}}
                            ref={songNameInputRef}
                            type="text"
                            name="name"
                            placeholder="Name"
                            autoComplete="off"
                            value={name}
                            onChange={e => setName(e.target.value)}
                          />
                        </div>

                        <ButtonClearText
                          // containerWidth={19}
                          inset={true}
                          shadowColors={['#282828', '#bcbaba', '#282828', '#a7a7a7']}
                          // inputRef={songNameInputRef}
                          value={name}
                          setValue={setName}
                        />
                      </div>

                      <div className="input-container">
                        <div className="input-field-container">
                          <input
                            className="input-field"
                            style={errorPath === 'caption' ? { border: '3px solid #ff6e6e' } : {}}
                            ref={songCaptionInputRef}
                            type="text"
                            name="caption"
                            placeholder="Caption"
                            autoComplete="off"
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                          />
                        </div>

                        <ButtonClearText
                          inset={true}
                          shadowColors={['#282828', '#bcbaba', '#282828', '#a7a7a7']}
                          // inputRef={songCaptionInputRef}
                          value={caption}
                          setValue={setCaption}
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
