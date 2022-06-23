import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import ReactDOM from 'react-dom'
import { closeIcon } from '../../assets/images/_icons'
import AudioTimeSlider from '../_AudioTimeSlider/AudioTimeSlider'
import SelectMenuModal from '../SelectMenuModal'
import { LayoutTwo, LayoutThree } from '../__Layout/LayoutWrappers'
import { ISongUpload } from '../../pages/_Record/Record'
import { Form } from './Displays/Form'
import { PlayButton } from '../_Buttons/PlayButton'

type Props = {
  isOpen: boolean
  onClose: Dispatch<SetStateAction<boolean>>
  currentSong: ISongUpload
  setCurrentSong: Dispatch<SetStateAction<ISongUpload>>
  songTakes: ISongUpload[]
}

export default function SaveSongModal({isOpen, onClose, currentSong, setCurrentSong, songTakes}: Props) {
  const root = document.getElementById('root')!
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showSelectMenu, setShowSelectMenu] = useState<boolean>(false)
  const [transition, setTransition] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setTransition('transition-in')
      }, 220)
    }
    return () => setTransition('')
  }, [isOpen])

  const handleOnClose = () => {
    setTransition('transition-out')
    setTimeout(() => {
      onClose(false)
    }, 400)
  }
  
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <LayoutTwo classes={[`SaveSongModal`, `save-song_modal-container ${transition}`]}>
      <LayoutTwo classes={["save-song_header", "save-song_header-shadow-inset"]}>
        <LayoutTwo classes={["save-song_header-container", "save-song_header-shadow-outset"]}>
          <h1>Save Your Flow</h1>
        </LayoutTwo>
        <div className="save-song_btn-container">
          <button
            className="save-song_btn--close"
            type="button"
            onClick={() => handleOnClose()}
            >
            <img className="button-icons" src={closeIcon} alt="exit" />
          </button>
        </div>
      </LayoutTwo>

      <div className="flow-controls-container">
        <div className="flow-controls-1_playback-display">
          <LayoutThree classes={["play-btn-container", "play-btn-container_shadow-div-outset", "play-btn-container_shadow-div-inset"]}>
            <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </LayoutThree>

          <LayoutTwo classes={["play-slider-container", "play-slider-container_shadow-div-outset"]}>
            <LayoutTwo classes={["play-slider-container_shadow-div-inset", "play-slider_shadow-div-outset"]}>
              <AudioTimeSlider
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentSong={currentSong}
                bgColor={""}
                />
            </LayoutTwo>
          </LayoutTwo>
        </div>

        <LayoutThree classes={["flow-controls-2_actions", "actions-container_shadow-div-outset", "actions-container_shadow-div-inset"]}>
          <LayoutThree classes={["actions-1_flow-takes", "flow-takes-1_select-takes", "select-takes-container_shadow-div-outset"]}>
            <LayoutTwo classes={["select-takes-container", "select-takes_shadow-div-inset"]}>
              <button
                className="select-takes_shadow-div-outset"
                onClick={() => setShowSelectMenu(true)}
                >
                <p>{currentSong?.title}</p>
              </button>

              <SelectMenuModal
                positionTop={true}
                positionY={41.5}
                maxHeight={96 - 41.5}
                list={songTakes}
                currentItem={currentSong}
                setCurrentItem={setCurrentSong}
                isOpen={showSelectMenu}
                onClose={setShowSelectMenu}
              />
            </LayoutTwo>                      
          </LayoutThree>

          <Form currentSong={currentSong} />
        </LayoutThree>
      </div>
    </LayoutTwo>
    , root
  )
}
