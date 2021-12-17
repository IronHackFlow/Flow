import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { Link } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'

const Auth = (props) => {
  const { 
    user, setUser
  } = React.useContext(TheContext)

  const onResponse = (response) => {
    actions
      .logIn(response)
      .then(res => {
        console.log("THIS", props)
        setUser(res.data)
      })
      .catch(console.error)
  }
    
  console.log('ice cream', user)

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
                  <h1>FLOW</h1>
                </div>
                <div className="user-input-container">
                  <div className="user-login_shadow-div-outset">
                    <div className="user-login-1_title">
                      <div className="title_shadow-div-inset">
                        Log In
                      </div>
                    </div>
                    <div className="user-login-2_form">
                      <form className="login-form">
                        <div className="email-container">
                            <p>Email</p>
                            <input></input>
                        </div>
                        <div className="password-container">  
                            <p>Password</p>
                            <input></input>
                        </div>
                        <Link 
                            to ="/" 
                            className="login-link"
                        >
                            <div className="login-button">
                                <h4>Enter</h4>
                            </div>
                        </Link>
                      </form>
                    </div>
                    <div className="user-login-3_other-logins">
                      <GoogleLogin 
                        clientId={process.env.REACT_APP_GOOGLEID}
                        buttonText="Signup"
                        onSuccess={onResponse}
                        onFailure={onResponse}
                        cookiePolicy={"single_host_origin"}
                      />
                    </div>

                  </div>
                </div>
                <div className="bottom-filler-space"></div>
              </div>
            </div>
            <div className="mid-inset-bottom">
              <div className="bottom_shadow-div-outset">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
