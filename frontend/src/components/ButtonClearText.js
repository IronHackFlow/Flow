import e from 'cors';
import { useEffect, useRef } from 'react'
import xExit from '../images/exit-x-2.svg'

export default function ButtonClearText({ containerWidth, inset, buttonSize, inputRef }) {
  const showBtnRef = useRef();

  useEffect(() => {
    if (inputRef?.current?.value) {
      showBtnRef.current.style.width = `${containerWidth}%`
    } else {
      showBtnRef.current.style.width = "0"
    }
  }, [inputRef?.current?.value])

  const clearInput = (e, inputRef) => {
    e.preventDefault()
    inputRef.current.value = ""
    showBtnRef.current.style.width = "0%"
  }

  return (
    <div 
      className="ButtonClearText"
      ref={showBtnRef}
    >
      <div className="btn-clear--shadow-inset" style={!inset ? {boxShadow: "none"} : {}}>
        <button 
          className="btn-clear--shadow-outset"
          style={!inset ? {height: `${buttonSize}`, width: `${buttonSize}`} : {}}
          onClick={(e) => clearInput(e, inputRef)}
        >
          <img className="button-icons" src={xExit} alt="clear text button" />
        </button>
      </div>
    </div>
  )
}


