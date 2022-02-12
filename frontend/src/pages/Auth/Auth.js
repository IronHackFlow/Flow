import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { GoogleLogin } from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import InputError from '../../components/InputError'
import AuthLogIn from './AuthLogIn'
import AuthSignUp from './AuthSignUp'
import { useToggle } from '../../hooks/useToggle'
import flowLogo from '../../assets/images/FlowLogo.png'

const Auth = () => {
  const { setUser } = useContext(TheContext)
  const navigate = useNavigate()
  const [isLogIn, setIsLogIn] = useToggle(false)
  const [errorMessage, setErrorMessage] = useState()
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    setShowErrorModal(false)
  }, [isLogIn])

  const onResponse = response => {
    actions
      .logInGoogle(response)
      .then(async res => {
        if (res.data.success) {
          console.log(res.data, 'SUCCESSFUL GOOGLE LOGIN')
          localStorage.setItem('token', res.data.token)
          await actions
            .getAuthUser()
            .then(res => {
              if (res.data.isLoggedIn) {
                setUser(res.data.user)
                navigate('/')
              }
            })
            .catch(console.error)
        } else {
          //TODO: add errors to display to user
          console.log(res.data.message)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="LogIn" id="LogIn">
      <div className="page-container">
        <div className="upper-container">
          <div className="upper-outset">
            <div className="upper-inset">
              <div className="upper-inset-outset">Welcome To</div>
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
                      <div className="title_shadow-div-inset">{isLogIn ? `Sign Up` : `Log In`}</div>
                    </div>
                    <div className="user-login-2_other-logins">
                      <InputError
                        isOpen={showErrorModal}
                        onClose={setShowErrorModal}
                        message={errorMessage}
                        modHeight={50}
                        modWidth={74}
                        top={26.5}
                        left={13}
                      />
                      <div className="other-logins-1_google-btn">
                        <div className="google-btn_shadow-div-outset">
                          <p>Continue with </p>
                          <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLEID}
                            buttonText={isLogIn ? 'Sign Up' : 'Log In'}
                            onSuccess={onResponse}
                            onFailure={onResponse}
                            cookiePolicy={'single_host_origin'}
                          />
                        </div>
                      </div>
                      <div
                        className="other-logins-2_or-container"
                        style={showErrorModal ? { height: '15%' } : { height: '25%' }}
                      >
                        <div className="border"></div>
                        <p>or</p>
                        <div className="border"></div>
                      </div>
                    </div>
                    {isLogIn ? (
                      <AuthSignUp showError={setShowErrorModal} onError={setErrorMessage} />
                    ) : (
                      <AuthLogIn showError={setShowErrorModal} onError={setErrorMessage} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="switch--container">
              <div className="switch--shadow-outset">
                <div className="switch--shadow-inset">
                  <div className="switch__text--container">
                    <p className="switch__text">
                      {isLogIn ? 'Already a member of Flow?' : "Don't have an account?"}
                    </p>
                  </div>
                  <div className="switch__btn--container">
                    <button className="switch__btn" onClick={() => setIsLogIn()}>
                      {isLogIn ? 'Log In' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
