import { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import useHandleOSK from '../../utils/useHandleOSK'
import { signUpSchema } from '../../utils/validationSchemas'
import ButtonClearText from '../../components/ButtonClearText'
import ButtonShowPassword from '../../components/ButtonShowPassword'

function AuthSignUp({ showError, onError }) {
  const { user, setUser } = useContext(TheContext)
  const { handleOnFocus } = useHandleOSK()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const [errorPath, setErrorPath] = useState('')

  const userNameInputRef = useRef()
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const validateInputs = e => {
    const userData = { user_name: username, email: email, password: password }
    signUpSchema
      .validate(userData, { abortEarly: false })
      .then(valid => {
        setErrorPath('')
        signUpHandler(userData)
      })
      .catch(err => {
        handleErrorFocus(err.inner[0].path)
        setErrorPath(err.inner[0].path)
        onError(err.errors[0])
        showError(true)
      })
    e.preventDefault()
  }

  const handleErrorFocus = errorPath => {
    let username = userNameInputRef.current
    let email = emailInputRef.current
    let password = passwordInputRef.current

    if (errorPath === 'user_name') {
      username.focus()
    } else if (errorPath === 'email') {
      email.focus()
    } else if (errorPath === 'password') {
      password.focus()
    }
  }

  /// hahahahahahahahha wow that's a lot of async
  const signUpHandler = async userData => {
    try {
      actions
        .signUp(userData)
        .then(async res => {
          console.log(res.data)

          if (res.data.success) {
            await actions
              .logIn(userData)
              .then(async res => {
                if (res.data.success) {
                  localStorage.setItem('token', res.data.token)

                  await actions
                    .getAuthUser()
                    .then(res => {
                      console.log(res, 'I GOT AN AUTH USER HERE')
                      setUser(res.data.user)
                      navigate('/')
                    })
                    .catch(err => console.log(err))
                } else {
                  // TODO: create an error here to display on screen
                  console.log(res.data.message)
                }
              })
              .catch(console.error)
          } else {
            console.log(res.data.message)

            if (res.data.path) {
              handleErrorFocus(res.data.path)
              setErrorPath(res.data.path)
              onError(res.data.message)
              showError(true)
            }
          }
        })
        .catch(console.error)
    } catch (err) {
      console.log(err)
    }
  }

  const errorStyles = {
    border: '2px solid #ff6e6e',
    background: '#fc94a1',
    boxShadow: 'inset 2px 2px 3px #775656, inset -2px -2px 3px #ffbaba',
  }

  return (
    <div className="user-login-3_form">
      <form className="login-form" onSubmit={e => validateInputs(e)}>
        <div className="user-form-container">
          <div className="login-input-container email-container">
            <div
              className="login-input_shadow-div-outset email"
              style={{ borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh' }}
            >
              <div className="input-container">
                <input
                  style={{ display: 'none' }}
                  type="submit"
                  name="prevent-enter-submit"
                  onClick={() => false}
                />
                <input
                  className="login-input-field email-input"
                  style={errorPath === 'user_name' ? errorStyles : {}}
                  ref={userNameInputRef}
                  placeholder="Username"
                  autoComplete="off"
                  type="text"
                  name="user_name"
                  onFocus={() => handleOnFocus()}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
                inputRef={userNameInputRef}
                value={username}
                setValue={setUsername}
              />
            </div>
          </div>

          <div className="login-input-container email-container">
            <div className="login-input_shadow-div-outset email" style={{ borderRadius: '0.5vh' }}>
              <div className="input-container">
                <input
                  className="login-input-field email-input"
                  style={errorPath === 'email' ? errorStyles : {}}
                  ref={emailInputRef}
                  placeholder="Email"
                  autoComplete="off"
                  type="email"
                  name="email"
                  onFocus={() => handleOnFocus()}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
                inputRef={emailInputRef}
                value={email}
                setValue={setEmail}
              />
            </div>
          </div>

          <div className="login-input-container password-container">
            <div
              className="login-input_shadow-div-outset password"
              style={{ borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh' }}
            >
              <div className="input-container">
                <input
                  className="login-input-field password-input"
                  style={errorPath === 'password' ? errorStyles : {}}
                  ref={passwordInputRef}
                  placeholder="Password"
                  type={passwordType}
                  autoComplete="new-password"
                  name="password"
                  onFocus={() => handleOnFocus()}
                  onChange={e => setPassword(e.target.value)}
                />
                <ButtonShowPassword setType={setPasswordType} password={password} />
              </div>
              <ButtonClearText
                inset={true}
                shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
                inputRef={passwordInputRef}
                value={password}
                setValue={setPassword}
              />
            </div>
          </div>
        </div>

        <div className="form__enter-btn--container">
          {/* {username !== "" && password !== "" && email !== ""
            ? (
              <button
                className="form__enter-btn"
                type="submit"
              >
                <h4>Sign In</h4>
              </button>
            ) : (
              <div
                className="form__enter-btn inactive"
              >
                <h4>Sign In</h4>
              </div>
            )} */}
          <button
            className="form__enter-btn"
            type="submit"
            onMouseDown={e => e.preventDefault()}
            onKeyDown={e => e.preventDefault()}
          >
            <h4>Sign Up</h4>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthSignUp
