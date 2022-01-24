import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import actions from '../api';
import ButtonClearText from "./ButtonClearText"
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

function AuthSignUp(props) {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const userNameInputRef = useRef()
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const signUpHandler = async (e) => {
    e.preventDefault()
    try {
      actions
        .signUp(userData)
        .then(res => {
          console.log(res.data)
          if (res.data.success) {
            actions
              .logIn(userData)
              .then((res) => {
                if (res.data.success) {
                  localStorage.setItem('token', res.data.token)
                  navigate('/')
                } else {
                  // TODO: create an error here to display on screen
                  console.log(res.data.message)
                }
              })
              .catch(console.error)
          } else {
            //TODO: Dynamic error modal
            console.log(res.data.message)
          }
        })
        .catch(console.error)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="user-login-3_form">
      <form className="login-form" autocomplete="off" onSubmit={(e) => signUpHandler(e)}>
        <div className="user-form-container">
          <div className="login-input-container email-container">
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "2.8vh 2.8vh 0.5vh 0.5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={userNameInputRef}
                  placeholder="Username"
                  type="text"
                  name="user_name"
                  onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value }))}
                />
                <ButtonClearText
                  containerWidth={2.6}
                  inset={true}
                  shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                  inputRef={userNameInputRef}
                />
              </div>
            </div>
          </div>

          <div className="login-input-container email-container">
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "0.5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={emailInputRef}
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value }))}
                />
                <ButtonClearText
                  containerWidth={2.6}
                  inset={true}
                  shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                  inputRef={emailInputRef}
                />
              </div>
            </div>
          </div>

          <div className="login-input-container password-container">
            <div className="login-input_shadow-div-outset password" style={{borderRadius: "0.5vh 0.5vh 2.8vh 2.8vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field password-input"
                  ref={passwordInputRef}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autocomplete="new-password"
                  name="password"
                  onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value }))}
                />
                <ButtonClearText
                  containerWidth={2.6}
                  inset={true}
                  shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                  inputRef={passwordInputRef}
                />
                <button className="show-password-container signup-pass" onClick={() => setShowPassword(!showPassword)}>
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
              <h4>Sign Up</h4>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthSignUp;