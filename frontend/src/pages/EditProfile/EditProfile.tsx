import { useContext, useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import actions from '../../api'
// import { UserContext } from '../../contexts/AuthContext'
// import useDebugInformation from '../../utils/useDebugInformation'
// import EditProfileCard from './EditProfileCard'
// import ContinueModal from '../../components/ContinueModal'
// import { goBackIcon } from '../../assets/images/_icons'
// import { User, Song } from '../../constants/Types'

// interface PropStateType {
//   songs: Array<{ song: Song, songVideo: string }>
// }

// export interface SectionType {
//   name: string,
//   placeholder: string,
//   type: string,
//   autoComplete: string,
//   value: string,
//   setValue: Dispatch<SetStateAction<string>>,
//   errorPath: string,
//   borderRadius: string,

// }

// export default function EditProfile() {
//   const { user } = useContext(UserContext)
//   const navigate = useNavigate()
//   const domLocation = useLocation()
//   const state = domLocation.state as PropStateType
//   const { songs } = state

//   const [thisUser, setThisUser] = useState<Partial<User>>()
//   const [thisUsersSongs, setThisUsersSongs] = useState([])
//   const [showExitModal, setShowExitModal] = useState<boolean>(false)
//   const [toExpand, setToExpand] = useState<string>('Public')

//   useEffect(() => {
//     setThisUser(user)
//   }, [user])

//   useEffect(() => {
//     actions
//       .getUserSongs(thisUser)
//       .then(res => {
//         setThisUsersSongs(res.data)
//       })
//       .catch(console.error)
//   }, [thisUser])

//   const closeWindowHandler = () => {
//     const inputsList: NodeListOf<HTMLInputElement> = document.querySelectorAll('.edit-section__item-input')
//     let showExitModal = false

//     for (let i = 0; i < inputsList.length; i++) {
//       if (inputsList[i]?.value !== '') {
//         showExitModal = true
//         break
//       }
//     }

//     return showExitModal ? setShowExitModal(true) : onExitHandler()
//   }

//   const onExitHandler = () => {
//     navigate(`/profile/${user?._id}`, { state: { propSongUser: user } })
//   }

//   const submit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const form = e.target

//     // actions
//     //   .addUserProf(thisUser)
//     //   .then(newUserUpdate => {
//     //     console.log('new new user update!', newUserUpdate)
//     //   })
//     //   .catch(console.error)
//   }

//   const [errorPath, setErrorPath] = useState('')
//   const [username, setUsername] = useState('')
//   const [about, setAbout] = useState('')
//   const [location, setLocation] = useState('')
//   const [firstname, setFirstname] = useState('')
//   const [lastname, setLastname] = useState('')
//   const [email, setEmail] = useState('')
//   const [twitter, setTwitter] = useState('')
//   const [instagram, setInstagram] = useState('')
//   const [soundcloud, setSoundcloud] = useState('')

//   let PUBLIC_SECTION: Array<SectionType> = [
//     {
//       name: 'user_name',
//       placeholder: 'Username',
//       type: 'text',
//       autoComplete: 'off',
//       value: username,
//       setValue: setUsername,
//       errorPath: errorPath,
//       borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
//     },
//     {
//       name: 'about',
//       placeholder: 'About',
//       type: 'text',
//       autoComplete: 'off',
//       value: about,
//       setValue: setAbout,
//       errorPath: errorPath,
//       borderRadius: '0.5vh',
//     },
//     {
//       name: 'location',
//       placeholder: 'Location',
//       type: 'text',
//       autoComplete: 'off',
//       value: location,
//       setValue: setLocation,
//       errorPath: errorPath,
//       borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
//     },
//   ]

//   let PERSONAL_SECTION: Array<SectionType> = [
//     {
//       name: 'given_name',
//       placeholder: 'First Name',
//       type: 'text',
//       autoComplete: 'off',
//       value: firstname,
//       setValue: setFirstname,
//       errorPath: errorPath,
//       borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
//     },
//     {
//       name: 'family_name',
//       placeholder: 'Last Name',
//       type: 'text',
//       autoComplete: 'off',
//       value: lastname,
//       setValue: setLastname,
//       errorPath: errorPath,
//       borderRadius: '0.5vh',
//     },
//     {
//       name: 'email',
//       placeholder: 'Email',
//       type: 'text',
//       autoComplete: 'off',
//       value: email,
//       setValue: setEmail,
//       errorPath: errorPath,
//       borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
//     },
//   ]

//   let SOCIAL_SECTION: Array<SectionType> = [
//     {
//       name: 'user_Twitter',
//       placeholder: 'Twitter',
//       type: 'text',
//       autoComplete: 'off',
//       value: twitter,
//       setValue: setTwitter,
//       errorPath: errorPath,
//       borderRadius: '2.8vh 2.8vh 0.5vh 0.5vh',
//     },
//     {
//       name: 'user_Instagram',
//       placeholder: 'Instagram',
//       type: 'text',
//       autoComplete: 'off',
//       value: instagram,
//       setValue: setInstagram,
//       errorPath: errorPath,
//       borderRadius: '0.5vh',
//     },
//     {
//       name: 'user_SoundCloud',
//       placeholder: 'SoundCloud',
//       type: 'text',
//       autoComplete: 'off',
//       value: soundcloud,
//       setValue: setSoundcloud,
//       errorPath: errorPath,
//       borderRadius: '0.5vh 0.5vh 2.8vh 2.8vh',
//     },
//   ]

//   return (
//     <div className="ProfileEditModal">
//       <ContinueModal
//         title={'Discard Changes'}
//         text={'Are you sure you want to discard your changes?'}
//         isOpen={showExitModal}
//         onClose={setShowExitModal}
//         onExit={onExitHandler}
//       />
//       <div className="edit-profile__body">
//         <form className="edit-profile__form" onSubmit={e => submit(e)}>
//           <div className="edit-profile__form--shadow-outset">
//             <div className="edit-profile__form--shadow-inset">
//               <div className="edit-profile__header">
//                 <div className="edit-profile__header--container">
//                   <div className="edit-profile__header--shadow-outset">
//                     <div className="edit-profile__go-back">
//                       <div className="edit-profile__go-back--shadow-inset">
//                         <button
//                           className="edit-profile__go-back--shadow-outset"
//                           type="button"
//                           onClick={() => closeWindowHandler()}
//                         >
//                           <img className="button-icons" src={goBackIcon} alt="back" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="edit-profile__user-title">
//                       <div className="edit-profile__user-title--shadow-inset">
//                         <div className="edit-profile__user-title--container">
//                           <h3>
//                             Edit Your Profile <span>{thisUser?.user_name}</span>
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="edit-profile__user-pic--container">
//                   <div className="edit-profile__user-pic--shadow-outset">
//                     <img src={thisUser?.picture ? thisUser?.picture : ""} alt="profile"></img>
//                   </div>
//                 </div>
//               </div>
//               <div className="edit-section">
//                 <EditProfileCard
//                   title="Public"
//                   items={PUBLIC_SECTION}
//                   songs={[]}
//                   toExpand={toExpand}
//                   onExpand={setToExpand}
//                 />
//                 <EditProfileCard
//                   title="Personal"
//                   items={PERSONAL_SECTION}
//                   songs={[]}
//                   toExpand={toExpand}
//                   onExpand={setToExpand}
//                 />
//                 <EditProfileCard
//                   title="Social"
//                   items={SOCIAL_SECTION}
//                   songs={[]}
//                   toExpand={toExpand}
//                   onExpand={setToExpand}
//                 />
//                 <EditProfileCard
//                   title="Songs"
//                   items={[]}
//                   songs={songs}
//                   toExpand={toExpand}
//                   onExpand={setToExpand}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="edit-profile__submit-all">
//             <div className="switch--shadow-outset">
//               <div className="switch--shadow-inset">
//                 <div className="switch__btn--container">
//                   <button
//                     className="switch__btn"
//                     type="submit"
//                     onMouseDown={e => e.preventDefault()}
//                     onKeyDown={e => e.preventDefault()}
//                   >
//                     Save All
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
