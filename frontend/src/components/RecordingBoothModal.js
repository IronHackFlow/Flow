import React, { useState, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import xExit from "../images/exit-x-2.svg"

function RecordingBoothModal(props) {
  let modalObjArr = [
    {
      index: 0,
      title: "Welcome to Flow",
      steps: [
        { step: "Let's get started, please hit the next button below", show: true }
      ]
    },
    {
      index: 1,
      title: "Flow Controls",
      steps: [
        { step: "Select a Beat", show: true },
        { step: "Hit the Record Button", show: false },
        { step: "Save your first take", show: false }
      ]
    },
    {
      index: 2,
      title: "Rhyme Suggestions",
      steps: [
        { step: "Top Rhymes", show: true },
        { step: "Locked Rhymes", show: false },
        { step: "Selected Rhymes", show: false }
      ]
    },
    {
      index: 3,
      title: "Lyrics Display",
      steps: [
        { step: "Lyrics List", show: true },
        { step: "Lyrics Transcript", show: false }
      ]
    }
  ]
  const history = useHistory();
  const [modalIndex, setModalIndex] = useState(0);
  const [modalInDisplay, setModalInDisplay] = useState(modalObjArr[0]);

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

  const stepRef = useRef();

  const [modalSteps, setModalSteps] = useState(modalObjArr[0].steps);
  const [currentStep, setCurrentStep] = useState(modalSteps[0].step);
  const [opacityTracker, setOpacityTracker] = useState({current: currentStep, show: true });

  const mapSteps = useCallback(() => {
    return modalInDisplay?.steps.map((each, index) => {
      return (
        <div 
          id={each.step}
          className="step-containers" 
          key={`${uuidv4()}_${each[index]}`}
          style={(index === 0 || each === opacityTracker.current) ? { opacity: '1' } : {}}
        >
          <div className="steps_shadow-div-inset">
            {each.step}
          </div>
        </div>
      )    
    })
  }, [modalInDisplay, opacityTracker])

  const showStepsHandler = (direction) => {
    console.log(currentStep, modalSteps, "ok what??")
    modalSteps.filter((each, index) => {
      if (each.step === currentStep) {
        if (direction === 'back') {
          if ((index - 1) !== null) {
            console.log("BACK INSIDE CALLED", each, index)
            setCurrentStep(modalSteps[index - 1].step)
          }
        } else {
          if ((index + 1) !== null) {
            console.log("FORWARD INSIDE CALLED", each, index)
            setCurrentStep(modalSteps[index + 1].step)
          }
        }
      }
    })
  }

  useEffect(() => {
    setOpacityTracker({ current: currentStep, show: true })
    console.log(currentStep, "what")
  }, [currentStep])

  const getModal = (direction) => {
    console.log(currentStep, modalSteps, "yoyoyo")
    modalObjArr.filter((each) => {
      if (each.index === modalInDisplay.index) {
        if (direction === 'back') {

          if (modalSteps[0].step !== currentStep) {
            console.log("BACK YOYO I WAS CALLED", currentStep)
            showStepsHandler(direction)
          }
          else if (each.index !== 0) {
            setModalInDisplay(modalObjArr[each.index - 1])
            setModalSteps(modalObjArr[each.index - 1].steps)
            setCurrentStep(modalObjArr[each.index - 1].steps[0].step)
          } 
        } else {
          if (modalSteps[modalSteps.length -1].step !== currentStep) {
            console.log("FORWARD YOYO I WAS CALLED", currentStep)
            showStepsHandler(direction)
          }
          else if (each.index !== 3) {
            setModalInDisplay(modalObjArr[each.index + 1])
            setModalSteps(modalObjArr[each.index + 1].steps)
            setCurrentStep(modalObjArr[each.index + 1].steps[0].step)

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
              {mapSteps()}
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