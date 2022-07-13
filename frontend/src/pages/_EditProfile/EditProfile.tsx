import { useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import EditProfileCard from './EditProfileCard'
import ContinueModal from 'src/components/_Modals/ContinueModal'
import { goBackIcon } from '../../assets/images/_icons'
import { IUser, ISong } from '../../interfaces/IModels'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'

enum ProfileSections {
  Public = 'Public',
  Personal = 'Personal',
  Social = 'Social',
  Songs = 'Songs',
}

export default function EditProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // const [editUser, setEditUser] = useState<IUser>({ ...user })
  const [usersSongs, setUsersSongs] = useState<ISong[]>([])
  const [showExitModal, setShowExitModal] = useState<boolean>(false)
  const [toExpand, setToExpand] = useState<string>(ProfileSections.Public)

  useEffect(() => {
    const songs: ISong[] | undefined = queryClient.getQueryData(['user', 'songs', user?._id])
    if (songs) {
      setUsersSongs(songs)
    }
  }, [])

  const onGoBackHandler = () => {
    const inputList: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      '.edit-section__item-input',
    )
    let showExitModal = false

    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i]?.value !== '') {
        showExitModal = true
        break
      }
    }

    return showExitModal ? setShowExitModal(true) : onExitHandler()
  }

  const onExitHandler = () => {
    navigate(`/profile/${user?._id}`, { state: { propSongUser: user } })
  }

  const onSubmitAllHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target

    // actions
    //   .addUserProf(thisUser)
    //   .then(newUserUpdate => {
    //     console.log('new new user update!', newUserUpdate)
    //   })
    //   .catch(console.error)
  }

  return (
    <LayoutTwo classes={['ProfileEditModal', 'edit-profile__body']}>
      <ContinueModal
        title={'Discard Changes'}
        text={'Are you sure you want to discard your changes?'}
        isOpen={showExitModal}
        onClose={setShowExitModal}
        onExit={onExitHandler}
      />
      <form className="edit-profile__form" onSubmit={e => onSubmitAllHandler(e)}>
        <LayoutTwo
          classes={['edit-profile__form--shadow-outset', 'edit-profile__form--shadow-inset']}
        >
          <div className="edit-profile__header">
            <LayoutTwo
              classes={['edit-profile__header--container', 'edit-profile__header--shadow-outset']}
            >
              <LayoutTwo classes={['edit-profile__go-back', 'edit-profile__go-back--shadow-inset']}>
                <button
                  className="edit-profile__go-back--shadow-outset"
                  type="button"
                  onClick={() => onGoBackHandler()}
                >
                  <img className="button-icons" src={goBackIcon} alt="back" />
                </button>
              </LayoutTwo>
              <LayoutThree
                classes={[
                  'edit-profile__user-title',
                  'edit-profile__user-title--shadow-inset',
                  'edit-profile__user-title--container',
                ]}
              >
                <h3>
                  Edit Your Profile <span>{user?.username}</span>
                </h3>
              </LayoutThree>
            </LayoutTwo>
            <LayoutThree
              classes={[
                'edit-profile__user-pic--container',
                'edit-profile__user-pic--shadow-outset',
                'edit-profile__user-pic--shadow-inset',
              ]}
            >
              <img src={user?.picture ? user?.picture : ''} alt="profile"></img>
            </LayoutThree>
          </div>

          <div className="edit-section">
            <EditProfileCard
              title={ProfileSections.Public}
              toExpand={toExpand}
              onExpand={setToExpand}
            />
            <EditProfileCard
              title={ProfileSections.Personal}
              toExpand={toExpand}
              onExpand={setToExpand}
            />
            <EditProfileCard
              title={ProfileSections.Social}
              toExpand={toExpand}
              onExpand={setToExpand}
            />
            <EditProfileCard
              title={ProfileSections.Songs}
              toExpand={toExpand}
              onExpand={setToExpand}
            />
          </div>
        </LayoutTwo>

        <LayoutTwo classes={['edit-profile__submit-all', 'switch--shadow-outset']}>
          <LayoutTwo classes={['switch--shadow-inset', 'switch__btn--container']}>
            <button
              className="switch__btn"
              type="submit"
              onMouseDown={e => e.preventDefault()}
              onKeyDown={e => e.preventDefault()}
            >
              Save All
            </button>
          </LayoutTwo>
        </LayoutTwo>
      </form>
    </LayoutTwo>
  )
}
