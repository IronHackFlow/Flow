import { useContext, useEffect, useState } from 'react'
import TheContext from '../contexts/TheContext'
import { SongDataContext } from '../contexts/SongData'
import { followIcon, thumbsUpIcon } from '../assets/images/_icons'

export default function ButtonSocialAction({ type, songInView, btnStyle, action }) {
  const { user } = useContext(TheContext)
  const { isLoading } = useContext(SongDataContext)
  const [total, setTotal] = useState()
  const [hasUser, setHasUser] = useState()
  const [usersAction, setUsersAction] = useState({})

  const userId = user?._id
  const id = songInView?.id
  const socialList = songInView?.list

  useEffect(() => {
    setHasUser(false)
    setTotal(socialList?.length)

    for (let i = 0; i < socialList?.length; i++) {
      if (socialList[i].user === userId) {
        setHasUser(true)
        setUsersAction(socialList[i])
        break
      }
    }
  }, [songInView?.list])

  const postHandler = () => {
    if (hasUser) {
      action.delete(id, usersAction)
      setHasUser(false)
      setTotal(prev => prev - 1)
    } else {
      action.add(id, setUsersAction)
      setHasUser(true)
      setTotal(prev => prev + 1)
    }
  }

  if (btnStyle === 'home') {
    return (
      <button
        className={`action-btn_shadow-div-outset ${hasUser ? 'liked-followed-commented' : ''}`}
        style={type === 'follow' ? { borderRadius: '50px 5px 5px 50px' } : {}}
        onClick={() => postHandler()}
      >
        <div
          className="action-btn-icon_shadow-div-inset"
          style={type === 'follow' ? { borderRadius: '40px 4px 4px 40px' } : {}}
        >
          <img
            className={`social-icons ${type}`}
            src={type === 'follow' ? followIcon : thumbsUpIcon}
            alt={`${type} user icon`}
          />
        </div>

        <div className="action-btn-container">
          <div
            className="loading loading-btn"
            style={isLoading ? { opacity: '1' } : { opacity: '0' }}
          ></div>
          <div className="action-btn-text">
            <p style={{ color: 'white' }}>{total}</p>
            <p>{total === 1 ? `${type}` : `${type}s`}</p>
          </div>
        </div>
      </button>
    )
  } else {
    return (
      <div className="songscreen__btn">
        <div className="songscreen__text--container">
          <p className="songscreen__text num">{total}</p>
          <p className="songscreen__text title">{total === 1 ? `${type}` : `${type}s`}</p>
        </div>
        <button
          className={`social-button ${hasUser ? 'pushed' : ''}`}
          onClick={e => {
            e.target.style.transition = 'all .2s ease-in'
            postHandler()
          }}
        >
          <img
            className={`social-icons ${type}`}
            src={type === 'follow' ? followIcon : thumbsUpIcon}
            alt={`${type} user icon`}
          />
        </button>
      </div>
    )
  }
}
