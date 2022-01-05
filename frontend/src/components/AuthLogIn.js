import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import actions from '../api';
import TheContext from '../TheContext'
import eye from "../images/eye.svg"
import noEye from "../images/no-eye.svg"

function AuthLogIn(props) {
  const navigate = useNavigate()

  const [userName, setUserName] = useState()
  const [password, setPassword] = useState()
  const [showPassword, setShowPassword] = useState(false)

  const handleLogIn = async (e) => {
    e.preventDefault()
    const userObj = {
      userName: userName,
      password: password
    }
    try {
      const res = await actions
        .logIn(userObj)
        .then((res) => {
          console.log(res.data, "plz")
          localStorage.setItem('token', res.data.token)
          navigate('/')
        })
        .catch(err => console.log(err))
    } catch(err) {
      console.log(err)
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
                ariaRequired="true"
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
                areaRequired="true"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
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
