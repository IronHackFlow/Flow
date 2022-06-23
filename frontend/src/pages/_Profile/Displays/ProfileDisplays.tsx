import React, { PropsWithChildren } from 'react'
import { followersIcon, followingIcon, thumbsUpIcon } from '../../../assets/images/_icons'
import { LayoutThree } from '../../../components/__Layout/LayoutWrappers'

type ProfileDataProps = PropsWithChildren<{
  title: string
  addClass: string
}>

export const DataField = ({ title, addClass, children }: ProfileDataProps) => {
  return (
    <div className={`users-details-each ${addClass}`}>
      <div className="p-1">
        <p>{title}: </p>
      </div>
      <div className="p-2">{children}</div>
    </div>
  )
}

export const SocialProofItem = ({ title, addClass, children }: ProfileDataProps) => {
  const value =
    addClass === '1' ? '35px 4px 4px 4px' : addClass === '2' ? '4px' : '4px 4px 4px 35px'
  const margin = addClass === '1' ? '12% 0% 0% 8%' : addClass === '3' ? '0% 0% 20% 5%' : 'none'
  const icon = addClass === '1' ? followersIcon : addClass === '2' ? followingIcon : thumbsUpIcon

  return (
    <div className={`each-button-container ebc-${addClass}`}>
      <div className="profile-button-outset" style={{ borderRadius: value }}>
        <div className={`profile-button-inset pbe-${addClass}`}>
          <p className="number-container">{children}</p>
          <div className="icon-container">
            <img
              className="button-icons logout"
              src={icon}
              style={{ margin: margin }}
              alt={`${title} icon`}
            />
          </div>
        </div>
        <div className="btn-title">{title}</div>
      </div>
    </div>
  )
}

// export const NoSongsDisplay = ({thisId, userId}: {thisId: string | undefined, userId: string | undefined}) => {
export const NoSongsDisplay = () => {
  return (
    <li className="profile-songs__item">
      <div className="profile-songs__body">
        <LayoutThree
          classes={[
            'profile-songs__header',
            'profile-songs__header--shadow-outset',
            'profile-songs__title',
          ]}
        >
          <p className="profile-songs__title-text" style={{ fontWeight: 'bold', fontSize: '14px' }}>
            User hasn't saved any Flows
          </p>
        </LayoutThree>
        <LayoutThree
          classes={[
            'profile-songs__lyrics',
            'profile-songs__lyrics--shadow-outset',
            'profile-songs__lyrics-text',
          ]}
        >
          <p>
            {/* {thisId === userId
              ? 'Go to the Recording Booth to start your budding new rap career!'
              : ''} */}
          </p>
        </LayoutThree>
      </div>
      <div className="profile-songs__action-btns--container">
        <div className="buttons-inner"></div>
      </div>
    </li>
  )
}
