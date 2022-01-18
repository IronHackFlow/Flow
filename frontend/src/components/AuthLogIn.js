import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import actions from '../api';
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

function AuthLogIn(props) {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  function parseJSONSafely(str) {
    try {
       return JSON.parse(str);
    }
    catch (e) {
       console.err(e);
       // Return a default object, or null based on use case.
       return {}
    }
 }
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
        <div className="login-input-container email-container">
          <div className="login-input_shadow-div-outset email" style={{borderRadius: "13px 13px 5px 5px"}}>
            <p>Username</p>
            <div className="input-container">
              <input 
                className="login-input-field email-input"
                ariarequired="true"
                type="text"
                name="user_name"
                onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value}))}
              ></input>
            </div>
          </div>
        </div>

        <div className="login-input-container password-container">
          <div className="login-input_shadow-div-outset password" style={{borderRadius: "5px 5px 13px 13px"}}>
            <p>Password</p>
            <div className="input-container">
              <input 
                className="login-input-field password-input"
                arearequired="true"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                name="password"
                onChange={(e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value}))}
              ></input>
              <div className="show-password-container" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <img className="button-icons password-no-eye" src={noEye} alt="hide password" />
                ) : (
                  <img className="button-icons password-eye" src={eye} alt="show password" />
                )}
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
