import React, { useEffect, useRef, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import { beatList, Beat, rhymeNumberList } from 'src/constants/index'
import Navbar from '../../components/_Navbar/Navbar'
import { ActionButton } from './ActionButtons'
import { PlayButton } from '../../components/_Buttons/PlayButton'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { ISongTake } from '../../interfaces/IModels'
import { SelectBeat, SelectSong, SelectNumberOfRhymesButton, Tutorial } from './Menus-Modals/_index'
import { RecordingBooth } from '../RecordingBooth/RecordingBooth'
import LyricsFeed from '../RecordingBooth/LyricsFeed'
import { SaveSong, DeleteSong } from './Buttons/_index'
import { tempMockUser } from '../_Home/initialData'

export default function RecordPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const INITIAL_TAKE = {
    _id: '0',
    title: '',
    user: user ? user : tempMockUser,
    blob: null,
    audio: '',
    lyrics: [],
    duration: 0,
    caption: '',
  }

  const [songTakes, setSongTakes] = useState<ISongTake[]>([])
  const [currentTake, setCurrentTake] = useState<ISongTake>(INITIAL_TAKE)
  const [currentBeat, setCurrentBeat] = useState<Beat>(beatList[0])
  const [numberOfRhymes, setNumberOfRhymes] = useState(rhymeNumberList[4])
  const [showRecordingBooth, setShowRecordingBooth] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const navigateToEditLyrics = () => {
    navigate('/editLyrics', {
      state: {
        allSongs: songTakes,
        currentSong: currentTake,
      },
    })
  }

  const handleDeleteTake = useCallback(() => {
    let newTakes = songTakes.filter((each, index) => {
      if (each.title === currentTake.title) {
        if (songTakes[index - 1] == null) setCurrentTake(songTakes[index + 1])
        else setCurrentTake(songTakes[index - 1])
      } else {
        return each
      }
    })
    setSongTakes(newTakes)
  }, [])

  return (
    <div className="Record">
      <RecordingBooth
        currentTake={currentTake}
        setCurrentTake={setCurrentTake}
        setSongTakes={setSongTakes}
        config={{ selectedBeat: currentBeat, numOfRhymes: numberOfRhymes.number }}
        isOpen={showRecordingBooth}
        onClose={setShowRecordingBooth}
      />

      <LyricsFeed songLyrics={currentTake.lyrics} isRecording={isPlaying} />

      <div className="record__rhyme-actions">
        <div className="rhyme-actions">
          <LayoutTwo
            classes={['rhyme-actions__bar continuous-rhymes', 'rhyme-actions__action-rhyme']}
          ></LayoutTwo>

          {/* <RhymeActionBar
            type={RhymeActions.Top}
            focusBorder={focusBorder}
            isRecording={recorderState?.initRecording}
            suggestionsInitialPrompt={'Click record button below and spit bars to get rhymes here.'}
          />
          <RhymeActionBar
            type={RhymeActions.Locked}
            focusBorder={focusBorder}
            isRecording={recorderState?.initRecording}
            suggestionsInitialPrompt={'Click lock button to the right to save above rhymes here.'}
          />
          <RhymeActionBar
            type={RhymeActions.Selected}
            focusBorder={focusBorder}
            isRecording={recorderState?.initRecording}
            suggestionsInitialPrompt={'Click any Flowed word above to generate rhymes here.'}
          /> */}

          <LayoutTwo
            classes={['interactions__options--container', 'interactions__options--shadow-inset']}
          >
            <SelectNumberOfRhymesButton
              rhymeNumber={numberOfRhymes}
              setRhymeNumber={setNumberOfRhymes}
            />
            <Tutorial />

            <ActionButton type="editLyrics" onClick={navigateToEditLyrics}>
              edit lyrics
            </ActionButton>
          </LayoutTwo>
        </div>

        <div className="section-2b_flow-controls">
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
                  options={{ offset: 8, margin: '0em 0em 0em 0.4em', flexJC: 'flex-start' }}
                />
              </LayoutThree>

              <LayoutTwo
                classes={['play-slider-container', 'play-slider-container_shadow-div-outset']}
              >
                <LayoutTwo
                  classes={[
                    'play-slider-container_shadow-div-inset',
                    'play-slider_shadow-div-outset',
                  ]}
                >
                  <AudioTimeSlider
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentSong={currentTake}
                    bgColor={'#474747'}
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
              <div className="actions-1_flow-takes">
                <LayoutThree
                  classes={[
                    'flow-takes-1_select-takes',
                    'select-takes-container_shadow-div-outset',
                    'select-takes-container',
                  ]}
                >
                  <SelectSong songTakes={songTakes} take={currentTake} setTake={setCurrentTake} />
                </LayoutThree>

                <LayoutTwo classes={['flow-takes-2_takes-actions', 'takes-actions-container']}>
                  <SaveSong
                    currentTake={currentTake}
                    setCurrentTake={setCurrentTake}
                    songTakes={songTakes}
                  />

                  <DeleteSong onDelete={handleDeleteTake} />
                </LayoutTwo>
              </div>

              <LayoutTwo classes={['actions-2_record', 'record-container']}>
                <div className="record-1_select-beat">
                  <SelectBeat beat={currentBeat} setBeat={setCurrentBeat} />
                </div>
                <div className="record-1_record-btn--container">
                  <div className="record-1_record-btn--bs-inset">
                    <button
                      className="record-1_record-btn"
                      onClick={() => setShowRecordingBooth(true)}
                    >
                      Record
                    </button>
                  </div>
                </div>
              </LayoutTwo>
            </LayoutThree>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}
