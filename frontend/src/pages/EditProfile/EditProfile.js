import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import useDebugInformation from '../../utils/useDebugInformation'
import EditProfileCard from './EditProfileCard'
import ContinueModal from '../../components/ContinueModal'
import { goBackIcon } from '../../assets/images/_icons'

export default function EditProfile(props) {
  useDebugInformation('EditProfile', props)
  const { user } = useContext(TheContext)
  const navigate = useNavigate()

  const [thisUser, setThisUser] = useState()
  const [thisUsersSongs, setThisUsersSongs] = useState([])
  const [showExitModal, setShowExitModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState('Public')

  useEffect(() => {
    setThisUser(user)
  }, [user])

  useEffect(() => {
    actions
      .getUserSongs(thisUser)
      .then(res => {
        setThisUsersSongs(res.data)
      })
      .catch(console.error)
  }, [thisUser])

  const closeWindowHandler = e => {
    e.preventDefault()
    const inputsList = document.querySelectorAll('.edit-section__item-input')
    let showExitModal = false

    for (let i = 0; i < inputsList.length; i++) {
      if (inputsList[i].value !== '') {
        showExitModal = true
        break
      }
    }

    return showExitModal ? setShowExitModal(true) : onExitHandler()
  }

  const onExitHandler = () => {
    navigate(`/profile/${user?._id}`, { state: { propSongUser: user } })
  }

  const submit = e => {
    e.preventDefault()
    const form = e.target
    console.log(form[1].value, 'what is going on with this submit shit yo')

    // actions
    //   .addUserProf(thisUser)
    //   .then(newUserUpdate => {
    //     console.log('new new user update!', newUserUpdate)
    //   })
    //   .catch(console.error)
  }

  const [errorPath, setErrorPath] = useState('')
  const userNameInputRef = useRef()
  const aboutInputRef = useRef()
  const locationInputRef = useRef()
  const firstNameInputRef = useRef()
  const lastNameInputRef = useRef()
  const emailInputRef = useRef()
  const twitterInputRef = useRef()
  const instagramInputRef = useRef()
  const soundcloudInputRef = useRef()

  const [username, setUsername] = useState('')
  const [about, setAbout] = useState('')
  const [location, setLocation] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [soundcloud, setSoundcloud] = useState('')

  let PUBLIC_SECTION = [
    {
      name: 'user_name',
      placeholder: 'Username',
      type: 'text',
      autoComplete: 'off',
      inputRef: userNameInputRef,
      value: username,
      setValue: setUsername,
      errorPath: errorPath,
      borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
    },
    {
      name: 'about',
      placeholder: 'About',
      type: 'text',
      autoComplete: 'off',
      inputRef: aboutInputRef,
      value: about,
      setValue: setAbout,
      errorPath: errorPath,
      borderRadius: '0.5vh',
    },
    {
      name: 'location',
      placeholder: 'Location',
      type: 'text',
      autoComplete: 'off',
      inputRef: locationInputRef,
      value: location,
      setValue: setLocation,
      errorPath: errorPath,
      borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
    },
  ]

  let PERSONAL_SECTION = [
    {
      name: 'given_name',
      placeholder: 'First Name',
      type: 'text',
      autoComplete: 'off',
      inputRef: firstNameInputRef,
      value: firstname,
      setValue: setFirstname,
      errorPath: errorPath,
      borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
    },
    {
      name: 'family_name',
      placeholder: 'Last Name',
      type: 'text',
      autoComplete: 'off',
      inputRef: lastNameInputRef,
      value: lastname,
      setValue: setLastname,
      errorPath: errorPath,
      borderRadius: '0.5vh',
    },
    {
      name: 'email',
      placeholder: 'Email',
      type: 'text',
      autoComplete: 'off',
      inputRef: emailInputRef,
      value: email,
      setValue: setEmail,
      errorPath: errorPath,
      borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
    },
  ]

  let SOCIAL_SECTION = [
    {
      name: 'user_Twitter',
      placeholder: 'Twitter',
      type: 'text',
      autoComplete: 'off',
      inputRef: twitterInputRef,
      value: twitter,
      setValue: setTwitter,
      errorPath: errorPath,
      borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
    },
    {
      name: 'user_Instagram',
      placeholder: 'Instagram',
      type: 'text',
      autoComplete: 'off',
      inputRef: instagramInputRef,
      value: instagram,
      setValue: setInstagram,
      errorPath: errorPath,
      borderRadius: '0.5vh',
    },
    {
      name: 'user_SoundCloud',
      placeholder: 'SoundCloud',
      type: 'text',
      autoComplete: 'off',
      inputRef: soundcloudInputRef,
      value: soundcloud,
      setValue: setSoundcloud,
      errorPath: errorPath,
      borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
    },
  ]

  return (
    <div className="ProfileEditModal">
      <ContinueModal
        title={'Discard Changes'}
        text={'Are you sure you want to discard your changes?'}
        isOpen={showExitModal}
        onClose={setShowExitModal}
        onExit={onExitHandler}
      />
      <div className="edit-profile__body">
        <form className="edit-profile__form" onSubmit={e => submit(e)}>
          <div className="edit-profile__form--shadow-outset">
            <div className="edit-profile__form--shadow-inset">
              <div className="edit-profile__header">
                <div className="edit-profile__header--container">
                  <div className="edit-profile__header--shadow-outset">
                    <div className="edit-profile__go-back">
                      <div className="edit-profile__go-back--shadow-inset">
                        <button
                          className="edit-profile__go-back--shadow-outset"
                          type="button"
                          onClick={e => closeWindowHandler(e)}
                        >
                          <img className="button-icons" src={goBackIcon} alt="back" />
                        </button>
                      </div>
                    </div>
                    <div className="edit-profile__user-title">
                      <div className="edit-profile__user-title--shadow-inset">
                        <div className="edit-profile__user-title--container">
                          <h3>
                            Edit Your Profile <span>{thisUser?.user_name}</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="edit-profile__user-pic--container">
                  <div className="edit-profile__user-pic--shadow-outset">
                    <img src={thisUser?.picture ? thisUser?.picture : null} alt="profile"></img>
                  </div>
                </div>
              </div>
              <div className="edit-section">
                <EditProfileCard
                  title="Public"
                  items={PUBLIC_SECTION}
                  isExpanded={isExpanded}
                  onExpand={setIsExpanded}
                />
                <EditProfileCard
                  title="Personal"
                  items={PERSONAL_SECTION}
                  isExpanded={isExpanded}
                  onExpand={setIsExpanded}
                />
                <EditProfileCard
                  title="Social"
                  items={SOCIAL_SECTION}
                  isExpanded={isExpanded}
                  onExpand={setIsExpanded}
                />
                <EditProfileCard
                  title="Songs"
                  items={[]}
                  isExpanded={isExpanded}
                  onExpand={setIsExpanded}
                />
              </div>
            </div>
          </div>

          <div className="edit-profile__submit-all">
            <div className="switch--shadow-outset">
              <div className="switch--shadow-inset">
                <div className="switch__btn--container">
                  <button
                    className="switch__btn"
                    type="submit"
                    onMouseDown={e => e.preventDefault()}
                    onKeyDown={e => e.preventDefault()}
                  >
                    Save All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
