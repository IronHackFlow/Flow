import React, {PropsWithChildren} from 'react'
import { editIcon, helpFilledIcon, selectArrowDownIcon } from '../../assets/images/_icons'

type ActionButtonProps = PropsWithChildren<{
  type: string
  onClick: () => void
  ref?: any
}>

export const ActionButton = ({type, onClick, ref, children}: ActionButtonProps) => {
  let icon = type === 'rhymes' ? selectArrowDownIcon : type === 'tutorial' ? helpFilledIcon : editIcon
  return (
    <div className={`interactions__btn--container ${type}`}>
      <button
        className="interactions__btn--shadow-outset"
        onClick={() => onClick()}
        ref={ref}
      >
        <div className="interactions__btn-icon--container rhyme-num">
          <div className="interactions__btn-icon--shadow-inset">
            <img
              className="button-icons"
              src={icon}
              alt="modal"
            />
          </div>
        </div>
        <div className="interactions__btn-text">
          <p className="interactions__text">{children}</p>
        </div>
      </button>
    </div>
  )
}

