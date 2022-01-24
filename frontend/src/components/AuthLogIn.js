import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import actions from '../api';
import ButtonClearText from "./ButtonClearText"
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

function AuthLogIn(props) {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const handleLogIn = async (e) => {
    e.preventDefault()
    try {
      const res = await actions
        .logIn(userData)
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem('token', res.data.token)
            navigate('/')
          } else {
            // TODO: create an error here to display on screen
            console.log(res.data)
          }
        })
        .catch(err => console.log(err, "what could've gone wrong?"))
    } catch(err) {
      console.log(err, "i was caught in the TRY CATCH")
    }
  }

  return (
    <div className="user-login-3_form">
      <form 
        className="login-form"
        onSubmit={(e) => handleLogIn(e)}
      >
        <div className="user-form-container" style={{justifyContent: "flex-start"}}>
          <div className="login-input-container email-container" style={{height: "40%"}}>
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "2.8vh 2.8vh .5vh .5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={emailInputRef}
                  ariarequired="true"
                  placeholder="Username"
                  type="text"
                  autoComplete="off"
                  name="user_name"
                  onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value}))}
                />
                <ButtonClearText
                  containerWidth={21}
                  inset={true}
                  shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                  inputRef={emailInputRef}
                />
              </div>
            </div>
          </div>

          <div className="login-input-container password-container" style={{height: "40%"}}>
            <div className="login-input_shadow-div-outset password" style={{borderRadius: ".5vh .5vh 2.8vh 2.8vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field password-input"
                  ref={passwordInputRef}
                  arearequired="true"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  name="password"
                  onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value}))}
                />
                <ButtonClearText
                  containerWidth={21}
                  inset={true}
                  shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                  inputRef={passwordInputRef}
                />
                <button 
                  className="show-password-container" 
                  style={passwordInputRef?.current?.value !== "" ? {right: "22%"} : {right: "4%"}}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {console.log(passwordInputRef?.current?.value, "whaf?")}
                  {showPassword ? (
                    <img className="button-icons password-no-eye" src={noEye} alt="hide password" />
                  ) : (
                    <img className="button-icons password-eye" src={eye} alt="show password" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="enter-btn-container">
          <button
            type="submit"
            className="login-link"
          >
            <div className="login-button">
              <h4>Log In</h4>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthLogIn;
