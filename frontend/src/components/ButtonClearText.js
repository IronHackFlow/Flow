import { useEffect, useRef } from 'react'
import xExit from '../images/exit-x-2.svg'

export default function ButtonClearText({ inset, shadowColors, buttonSize = 68, inputRef, value, setValue }) {
  const buttonContainerRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    if (value) {
      console.log("shit htis is firing off man", value)
      buttonContainerRef.current.style.width = `${buttonContainerRef.current.getBoundingClientRect().height + 15}px`
      buttonRef.current.style.opacity = "1"
    } else {
      buttonContainerRef.current.style.width = "0%"
      buttonRef.current.style.opacity = "0"
    }
  }, [value])

  const clearInput = (e) => {
    e.preventDefault()
    inputRef.current.value = ""
    setValue("")
    buttonContainerRef.current.style.width = "0%"
    buttonRef.current.style.opacity = "0"
  }

  const insetStyles = {
    height: `${buttonSize}%`,
    width: `${buttonSize}%`,
    boxShadow: `2px 2px 3px ${shadowColors[2]}, -1px -1px 2px 0px ${shadowColors[3]}`
  }

  return (
    <div 
      className="ButtonClearText"
      ref={buttonContainerRef}
    >
      <button 
        className="btn-clear--shadow-inset" 
        ref={buttonRef}
        style={!inset ? {boxShadow: "none"} : {boxShadow: `inset 2px 2px 3px ${shadowColors[0]}, inset -2px -2px 2px ${shadowColors[1]}`}}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => clearInput(e)}
        tabIndex="-1"
      >
        <div 
          className="btn-clear--shadow-outset"
          style={insetStyles}
        >
          <img className="button-icons" src={xExit} alt="clear text button" />
        </div>
      </button>
    </div>
  )
}


