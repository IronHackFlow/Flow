import { useEffect, useState } from 'react';
import { eyeIcon, noEyeIcon } from "../assets/images/_icons"


export default function ButtonShowPassword({ setType, password }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (password) {
      setShowButton(true)
      setShowPassword(false)
    } else {
      setShowButton(false)
      setType("password")
    }
  }, [password])

  const showPasswordHandler = (e, type, isShowing) => {
    e.preventDefault()
    setType(type)
    setShowPassword(isShowing)
  }

  return (
    <div 
      className="ButtonShowPassword"
      style={showButton ? {opacity: "1"} : {opacity: "0"}}
    >
      {showPassword
        ? (
          <button 
            className="show-password-btn" 
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => showPasswordHandler(e, "password", false)}
            tabIndex="-1"
          >
            <img className="button-icons password-no-eye" src={noEyeIcon} alt="hide password" />
          </button>
        )
        : (
          <button 
            className="show-password-btn" 
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => showPasswordHandler(e, "text", true)}
            tabIndex="-1"
          >
            <img className="button-icons password-eye" src={eyeIcon} alt="show password" />
          </button>
        )
      }
    </div>
  )
}
