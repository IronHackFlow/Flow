import React, { useEffect, useState } from 'react';
import actions from '../api';
import TheContext from '../contexts/TheContext'
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

function AuthSignUp(props) {
  const { userToggle, setUserToggle } = React.useContext(TheContext)

  const [email, setEmail] = useState()
  const [userName, setUserName] = useState()
  const [password, setPassword] = useState()
  const [showPassword, setShowPassword] = useState(false)

  const signUpHandler = async (e) => {
    e.preventDefault()

    const user = {
      userName: userName,
      email: email,
      password: password
    }

    actions
      .signUp(user)
      .then(res => {
        console.log(res)
        if (res.data.message === "Success") {
          actions
            .logIn(user)
            .then((res) => {
              console.log(res.data, "plz")
              localStorage.setItem('token', res.data.token)
              setUserToggle(!userToggle)
            })
            .catch(console.error)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="user-login-3_form">
      <form className="login-form" onSubmit={(e) => signUpHandler(e)}>
        <div className="login-input-container email-container">
          <div className="login-input_shadow-div-outset email" style={{borderRadius: "13px 13px 5px 5px"}}>
            <p>Username</p>
            <div className="input-container">
              <input 
                className="login-input-field email-input"
                type="text"
                onChange={(e) => setUserName(e.target.value)}
              ></input>
            </div>
          </div>
        </div>

        <div className="login-input-container email-container">
          <div className="login-input_shadow-div-outset email" style={{borderRadius: "5px"}}>
            <p>Email</p>
            <div className="input-container">
              <input 
                className="login-input-field email-input"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <div className="show-password-container signup-pass" onClick={() => setShowPassword(!showPassword)}>
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
              <h4>Sign Up</h4>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthSignUp;