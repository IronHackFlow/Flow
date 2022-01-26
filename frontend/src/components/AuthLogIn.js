import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import actions from '../api'
import useHandleOSK from '../utils/useHandleOSK'
import ButtonClearText from "./ButtonClearText"
import ButtonShowPassword from "./ButtonShowPassword"

function AuthLogIn({showError, onError}) {
  const navigate = useNavigate()
  const { handleOnFocus } = useHandleOSK()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordType, setPasswordType] = useState("password")

  const userNameInputRef = useRef()
  const passwordInputRef = useRef()

  const handleLogIn = async (e) => {
    e.preventDefault()
    const userData = { user_name: username, password: password }
    if (username === "") {
      onError("Username field is required")
      userNameInputRef.current.focus()
      return showError(true)
    } 
    if (password === "") {
      onError("Password field is required")
      passwordInputRef.current.focus()
      return showError(true)
    }
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
          onError(res.data.message)
          showError(true)
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
      > {console.log(username, userNameInputRef?.current?.value, "these things changing together or naw??")}
        <div className="user-form-container" style={{justifyContent: "flex-start"}}>
          <div className="login-input-container email-container" style={{height: "40%"}}>
            <div className="login-input_shadow-div-outset email" style={{borderRadius: "2.8vh 2.8vh .5vh .5vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field email-input"
                  ref={userNameInputRef}
                  ariarequired="true"
                  placeholder="Username"
                  type="text"
                  autoComplete="off"
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

          <div className="login-input-container password-container" style={{height: "40%"}}>
            <div className="login-input_shadow-div-outset password" style={{borderRadius: ".5vh .5vh 2.8vh 2.8vh"}}>
              <div className="input-container">
                <input 
                  className="login-input-field password-input"
                  ref={passwordInputRef}
                  arearequired="true"
                  placeholder="Password"
                  type={passwordType}
                  autoComplete="current-password"
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
              <h4>Log In</h4>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthLogIn;
