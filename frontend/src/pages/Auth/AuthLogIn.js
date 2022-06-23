import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import actions from '../../api'
import { UserContext } from '../../contexts/AuthContext'
import useHandleOSK from '../../hooks/useMobileKeyboardHandler'
import ButtonClearText from '../../components/ButtonClearText'
import ButtonShowPassword from '../../components/ButtonShowPassword'
import { logInSchema } from '../../utils/validationSchemas'

function AuthLogIn({ showError, onError }) {
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const { handleOnFocus } = useHandleOSK()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const [errorPath, setErrorPath] = useState('')

  const userNameInputRef = useRef()
  const passwordInputRef = useRef()

  const validateInputs = e => {
    e.preventDefault()
    const userData = { user_name: username, password: password }
    logInSchema
      .validate(userData, { abortEarly: false })
      .then(valid => {
        setErrorPath('')
        handleLogIn(valid)
      })
      .catch(err => {
        setErrorFocus(err.inner[0].path)
        setErrorPath(err.inner[0].path)
        onError(err.errors[0])
        showError(true)
      })
  }

  const setErrorFocus = errorPath => {
    let username = userNameInputRef.current
    let password = passwordInputRef.current

    if (errorPath === 'user_name') {
      username.focus()
    } else if (errorPath === 'password') {
      password.focus()
    }
  }

  const handleLogIn = async userData => {
    try {
      const res = await actions
        .logIn(userData)
        .then(async res => {
          if (res.data.success) {
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
            if (res.data.path) {
              setErrorFocus(res.data.path)
              setErrorPath(res.data.path)
              onError(res.data.message)
              showError(true)
            }
          }
        })
        .catch(err => console.log(err))
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
        <div className="user-form-container" style={{ justifyContent: 'flex-start' }}>
          <div className="login-input-container email-container" style={{ height: '40%' }}>
            <div
              className="login-input_shadow-div-outset email"
              style={{ borderRadius: '2.8vh 2.8vh .5vh .5vh' }}
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
                  ariarequired="true"
                  placeholder="Username"
                  type="text"
                  autoComplete="off"
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

          <div className="login-input-container password-container" style={{ height: '40%' }}>
            <div
              className="login-input_shadow-div-outset password"
              style={{ borderRadius: '.5vh .5vh 2.8vh 2.8vh' }}
            >
              <div className="input-container">
                <input
                  className="login-input-field password-input"
                  style={errorPath === 'password' ? errorStyles : {}}
                  ref={passwordInputRef}
                  arearequired="true"
                  placeholder="Password"
                  type={passwordType}
                  autoComplete="current-password"
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
          {/* {username !== "" && password !== "" 
          ? ( */}
          <button className="form__enter-btn" type="submit">
            <h4>Log In</h4>
          </button>
          {/* ) : (
            <div
              className="form__enter-btn inactive"
            >
              <h4>Log In</h4>
            </div>
          )} */}
        </div>
      </form>
    </div>
  )
}

export default AuthLogIn
