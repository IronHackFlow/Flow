import React, { useEffect, useState } from 'react'
import { GoogleLogin } from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import actions from '../../api'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import InputError from '../../components/Errors/InputError'
import AuthLogIn from './AuthLogIn'
import AuthSignUp from './AuthSignUp'
import flowLogo from '../../assets/images/FlowLogo.png'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'

const Auth = () => {
  const navigate = useNavigate()
  const [isLogIn, setIsLogIn] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [clientId, setClientId] = useState<string>('')

  useEffect(() => {
    setShowErrorModal(false)
  }, [isLogIn])

  useEffect(() => {
    const id = process.env.REACT_APP_GOOGLEID
    if (!id) return
    setClientId(id)
  }, [])

  const onResponse = (response: any) => {
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
                // setUser(res.data.user)
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
    <LayoutTwo classes={['LogIn', 'page-container']}>
      <LayoutTwo classes={['upper-container', 'upper-outset']}>
        <LayoutTwo classes={['upper-inset', 'upper-inset-outset']}>
          <p>Welcome To</p>
        </LayoutTwo>
      </LayoutTwo>

      <LayoutTwo classes={['middle-container', 'mid-outset']}>
        <LayoutTwo classes={['mid-inset', 'login-container']}>
          <div className="title-container">
            <img src={flowLogo} alt="flow logo" />
          </div>

          <LayoutTwo classes={['user-input-container', 'user-login_shadow-div-outset']}>
            <div className="user-login-1_title">
              <div className="title_shadow-div-inset">{isLogIn ? `Sign Up` : `Log In`}</div>
            </div>

            <div className="user-login-2_other-logins">
              <InputError
                isOpen={showErrorModal}
                onClose={setShowErrorModal}
                message={errorMessage}
                options={{ position: [26.5, 13], size: [50, 74] }}
              />
              <div className="other-logins-1_google-btn">
                <div className="google-btn_shadow-div-outset">
                  <p>Continue with </p>
                  <GoogleLogin
                    clientId={clientId}
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
          </LayoutTwo>
        </LayoutTwo>

        <LayoutThree
          classes={['switch--container', 'switch--shadow-outset', 'switch--shadow-inset']}
        >
          <div className="switch__text--container">
            <p className="switch__text">
              {isLogIn ? 'Already a member of Flow?' : "Don't have an account?"}
            </p>
          </div>

          <div className="switch__btn--container">
            <button className="switch__btn" onClick={() => setIsLogIn(!isLogIn)}>
              {isLogIn ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </LayoutThree>
      </LayoutTwo>
    </LayoutTwo>
  )
}

export default Auth
