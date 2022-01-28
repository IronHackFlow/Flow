import { useEffect, useState } from 'react';
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

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

  const showPasswordHandler = (e) => {
    e.preventDefault()
    setType("text")
    setShowPassword(true)
  }

  const hidePasswordHandler = (e) => {
    e.preventDefault()
    setType("password")
    setShowPassword(false)
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
            onClick={(e) => hidePasswordHandler(e)}
            tabIndex="-1"
          >
            <img className="button-icons password-no-eye" src={noEye} alt="hide password" />
          </button>
        )
        : (
          <button 
            className="show-password-btn" 
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => showPasswordHandler(e)}
            tabIndex="-1"
          >
            <img className="button-icons password-eye" src={eye} alt="show password" />
          </button>
        )
      }
    </div>
  )
}
