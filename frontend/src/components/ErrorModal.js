import React from 'react'
import ReactDOM from 'react-dom'
import xExit from "../images/exit-x-2.svg";
import errorExclamation from "../images/error-exclamation-fill.svg";

export default function ErrorModal({ 
  isOpen, onClose, 
  title, nextActions,
  opacity, modHeight, modWidth, 
  placement, children, 
}) 
{
  if (!isOpen) return null
  else {
    setTimeout(() => {
      onClose(false)
    }, 3000)
  }

  const bgSpecs = { 
    background: opacity ? "#0000006e" : "#00000000",
    opacity: `${isOpen ? "1" : "0"}`,
    zIndex: `${isOpen ? "3" : "0"}`,
  } 
  const modalSpecs = {
    top: `${placement}%`,
    width: `${modWidth}%`,
    height: `${modHeight}px`
  }

  return ReactDOM.createPortal(
    <div 
      className="ErrorModal" 
      style={bgSpecs}
      onClick={() => onClose(false)}    
    >
      <div 
        className="error-container--red"
        style={modalSpecs}
      >
        <div className="error--shadow-inset">
          <div className="icon-container">
            {/* <div className="error-icon_shadow-div-outset">
              <div className="error-icon_shadow-div-inset"> */}
                <button 
                  className="icon--shadow-outset"
                  onClick={() => onClose(false)}  
                >
                  <img className="button-icons" src={xExit} alt="exit x button" />
                </button>
              {/* </div>
            </div> */}
          </div>
          <div className="text-container">
            <div className="text--shadow-outset">
              <div className="text-err-icon-container">
                <div className="text-err-icon--shadow-inset">
                  <img className="button-icons" src={errorExclamation} alt="error exclamation" />
                </div>
              </div>

              <div className="text-err-container">
                <h6>{title}</h6>
                <p>{nextActions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>,
    document.body
  )
}
// export default function ErrorModal({ showErrorModal, setShowErrorModal }) {
//   // slightly blur entire screen
//   // take in text to specify the problem
//   // option to blur background
//   // specify position
//   // specify height, width

//   return (
//     <div 
//       className="ErrorModal" 
//       style={showErrorModal ? {opacity: "1", zIndex: "2"} : {opacity: "0", zIndex: "0"}}
//       onClick={() => setShowErrorModal(false)}    
//     >
//       <div className="error-container--red">
//         <div className="error--shadow-inset">
//           <div className="icon-container">
//             {/* <div className="error-icon_shadow-div-outset">
//               <div className="error-icon_shadow-div-inset"> */}
//                 <button 
//                   className="icon--shadow-outset"
//                   onClick={() => setShowErrorModal(false)}  
//                 >
//                   <img className="button-icons" src={xExit} alt="error exclamation" />
//                 </button>
//               {/* </div>
//             </div> */}
//           </div>
//           <div className="text-container">
//             <div className="text--shadow-outset">
//               <h6>No Songs To Edit</h6>
//               <p>Record a Flow below!</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
{/* <div className="error-container">
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
</div> */}


