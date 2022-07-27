import { followIcon, commentIcon, thumbsUpIcon } from '../../../assets/images/_icons'
import { ISocialButtonProps } from './utils'
import { RoundButton, BtnColorsEnum } from '../RoundButton/RoundButton'
import { ButtonTypes } from '../Icon/Icon'

export const SocialButtonSongs = ({ type, total, onClick, hasUser }: ISocialButtonProps) => {
  const iconSize = type === 'Follow' ? 125 : type === 'Comment' ? 55 : 75

  return (
    <div className="songscreen__btn">
      <div className="songscreen__text--container">
        <div className="songscreen__text--wrapper">
          <p className="songscreen__text num">{total}</p>
          <p className="songscreen__text title">{total === 1 ? `${type}` : `${type}s`}</p>
        </div>
      </div>
      <div className={`social-button ${hasUser ? 'pushed' : ''}`}>
        <RoundButton
          type={type as ButtonTypes}
          btnOptions={{
            offset: 10,
            bgColor: BtnColorsEnum.Initial,
          }}
          iconOptions={{ color: 'Primary', size: iconSize }}
          onClick={onClick}
        />
      </div>
    </div>
  )
}

export const SocialButtonHome = ({
  type,
  total,
  onClick,
  hasUser,
  isPushed,
}: ISocialButtonProps) => {
  const icon = type === 'Follow' ? followIcon : type === 'Like' ? thumbsUpIcon : commentIcon
  return (
    <button
      className={`action-btn_shadow-div-outset ${hasUser ? 'liked-followed-commented' : ''} ${
        isPushed ? 'comment-pressed' : ''
      }`}
      style={type === 'Follow' ? { borderRadius: '50px 5px 5px 50px' } : {}}
      onClick={() => onClick()}
    >
      <div
        className="action-btn-icon_shadow-div-inset"
        style={type === 'Follow' ? { borderRadius: '40px 4px 4px 40px' } : {}}
      >
        <img className={`social-icons ${type}`} src={icon} alt={`${type} user icon`} />
      </div>

      <div className="action-btn-container">
        <div className="action-btn-text">
          <p style={{ color: 'white' }}>{total}</p>
          <p>{total === 1 ? `${type}` : `${type}s`}</p>
        </div>
      </div>
    </button>
  )
}
