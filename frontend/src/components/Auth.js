import React, { useEffect, useLayoutEffect, useState } from 'react'
import { GoogleLogin } from 'react-google-login'
import { Link, useNavigate } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'
import useEventListener from './utils/useEventListener'
import AuthLogIn from './AuthLogIn'
import AuthSignUp from './AuthSignUp'
import flowLogo from '../images/FlowLogo.png'

const Auth = (props) => {
  const { windowSize, userToggle, setUserToggle } = React.useContext(TheContext)
  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('LogIn').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('LogIn').style.height = `${onChange}px`
    }
  })
  const navigate = useNavigate()

  const [toggleLogin, setToggleLogin] = useState(true)

  useEffect(() => {
    actions
    .isUserAuth()
    .then(res => {
      if (res.data.isLoggedIn) {
        navigate('/')
      }
    })
    .catch(console.error)
  }, [userToggle])
  
  const onResponse = (response) => {
    actions
      .logInGoogle(response)
      .then(res => {
        console.log("THIS", res)
        localStorage.setItem('token', res.data.token)
        setUserToggle(!userToggle)
      })
      .catch(console.error)
  }

  return (
    <div className="LogIn" id="LogIn">
      <div className="page-container">
        <div className="upper-container">
          <div className="upper-outset">
            <div className="upper-inset">
              <div className="upper-inset-outset">
                Welcome To
              </div>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="mid-outset">
            <div className="mid-inset">
              <div className="login-container">
                <div className="title-container">
                  <img src={flowLogo} alt="flow logo" />
                </div>
                <div className="user-input-container">
                  <div className="user-login_shadow-div-outset">
                    <div className="user-login-1_title">
                      <div className="title_shadow-div-inset">
                        {toggleLogin ? "Log In" : "Sign Up"}
                      </div>
                    </div>
                    <div className="user-login-2_other-logins">
                      <div className="other-logins-1_google-btn">
                        <div className="google-btn_shadow-div-outset">
                          <p>Continue with </p>
                          <GoogleLogin 
                            clientId={process.env.REACT_APP_GOOGLEID}
                            buttonText="Signup"
                            onSuccess={onResponse}
                            onFailure={onResponse}
                            cookiePolicy={"single_host_origin"}
                          />
                        </div>
                      </div>
                      <div className="other-logins-2_or-container">
                        <div className="border"></div>
                        <p>or</p>
                        <div className="border"></div>
                      </div>
                    </div>
                    {toggleLogin ? (<AuthLogIn />) : (<AuthSignUp />)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mid-inset-bottom">
              <div className="bottom_shadow-div-outset">
                <p>{toggleLogin ? "Don't have an account?" : "Already a member of Flow?"}</p>
                <button onClick={() => setToggleLogin(!toggleLogin)}>{toggleLogin ? "SignUp" : "Log In"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
