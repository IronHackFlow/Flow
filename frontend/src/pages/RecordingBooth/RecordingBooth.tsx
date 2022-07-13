import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react'
import ReactDOM from 'react-dom'
import { Beat } from 'src/constants/index'
import { ISongTake } from '../../interfaces/IModels'
import { RecordButton } from '../_RecordPage/Buttons/Record'
import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'
import { RoundButton, BtnColorsEnum } from 'src/components/_Buttons/RoundButton/RoundButton'
import { Suggestions } from './Suggestions'
import useMediaRecorder from './useMediaRecorder'
import LyricsFeed from './LyricsFeed'
import useTranscript from '../_RecordPage/Utils/useTranscript'
import { useAuth } from 'src/contexts/_AuthContext/AuthContext'

export enum RhymeActions {
  Top = 'Top',
  Locked = 'Locked',
  Selected = 'Selected',
}

type Config = {
  selectedBeat: Beat
  numOfRhymes: number
}

type RecordingBoothProps = {
  currentTake: ISongTake
  setCurrentTake: Dispatch<SetStateAction<ISongTake>>
  setSongTakes: Dispatch<SetStateAction<ISongTake[]>>
  config: Config
  isOpen: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

export const RecordingBooth = ({
  currentTake,
  setCurrentTake,
  setSongTakes,
  config,
  isOpen,
  onClose,
}: RecordingBoothProps) => {
  const root = document.getElementById('root')!
  const { user } = useAuth()
  const { recorderState, startRecording, stopRecording, resetRecording } = useMediaRecorder(
    config.selectedBeat.beat,
  )
  const { lyrics } = useTranscript()

  useEffect(() => {
    if (!user) return
    const id = parseInt(currentTake._id) + 1
    if (recorderState.audio !== '' && !recorderState.initRecording) {
      const duration =
        recorderState.recordingMinutes * 60000 + recorderState.recordingSeconds * 1000
      const createTake = {
        _id: `${id}`,
        title: `Take ${id}`,
        blob: recorderState.blob,
        audio: recorderState.audio,
        user: user,
        lyrics: [...lyrics],
        duration: duration,
        caption: '',
      }
      setCurrentTake(createTake)
      setSongTakes(prevTakes => [...prevTakes, createTake])
      resetRecording()
    }
  }, [recorderState.audio, recorderState.initRecording])

  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="Recording">
      <div className="recording__transcript-lyrics">
        <div className="record__transcript--container">
          <div className="record__transcript">
            <div className="recording__header">
              <p className="record__transcript-text"></p>
            </div>
            <div className="recording__close">
              <RoundButton
                type={ButtonTypes.Close}
                btnOptions={{ offset: 8, bgColor: BtnColorsEnum.Primary }}
                iconOptions={{ color: 'White', size: 75 }}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
        <LyricsFeed
          songLyrics={currentTake?.lyrics ? currentTake.lyrics : null}
          isRecording={recorderState.initRecording}
        />
      </div>
      <div className="recording__rhyme-actions">
        <Suggestions>
          <RecordButton
            isRecording={recorderState.initRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </Suggestions>
      </div>
    </div>,
    root,
  )
}
