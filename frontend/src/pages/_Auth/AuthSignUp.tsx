import { useState, useRef, Dispatch, SetStateAction } from 'react'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import useHandleOSK from '../../hooks/useMobileKeyboardHandler'
import { signUpSchema } from '../../utils/validationSchemas'
import ButtonClearText from '../../components/_Buttons/ButtonClearText'
import ButtonShowPassword from '../../components/_Buttons/ButtonShowPassword'

type Props = {
  showError: Dispatch<SetStateAction<boolean>>
  onError: Dispatch<SetStateAction<string>>
}

function AuthSignUp({ showError, onError }: Props) {
  const { register } = useAuth()
  const { handleOnFocus } = useHandleOSK()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const [errorPath, setErrorPath] = useState('')

  const userNameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const validateCredentials = async () => {
    const credentials = { username: username, email: email, password: password }
    let valid: { username: string; email: string; password: string } | undefined
    let errors

    await signUpSchema
      .validate(credentials, { abortEarly: false })
      .then(isValid => {
        setErrorPath('')
        valid = isValid
      })
      .catch(err => {
        handleErrorFocus(err.inner[0].path)
        setErrorPath(err.inner[0].path)
        onError(err.errors[0])
        showError(true)
        errors = err.errors[0]
      })
    return { valid, errors }
  }

  const handleErrorFocus = (errorPath: string) => {
    let username = userNameInputRef.current
    let email = emailInputRef.current
    let password = passwordInputRef.current

    if (!username || !email || !password) return
    if (errorPath === 'user_name') {
      username.focus()
    } else if (errorPath === 'email') {
      email.focus()
    } else if (errorPath === 'password') {
      password.focus()
    }
  }

  const registerHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { valid, errors } = await validateCredentials()

    if (valid) {
      register(valid)
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
      <form className="login-form" onSubmit={e => registerHandler(e)}>
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
