import { RoundButton, BtnColorsEnum } from 'src/components/_Buttons/RoundButton/RoundButton'
import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'

type DeleteSongProps = {
  onDelete: () => void
}

export const DeleteSong = ({ onDelete }: DeleteSongProps) => {
  return (
    <div className="actions-btn-container">
      <RoundButton
        type={ButtonTypes.Close}
        btnOptions={{
          bgColor: BtnColorsEnum.Initial,
          inset: [true, '4px'],
          offset: 10,
        }}
        iconOptions={{ color: 'Primary' }}
        onClick={onDelete}
      />
    </div>
  )
}
