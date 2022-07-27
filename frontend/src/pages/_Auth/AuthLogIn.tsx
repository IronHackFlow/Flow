import React, { useState, useRef, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import useHandleOSK from '../../hooks/useMobileKeyboardHandler'
import ButtonClearText from '../../components/_Buttons/ButtonClearText'
import ButtonShowPassword from '../../components/_Buttons/ButtonShowPassword'
import { logInSchema } from '../../utils/validationSchemas'

type Props = {
  showError: Dispatch<SetStateAction<boolean>>
  onError: Dispatch<SetStateAction<string>>
}

function AuthLogIn({ showError, onError }: Props) {
  const { login } = useAuth()
  const { handleOnFocus } = useHandleOSK()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const [errorPath, setErrorPath] = useState('')

  const userNameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const setErrorFocus = (errorPath: string) => {
    let username = userNameInputRef.current
    let password = passwordInputRef.current
    if (!username || !password) return

    if (errorPath === 'username') {
      username.focus()
    } else if (errorPath === 'password') {
      password.focus()
    }
  }

  const validateCredentials = async () => {
    const credentials = { username: username, password: password }
    let valid: { username: string; password: string } | undefined
    let errors

    await logInSchema
      .validate(credentials, { abortEarly: false })
      .then(isValid => {
        setErrorPath('')
        console.log(isValid, 'VALID?')
        valid = isValid
      })
      .catch(err => {
        setErrorFocus(err.inner[0].path)
        setErrorPath(err.inner[0].path)
        onError(err.errors[0])
        showError(true)
        errors = err.errors[0]
      })
    return { valid, errors }
  }

  const loginHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { valid, errors } = await validateCredentials()

    if (valid) {
      login(valid)
    } else {
      console.log(errors)
    }
  }

  const errorStyles = {
    border: '2px solid #ff6e6e',
    background: '#fc94a1',
    boxShadow: 'inset 2px 2px 3px #775656, inset -2px -2px 3px #ffbaba',
  }

  return (
    <div className="user-login-3_form">
      <form className="login-form" onSubmit={event => loginHandler(event)}>
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
                  aria-required="true"
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
                  aria-required="true"
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
