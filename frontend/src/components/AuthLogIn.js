import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import actions from '../api';

function AuthLogIn(props) {
  const history = useHistory()
  const [email, setEmail] = useState()
  const [userName, setUserName] = useState()
  const [password, setPassword] = useState()

  useEffect(() => {
    actions
      .isUserAuth()
      .then(data => data.data.isLoggedIn ? history.push('/') : null)
      .catch(console.error)
  }, [])

  const handleLogIn = (e) => {
    e.preventDefault()
    const user = {
      userName: userName,
      password: password
    }

    actions
      .logIn(user)
      .then((res) => {
        console.log(res, "what is it?")
        localStorage.setItem('token', res.data.token.split(' ')[1])
      })
      .catch(() => {})
  }


  return (
    <div className="user-login-3_form">
      <form 
        className="login-form"
        onSubmit={(e) => handleLogIn(e)}
      >
        <div className="login-input-container email-container">
          <div className="login-input_shadow-div-outset email" style={{borderRadius: "13px 13px 5px 5px"}}>
            <p>Email or Username</p>
            <div className="input-container">
              <input 
                className="login-input-field email-input"
                type="text"
                onChange={(e) => setUserName(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              ></input>
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
          {/* <Link 
            to ="/" 
            className="login-link"
          >
            <div className="login-button">
              <h4>Log In</h4>
            </div>
          </Link> */}
        </div>
      </form>
    </div>
  );
}

export default AuthLogIn;
