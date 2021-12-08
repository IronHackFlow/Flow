import React, { useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import xExit from "../images/exit-x-2.svg"

function RecordingBoothModal(props) {
  let modalObjArr = [
    {
      index: 0,
      title: "Welcome to Flow",
      first: ["Let's get started, please hit the next button below"]
    },
    {
      index: 1,
      title: "Flow Controls",
      steps: [
        "Select a Beat",
        "Hit the Record Button",
        "Save your first take"
      ]
    },
    {
      index: 2,
      title: "Rhyme Suggestions",
      steps: [
        "Top Rhymes",
        "Locked Rhymes",
        "Selected Rhymes"
      ]
    },
    {
      index: 3,
      title: "Lyrics Display",
      steps: [
        "Lyrics List",
        "Lyrics Transcript"
      ]
    }
  ]
  const history = useHistory();
  const [modalIndex, setModalIndex] = useState(0);
  const [modalInDisplay, setModalInDisplay] = useState(modalObjArr[1]);

  const modalWindowRef = useRef();

  useEffect(() => {
    if (props.toggleModal === true) {
      modalWindowRef.current.style.zIndex = 2
      modalWindowRef.current.style.opacity = 1
      modalWindowRef.current.style.transition = "opacity .3s"
      props.modalBtnRef.current.style.opacity = 0
      props.modalBtnRef.current.style.transition = "opacity .2s"
    } else {
      modalWindowRef.current.style.opacity = 0
      modalWindowRef.current.style.zIndex = 0
      modalWindowRef.current.style.transition = "opacity .3s"
      props.modalBtnRef.current.style.opacity = 1
      props.modalBtnRef.current.style.transition = "opacity .2s"
    }
  }, [props.toggleModal, props.setToggleModal])

  const showSteps = useCallback(() => {
    console.log(modalInDisplay.steps, "what dis?")
    return modalInDisplay?.steps?.map((each, index) => {
      return (
        <div 
          className="step-containers" 
          key={`${uuidv4()}_${each.title}`}
          style={{ opacity: '1'}}
        >
          <div className="steps_shadow-div-inset">
            {each}
          </div>
        </div>
      )    
    })
  }, [modalInDisplay])

  const getModal = (direction) => {
    modalObjArr.filter((each, index) => {
      console.log(each, "i don't know")
      if (each.index === modalInDisplay.index) {
        if (direction === 'back') {
          if (each.index === 0) {
            console.log("why")
          } else {
            setModalInDisplay(modalObjArr[each.index - 1])
          }
        } else {
          if (each.index === 3) {
            console.log("what")
          } else {
            setModalInDisplay(modalObjArr[each.index + 1])
          }
        }
      }
    })
  }

  return (
    <div className="RecordBoothModal" ref={modalWindowRef}>
      <div className="close-window-container">
        <div className="close-window-btn" onClick={() => props.setToggleModal(false)}>
          <img className="button-icons" src={xExit} alt="exit" />
        </div>
      </div>

      <div className="section-4_controls">
        <div className="section_shadow-div-inset">
          <div className="section_text-container">
            <div className="text-container_shadow-div-outset">
              {showSteps()}
            </div>
          </div>
          <div className="section_next-container">
            <button className="next-back-btn back-btn" onClick={() => getModal('back')}>
              Back
            </button>
            <button className="next-back-btn next-btn" onClick={() => getModal('next')}>
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
export default RecordingBoothModal