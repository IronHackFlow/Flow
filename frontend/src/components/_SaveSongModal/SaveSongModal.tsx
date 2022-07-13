import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import { closeIcon } from '../../assets/images/_icons'
import AudioTimeSlider from '../_AudioTimeSlider/AudioTimeSlider'
import { SelectMenu } from '../_Modals/SelectMenu/SelectMenu'
import { LayoutTwo, LayoutThree } from '../__Layout/LayoutWrappers'
import { ISongTake } from 'src/interfaces/IModels'
import { SaveSongForm } from './Displays/SaveSongForm'
import { PlayButton } from '../_Buttons/PlayButton'

type Props = {
  isOpen: boolean
  onClose: Dispatch<SetStateAction<boolean>>
  currentSong: ISongTake
  setCurrentSong: Dispatch<SetStateAction<ISongTake>>
  songTakes: ISongTake[]
}

export default function SaveSongModal({
  isOpen,
  onClose,
  currentSong,
  setCurrentSong,
  songTakes,
}: Props) {
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

  return createPortal(
    <LayoutTwo classes={[`SaveSongModal`, `save-song_modal-container ${transition}`]}>
      <LayoutTwo classes={['save-song_header', 'save-song_header-shadow-inset']}>
        <LayoutTwo classes={['save-song_header-container', 'save-song_header-shadow-outset']}>
          <h1>Save Your Flow</h1>
        </LayoutTwo>

        <LayoutTwo classes={['save-song_btn-container', 'save-song_btn-shadow-div-inset']}>
          <button className="save-song_btn--close" type="button" onClick={() => handleOnClose()}>
            <img className="button-icons" src={closeIcon} alt="exit" />
          </button>
        </LayoutTwo>
      </LayoutTwo>

      <div className="flow-controls-container">
        <div className="flow-controls-1_playback-display">
          <LayoutThree
            classes={[
              'play-btn-container',
              'play-btn-container_shadow-div-outset',
              'play-btn-container_shadow-div-inset',
            ]}
          >
            <PlayButton
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              options={{ offset: 8, margin: '0em 0em 0em 0.35em', flexJC: 'flex-start' }}
            />
          </LayoutThree>

          <LayoutTwo classes={['play-slider-container', 'play-slider-container_shadow-div-outset']}>
            <LayoutTwo
              classes={['play-slider-container_shadow-div-inset', 'play-slider_shadow-div-outset']}
            >
              <AudioTimeSlider
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentSong={currentSong}
                bgColor={''}
              />
            </LayoutTwo>
          </LayoutTwo>
        </div>

        <LayoutThree
          classes={[
            'flow-controls-2_actions',
            'actions-container_shadow-div-outset',
            'actions-container_shadow-div-inset',
          ]}
        >
          <LayoutThree
            classes={[
              'actions-1_flow-takes',
              'flow-takes-1_select-takes',
              'select-takes-container_shadow-div-outset',
            ]}
          >
            <LayoutTwo classes={['select-takes-container', 'select-takes_shadow-div-inset']}>
              <button
                className="select-takes_shadow-div-outset"
                onClick={() => setShowSelectMenu(true)}
              >
                <p>{currentSong?.title ? currentSong?.title : 'No Recorded Flows'}</p>
              </button>

              <SelectMenu
                position={['top', 21.5]}
                maxHeight={96 - 41.5}
                list={songTakes}
                listKey={['_id', 'title']}
                currentItem={currentSong}
                setCurrentItem={setCurrentSong}
                isOpen={showSelectMenu}
                onClose={setShowSelectMenu}
              />
            </LayoutTwo>
          </LayoutThree>

          <SaveSongForm currentSong={currentSong} />
        </LayoutThree>
      </div>
    </LayoutTwo>,
    root,
  )
}
