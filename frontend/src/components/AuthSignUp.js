import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import actions from '../api';
import useHandleOSK from '../utils/useHandleOSK';
import ButtonClearText from "./ButtonClearText"
import ButtonShowPassword from "./ButtonShowPassword"

function AuthSignUp({showError, onError}) {
  const { handleOnFocus } = useHandleOSK()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordType, setPasswordType] = useState("password")

  const userNameInputRef = useRef()
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const signUpHandler = async (e) => {
    e.preventDefault()
    const userData = { user_name: username, email: email, password: password }
    if (username === "") {
      onError("Username field is required")
      userNameInputRef.current.focus()
      return showError(true)
    } 
    if (email === "") {
      onError("Email field is required")
      emailInputRef.current.focus()
      return showError(true)
    } 
    if (password === "") {
      onError("Password field is required")
      passwordInputRef.current.focus()
      return showError(true)
    }
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
      <form className="login-form" onSubmit={(e) => signUpHandler(e)}>
        <div className="user-form-container">
          <div className="login-input-container email-container">
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "2.8vh 2.8vh 0.5vh 0.5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={userNameInputRef}
                  placeholder="Username"
                  autoComplete="off"
                  type="text"
                  name="user_name"
                  onFocus={() => handleOnFocus()}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                inputRef={userNameInputRef}
                value={username}
                setValue={setUsername}
              />
            </div>
          </div>

          <div className="login-input-container email-container">
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "0.5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={emailInputRef}
                  placeholder="Email"
                  autoComplete="off"
                  type="email"
                  name="email"
                  onFocus={() => handleOnFocus()}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                inputRef={emailInputRef}
                value={email}
                setValue={setEmail}
              />
            </div>
          </div>

          <div className="login-input-container password-container">
            <div className="login-input_shadow-div-outset password" style={{borderRadius: "0.5vh 0.5vh 2.8vh 2.8vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field password-input"
                  ref={passwordInputRef}
                  placeholder="Password"
                  type={passwordType}
                  autoComplete="new-password"
                  name="password"
                  onFocus={() => handleOnFocus()}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <ButtonShowPassword 
                  setType={setPasswordType}
                  password={password}
                />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
                inputRef={passwordInputRef}
                value={password}
                setValue={setPassword}
              />
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