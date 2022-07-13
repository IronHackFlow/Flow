import { Dispatch, SetStateAction, useState } from 'react'
import SaveSongModal from 'src/components/_SaveSongModal/SaveSongModal'
import { RoundButton } from 'src/components/_Buttons/RoundButton/RoundButton'
import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'
import { BtnColorsEnum } from 'src/components/_Buttons/RoundButton/RoundButton'
import { ISongTake } from 'src/interfaces/IModels'
import InputError from 'src/components/Errors/InputError'

type SaveSongButtonProps = {
  currentTake: ISongTake
  setCurrentTake: Dispatch<SetStateAction<ISongTake>>
  songTakes: ISongTake[]
}

export const SaveSong = ({ currentTake, setCurrentTake, songTakes }: SaveSongButtonProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  return (
    <div className="actions-btn-container">
      <SaveSongModal
        isOpen={showMenu}
        onClose={setShowMenu}
        currentSong={currentTake}
        setCurrentSong={setCurrentTake}
        songTakes={songTakes}
      />
      <InputError
        isOpen={showError}
        onClose={setShowError}
        message={'No Recorded Takes to Save'}
        options={{ position: [0.5, 0], size: [56, 99] }}
      />
      <RoundButton
        type={ButtonTypes.Save}
        btnOptions={{
          inset: [true, '4px'],
          offset: 10,
          bgColor: BtnColorsEnum.Primary,
        }}
        iconOptions={{ color: 'White', size: 75 }}
        onClick={() => setShowMenu(true)}
      />
    </div>
  )
}
