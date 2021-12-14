import React, { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import xExit from "../images/exit-x-2.svg"

function RecordingBoothModal(props) {
  let modalObjArr = [
    {
      index: 0,
      title: "Welcome to the Flow Recording Booth",
      steps: [
        { 
          step: `In this tutorial you learn all you need to know to start Flowing.
                 After which you'll have no excuses for not reaching your Rap God 
                 letslakdjfladskjflasjdf alsdkjfa lsdjfalsdjf akdjfsldf jsldfkjs 
                 lsdkjflsdkjflasdsjkf djfdkfj aldfjkf dfk djf jdka sdfdklj flkj 
                 potential! Let's get started, please hit the next button below`, 
          show: true 
        }
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
        { step: "Lyrics Transcript", show: true },
        { step: "Lyrics List", show: false }
      ]
    }
  ]
  const [modalInDisplay, setModalInDisplay] = useState(modalObjArr[0]);
  const [modalSteps, setModalSteps] = useState(modalObjArr[0].steps);
  const [currentStep, setCurrentStep] = useState(modalObjArr[0].steps[0]);
  const [endOfModal, setEndOfModal] = useState(true);
  const [beginOfModal, setBeginOfModal] = useState(true)
  const [arrowClass, setArrowClass] = useState(null);
  const [focusClass, setFocusClass] = useState(null);
  const [modalPositionClass, setModalPositionClass] = useState(null);
  const [arrowDirectionClass, setArrowDirectionClass] = useState('down');

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
  }, [props.toggleModal])

  useEffect(() => {
    if ((modalInDisplay.index === 3) && (modalSteps[modalSteps.length - 1].step === currentStep.step)) {
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

  useEffect(() => {
    if (modalInDisplay.index === 0) return setModalBodyClasses('first-modal', 'down')
    else if (modalInDisplay.index === 1) return setModalBodyClasses('second-modal', 'down')
    else if (modalInDisplay.index === 2) return setModalBodyClasses('third-modal', 'up')
    else if (modalInDisplay.index === 3) return setModalBodyClasses('fourth-modal', 'up')
  }, [modalInDisplay])

  useEffect(() => {
    if (currentStep.step === modalObjArr[0].steps[0].step) return setTipClasses('arrow-zero-zero', 'focus-zero-zero')
    else if (currentStep.step === modalObjArr[1].steps[0].step) return setTipClasses('arrow-one-one', 'focus-one-one', 10)
    else if (currentStep.step === modalObjArr[1].steps[1].step) return setTipClasses('arrow-one-two', 'focus-one-two', 11)
    else if (currentStep.step === modalObjArr[1].steps[2].step) return setTipClasses('arrow-one-three', 'focus-one-three', 12)
    else if (currentStep.step === modalObjArr[2].steps[0].step) return setTipClasses('arrow-two-one', 'focus-two-one', 20)
    else if (currentStep.step === modalObjArr[2].steps[1].step) return setTipClasses('arrow-two-two', 'focus-two-two', 21)
    else if (currentStep.step === modalObjArr[2].steps[2].step) return setTipClasses('arrow-two-three', 'focus-two-three', 22)
    else if (currentStep.step === modalObjArr[3].steps[0].step) return setTipClasses('arrow-three-one', 'focus-three-one', 30)
    else if (currentStep.step === modalObjArr[3].steps[1].step) return setTipClasses('arrow-three-two', 'focus-three-two', 31)
  }, [currentStep])

  const showArrow = useCallback(() => {
    return (
      <div className={`arrow-container ${arrowClass}`}>
        <div className={`arrow-head ${arrowDirectionClass}`}></div>
      </div>
    )
  }, [arrowClass])

  const mapSteps = useCallback(() => {
    return modalInDisplay?.steps.map((each) => {
      return (
        <div 
          className="step-containers"
          key={`${uuidv4()}_${each.step}`}
          style={(each.show === true) ? { opacity: '1' } : { opacity: '0'}}
        >
          <div className={`steps_shadow-div-inset ${currentStep.step === each.step ? "highlight-step" : ""}`}>
            <p>{each.step}</p>
          </div>
        </div>
      )    
    })
  }, [modalInDisplay, currentStep])

  const setModalBodyClasses = (section, direction) => {
    setModalPositionClass(section)
    setArrowDirectionClass(direction)
  }

  const setTipClasses = (arrow, focus, num) => {
    setArrowClass(arrow)
    setFocusClass(focus)
    props.setFocusBorder(num)
  }

  const closeWindowHandler = () => {
    props.setToggleModal(false)
    setModalInDisplay(modalObjArr[0])
    setModalSteps(modalObjArr[0].steps)
    setCurrentStep(modalObjArr[0].steps[0])
    setEndOfModal(false)
    setBeginOfModal(true)
    setArrowDirectionClass('down')
    setArrowClass('')
    setModalPositionClass('')
    setFocusClass('')
  }

  const microStepHandler = () => {
    modalSteps.forEach((each, index) => {
      if (each.step === currentStep.step) {
        if ((index + 1) !== null) {
          setCurrentStep(modalSteps[index + 1])
        }
      }
    })
  }

  const macroStepHandler = (direction) => {
    modalObjArr.forEach((each) => {
      if (each.index === modalInDisplay.index) {
        if (direction === 'back') {
          if (modalSteps[0].step !== currentStep.step) {
            setModalInDisplay(modalObjArr[each.index])
            setModalSteps(modalObjArr[each.index].steps)
            setCurrentStep(modalObjArr[each.index].steps[0])
          } else if (each.index !== 0) {
            setModalInDisplay(modalObjArr[each.index - 1])
            setModalSteps(modalObjArr[each.index - 1].steps)
            setCurrentStep(modalObjArr[each.index - 1].steps[0])
          } 
        } else {
          if (modalSteps[modalSteps.length - 1].step !== currentStep.step) {
            microStepHandler()
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

      <div className={`opacity-section-1 ${modalInDisplay.index === 3 ? `${focusClass}` : ""}`}>
      </div>
      <div className={`opacity-section-2 ${modalInDisplay.index === 2 ? `${focusClass}` : ""}`}>
      </div>
      <div className={`opacity-section-3 ${modalInDisplay.index === 1 ? `${focusClass}` : ""}`}>
      </div>

      <div className="close-window-container">
        <div className="close-window-btn" onClick={() => closeWindowHandler()}>
          <img className="button-icons" src={xExit} alt="exit" />
        </div>
      </div>

      <div className={`section-4_controls ${modalPositionClass}`}>
        <div className="section_shadow-div-inset">
          <div className="section_next-container">
            <div className="next-container_shadow-div-inset">
              {modalInDisplay.title}
            </div>
          </div>
          <div className="section_text-container">
            <div className="text-container_shadow-div-outset">
              {mapSteps()}
            </div>
          </div>
        </div>
      </div>
      
      {showArrow()}

      <div className="modal-navigation-container">
        <div className="modal-navigation_shadow-div-inset">
          <div className="modal-navigation_shadow-div-outset">
            {!beginOfModal ? (
              <button className="next-back-btn back-btn" onClick={() => macroStepHandler('back')}>
                Back
              </button>
            ) : (
              <div></div>
            )}
            {!endOfModal ? (
              <button className="next-back-btn next-btn" onClick={() => macroStepHandler('next')}>
                Next
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default RecordingBoothModal
