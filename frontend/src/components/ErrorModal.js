import { useState } from 'react'
import xExit from "../images/exit-x-2.svg";

export default function ErrorModal({ showErrorModal, setShowErrorModal }) {
  // slightly blur entire screen
  // take in text to specify the problem
  // option to blur background
  // specify position
  // specify height, width

  return (
    <div 
      className="ErrorModal" 
      style={showErrorModal ? {opacity: "1", zIndex: "2"} : {opacity: "0", zIndex: "0"}}
      onClick={() => setShowErrorModal(false)}    
    >
      <div className="error-container">
        <div className="error_shadow-div-inset">
          <div className="error-icon-container">
            <div className="error-icon_shadow-div-outset">
              <div className="error-icon_shadow-div-inset">
                <button 
                  className="error-icon_shadow-div-outset_2"
                  onClick={() => setShowErrorModal(false)}  
                >
                  <img className="button-icons" src={xExit} alt="error exclamation" />
                </button>
              </div>
            </div>
          </div>
          <div className="error-text-container">
            <div className="error-text_shadow-div-outset">
              <h5>No Songs To Edit</h5>
              <p>Record a Flow below!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
