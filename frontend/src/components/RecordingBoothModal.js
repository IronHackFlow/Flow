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
  const [modalInDisplay, setModalInDisplay] = useState(modalObjArr[0]);
  const [modalSteps, setModalSteps] = useState(modalObjArr[0].steps);
  const [currentStep, setCurrentStep] = useState(modalSteps[0]);
  const [endOfModal, setEndOfModal] = useState(true);
  const [beginOfModal, setBeginOfModal] = useState(true)

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

  useEffect(() => {
    if (modalInDisplay.index === 3 && modalSteps[modalSteps.length - 1].step === currentStep.step) {
      setEndOfModal(true)
    } else {
      setEndOfModal(false)
    }
  }, [currentStep])

  useEffect(() => {
    if (modalInDisplay.index !== 0) {
      setBeginOfModal(false)
    } else {
      setBeginOfModal(true)
    }
  }, [modalInDisplay])

  useEffect(() => {
    if (!currentStep.show) {
      let newModalInDisplay = modalInDisplay.steps.map((each) => {
        if (each.step === currentStep.step) {
          return {...each, show: true }
        } else { 
          return each
        }
      })
      setModalInDisplay(prevModal => ({
        ...prevModal,
        steps: newModalInDisplay
      }))

    }
  }, [currentStep])

  const mapSteps = useCallback(() => {
    return modalInDisplay?.steps.map((each, index) => {
      return (
        <div 
          id={each.step}
          className="step-containers" 
          key={`${uuidv4()}_${each[index]}`}
          style={(each.show === true) ? { opacity: '1' } : { opacity: '0'}}
        >
          <div className="steps_shadow-div-inset">
            {each.step}
          </div>
        </div>
      )    
    })
  }, [modalInDisplay])

  const showStepsHandler = (direction) => {
    modalSteps.filter((each, index) => {
      if (each.step === currentStep.step) {
        if (direction === 'back') {
          if ((index - 1) !== null) {
            setCurrentStep(modalSteps[index - 1])
          }
        } else {
          if ((index + 1) !== null) {
            setCurrentStep(modalSteps[index + 1])

          }
        }
      }
    })
  }

  const getModal = (direction) => {
    modalObjArr.filter((each) => {
      if (each.index === modalInDisplay.index) {
        if (direction === 'back') {
          if (modalSteps[0].step !== currentStep.step) {
            setModalInDisplay(modalObjArr[each.index])
            setModalSteps(modalObjArr[each.index].steps)
            setCurrentStep(modalObjArr[each.index].steps[0])
          }
          else if (each.index !== 0) {
            setModalInDisplay(modalObjArr[each.index - 1])
            setModalSteps(modalObjArr[each.index - 1].steps)
            setCurrentStep(modalObjArr[each.index - 1].steps[0])
          } 
        } else {
          if (modalSteps[modalSteps.length -1].step !== currentStep.step) {
            showStepsHandler(direction)
          } else if (each.index !== 3) {
            setModalInDisplay(modalObjArr[each.index + 1])
            setModalSteps(modalObjArr[each.index + 1].steps)
            setCurrentStep(modalObjArr[each.index + 1].steps[0])
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
            {!beginOfModal ? (
              <button className="next-back-btn back-btn" onClick={() => getModal('back')}>
                Back
              </button>
            ) : (
              <div></div>
            )}
            {!endOfModal ? (
              <button className="next-back-btn next-btn" onClick={() => getModal('next')}>
                Next
              </button>
            ) : (
              <div></div>
            )}

          </div>
        </div>
      </div>
      <div className="arrow-container">
        
      </div>
    </div>
  )
}
export default RecordingBoothModal
