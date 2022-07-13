import { RoundButton, BtnColorsEnum } from 'src/components/_Buttons/RoundButton/RoundButton'
import { ButtonTypes } from 'src/components/_Buttons/Icon/Icon'

type RecordButtonProps = {
  // focusBorder: number
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => void
}

export const RecordButton = ({
  // focusBorder,
  isRecording,
  startRecording,
  stopRecording,
}: RecordButtonProps) => {
  return (
    <>
      <div className={`record-2_record-btn`}>
        <div className="record-btn_shadow-div-inset">
          {isRecording ? (
            <div className="record-btn_shadow-div-outset" onClick={() => stopRecording()}>
              <RoundButton
                type={ButtonTypes.Stop}
                btnOptions={{ offset: 3, bgColor: BtnColorsEnum.Secondary }}
                iconOptions={{ color: 'Primary' }}
              />
            </div>
          ) : (
            <div className="record-btn_shadow-div-outset" onClick={() => startRecording()}>
              <RoundButton
                type={ButtonTypes.Record}
                btnOptions={{ offset: 3, bgColor: BtnColorsEnum.Secondary }}
                iconOptions={{ color: 'Primary', size: 70 }}
              />
            </div>
          )}
          <div
            className={`record-2_record-btn--animation-div ${
              isRecording ? 'record-btn-animation' : ''
            }`}
          ></div>
        </div>
      </div>
    </>
  )
}
