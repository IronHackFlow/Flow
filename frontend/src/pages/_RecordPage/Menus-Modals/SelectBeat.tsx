import { useState, Dispatch, SetStateAction } from 'react'
import { beatList, Beat } from 'src/constants/index'
import { PlayButton } from 'src/components/_Buttons/PlayButton'
import { SelectMenu } from 'src/components/_Modals/SelectMenu/SelectMenu'

type BeatProps = {
  beat: Beat
  setBeat: Dispatch<SetStateAction<Beat>>
}

export const SelectBeat = ({ beat, setBeat }: BeatProps) => {
  const [isBeatPlaying, setIsBeatPlaying] = useState<boolean>(false)
  const [showSelectBeatMenu, setShowSelectBeatMenu] = useState<boolean>(false)

  return (
    <div className="select-beat_shadow-div-inset">
      <SelectMenu
        position={['bottom', 20]}
        maxHeight={96 - 20}
        list={beatList}
        listKey={['index', 'title']}
        currentItem={beat}
        setCurrentItem={setBeat}
        isOpen={showSelectBeatMenu}
        onClose={setShowSelectBeatMenu}
      />
      <div className="select-beat_container">
        <button className="select-beat_shadow-div-outset">
          <div className="select-beat-title">Beat :</div>
          <div className="track-select" onClick={() => setShowSelectBeatMenu(true)}>
            {beat?.title}
          </div>
        </button>
      </div>
      <div className="select-beat_play-container">
        <PlayButton
          isPlaying={isBeatPlaying}
          setIsPlaying={setIsBeatPlaying}
          options={{ margin: '0em 0.3em 0em 0em', flexJC: 'flex-end' }}
          audio={beat?.beat}
        />
      </div>
    </div>
  )
}
