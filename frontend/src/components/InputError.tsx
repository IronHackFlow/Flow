import React, { Dispatch, SetStateAction, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import { errorIcon } from "../assets/images/_icons"

type Props = PropsWithChildren<{
  isOpen: boolean,
  onClose: Dispatch<SetStateAction<boolean>>,
  message: string,
  top: number,
  left: number,
  modHeight: number,
  modWidth: number,
}>

export default function InputError({
    isOpen, onClose, 
    message,
    top, left, modHeight, modWidth, 
    children
}: Props) {
  if (!isOpen) return null

  const modalSpecs = {
    top: `${top}%`,
    left: `${left}%`,
    width: `${modWidth}%`,
    height: `${modHeight}px`,
    zIndex: 6
  }

  return ReactDOM.createPortal(
    <div className="error-container--input-err" style={modalSpecs}>
      <div className="error--shadow-inset">
        <div className="icon-container">
          <button 
            className="icon--shadow-outset"
            onClick={() => onClose(false)}  
          >
            <img className="button-icons" src={errorIcon} alt="exit x button" />
          </button>
        </div>

        <div className="text-container">
          <div className="text--shadow-outset">
            <div className="text-err-container">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>,
    document.body
  )
}