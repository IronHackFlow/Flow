import React from 'react'
import { followIcon, commentIcon, thumbsUpIcon } from '../../assets/images/_icons'

type ButtonProps = {
  type: string
  total: number
  onClick: any
  hasUser: boolean
  isPushed?: boolean
  // isLoading: boolean
}

enum SocialKeys {
  Like = "Like",
  Follow = "Follow",
  Comment = "Comment",
  Edit = "Edit",
  Delete = "Delete",
}

export const HomeSocialButton = ({type, total, onClick, hasUser, isPushed}: ButtonProps) => {
  let icon = type === 'follow' ? followIcon : type === 'like' ? thumbsUpIcon : commentIcon
  return (
    <button
      className={`action-btn_shadow-div-outset ${hasUser ? 'liked-followed-commented' : ''} ${isPushed ? 'comment-pressed' : ''}`}
      style={type === 'follow' ? { borderRadius: '50px 5px 5px 50px' } : {}}
      onClick={() => onClick()}
    >
      <div
        className="action-btn-icon_shadow-div-inset"
        style={type === 'follow' ? { borderRadius: '40px 4px 4px 40px' } : {}}
      >
        <img
          className={`social-icons ${type}`}
          src={icon}
          alt={`${type} user icon`}
        />
      </div>

      <div className="action-btn-container">
        {/* <div
          className="loading loading-btn"
          style={isLoading ? { opacity: '1' } : { opacity: '0' }}
        ></div> */}
        <div className="action-btn-text">
          <p style={{ color: 'white' }}>{total}</p>
          <p>{total === 1 ? `${type}` : `${type}s`}</p>
        </div>
      </div>
    </button>
  )
}
