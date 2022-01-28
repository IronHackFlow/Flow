import React from 'react';
import ReactDOM from 'react-dom';
import errorExclamation from "../images/error-exclamation-fill.svg";

export default function InputError({
    isOpen, onClose, 
    message,
    top, left, modHeight, modWidth, 
    children
}) {
  if (!isOpen) return null

  const modalSpecs = {
    top: `${top}%`,
    left: `${left}%`,
    width: `${modWidth}%`,
    height: `${modHeight}px`,
    zIndex: "3"
  }

  return ReactDOM.createPortal(
    <div className="error-container--input-err" style={modalSpecs}>
      <div className="error--shadow-inset">
        <div className="icon-container">
          <button 
            className="icon--shadow-outset"
            onClick={() => onClose()}  
          >
            <img className="button-icons" src={errorExclamation} alt="exit x button" />
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