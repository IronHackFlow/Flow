import React, { useEffect, useState } from 'react'
import { GoogleLogin } from 'react-google-login'
import { Link, useHistory } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'
import AuthLogIn from './AuthLogIn'
import AuthSignUp from './AuthSignUp'


const Auth = (props) => {
  const { 
    user, setUser
  } = React.useContext(TheContext)
  const history = useHistory()
  const [toggleLogin, setToggleLogin] = useState(true)

  // const onResponse = (response) => {
  //   actions
  //     .logIn(response)
  //     .then(res => {
  //       console.log("THIS", props)
  //       setUser(res.data)
  //     })
  //     .catch(console.error)
  // }
  useEffect(() => {
    actions
      .isUserAuth()
      .then(data => data.isLoggedIn ? history.push('/') : null)
      .catch(console.error)
  }, [])

  return (
    <div className="LogIn">
      <div className="page-container">
        <div className="upper-container">
          <div className="upper-outset">
            <div className="upper-inset">
              <div className="upper-inset-outset">

              </div>
            </div>
          </div>
        </div>

        <div className="middle-container">
          <div className="mid-outset">
            <div className="mid-inset">
              <div className="login-container">
                <div className="title-container">

                </div>
                <div className="user-input-container">
                  <div className="user-login_shadow-div-outset">
                    <div className="user-login-1_title">
                      <div className="title_shadow-div-inset">
                        {toggleLogin ? "Log in to Flow" : "Sign up for Flow"}
                      </div>
                    </div>
                    <div className="user-login-2_other-logins">
                      <div className="other-logins-1_google-btn">
                        <div className="google-btn_shadow-div-outset">
                          <p>Continue with </p>
                          {/* <GoogleLogin 
                            clientId={process.env.REACT_APP_GOOGLEID}
                            buttonText="Signup"
                            onSuccess={onResponse}
                            onFailure={onResponse}
                            cookiePolicy={"single_host_origin"}
                          /> */}
                          <Link to="/">Enter</Link>
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
                <button onClick={() => setToggleLogin(!toggleLogin)}>{toggleLogin ? "Log In" : "Sign Up"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
