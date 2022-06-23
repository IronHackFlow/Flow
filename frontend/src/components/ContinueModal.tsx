import { Dispatch, SetStateAction } from 'react'
import ReactDOM from 'react-dom'

type Props = {
  title: string,
  text: string,
  btnText?: string,
  isOpen: boolean,
  onClose: Dispatch<SetStateAction<boolean>>,
  onExit: () => void,
}

export default function ContinueModal({
  title,
  text,
  btnText = 'Discard',
  isOpen,
  onClose,
  onExit,
}: Props) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="ContinueModal" onClick={() => onClose(false)}>
      <div className="continue--container">
        <div className="continue--shadow-inset">
          <div className="continue__header--container">
            <div className="continue__header--shadow-outset">
              <h3 className="continue__title">{title}</h3>
              <p className="continue__text">{text}</p>
            </div>
          </div>

          <div className="continue__btns--container">
            <div className="continue__cancel--container">
              <button
                className="continue__cancel--shadow-outset"
                type="button"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>

            <div className="continue__exit--container">
              <button
                className="continue__exit--shadow-outset"
                type="button"
                onClick={() => {
                  onExit()
                }}
              >
                {btnText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
