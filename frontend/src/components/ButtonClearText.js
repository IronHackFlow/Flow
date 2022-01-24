import { useEffect, useRef } from 'react'
import xExit from '../images/exit-x-2.svg'

export default function ButtonClearText({ containerWidth, inset, shadowColors, buttonSize = 68, inputRef }) {
  const showBtnRef = useRef();

  useEffect(() => {
    if (inputRef?.current?.value) {
      showBtnRef.current.style.width = `${containerWidth}em`
    } else {
      showBtnRef.current.style.width = "0"
    }
  }, [inputRef?.current?.value])

  const clearInput = (e, inputRef) => {
    e.preventDefault()
    inputRef.current.value = ""
    showBtnRef.current.style.width = "0%"
  }
  const insetStyles = {
    height: `${buttonSize}%`,
    width: `${buttonSize}%`,
    boxShadow: `2px 2px 3px ${shadowColors[2]}, -1px -1px 2px 0px ${shadowColors[3]}`
  }
  return (
    <div 
      className="ButtonClearText"
      ref={showBtnRef}
    >
      <div 
        className="btn-clear--shadow-inset" 
        style={!inset ? {boxShadow: "none"} : {boxShadow: `inset 2px 2px 3px ${shadowColors[0]}, inset -2px -2px 2px ${shadowColors[1]}`}}
      >
        <button 
          className="btn-clear--shadow-outset"
          style={insetStyles}
          onClick={(e) => clearInput(e, inputRef)}
        >
          <img className="button-icons" src={xExit} alt="clear text button" />
        </button>
      </div>
    </div>
  )
}


