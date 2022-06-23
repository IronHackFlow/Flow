import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import { homeIcon, micIcon, searchIcon, profileIcon } from '../../assets/images/_icons'
import { LayoutTwo } from '../__Layout/LayoutWrappers'

type Props = {
  pageClass?: String
  isVisible?: Boolean
}

export default function Navbar({ pageClass, isVisible }: Props) {
  const { user } = useAuth()
  const location = useLocation()
  const path = location.pathname

  // <div
  //   className={`NavBar ${pageClass}`}
  //   style={isVisible ? { height: '0%', visibility: 'hidden' } : {}}
  // >
  return (
    <LayoutTwo classes={[`NavBar ${pageClass}`, 'navbar_section']}>
      <LayoutTwo classes={['navbar_shadow-div-outset', 'navbar_shadow-div-inset']}>
        <NavBarButton state={{}} path={'/'} selected={path} />
        <NavBarButton state={{}} path={'/record'} selected={path} />
        <NavBarButton state={{}} path={'/search'} selected={path} />
        <NavBarButton
          state={{}}
          path={user?._id ? `/profile/${user?._id}` : 'auth'}
          selected={path}
        />
      </LayoutTwo>
    </LayoutTwo>
  )
}

const NavBarButton = ({
  state = {},
  path,
  selected,
}: {
  state: {}
  path: string
  selected: string
}) => {
  const pathName =
    path === '/' ? 'home' : path.slice(0, 8) === '/profile' ? 'profile' : path.slice(1)
  const isSelected = path === selected ? 'btn-selected' : 'btn-unselected'
  const bRadius =
    pathName === 'home'
      ? '2.5em 0.3em 0.3em 2.5em'
      : pathName === 'profile'
      ? '0.3em 2.5em 2.5em 0.3em'
      : '0.3em'
  const icon =
    pathName === 'home'
      ? homeIcon
      : pathName === 'record'
      ? micIcon
      : pathName === 'search'
      ? searchIcon
      : profileIcon
  return (
    <Link
      to={path}
      className={`navbar-btn-container ${isSelected}`}
      state={state}
      style={{ borderRadius: bRadius }}
    >
      <LayoutTwo classes={['navbar-btn_shadow-div-inset', 'navbar-btn_shadow-div-outset']}>
        <img className="button-icons bi-record" src={icon} alt="icon" />
      </LayoutTwo>
      <div className="navbar-btn-text">{pathName}</div>
    </Link>
  )
}

{
  /* 
<Link
  to="/"
  className={`navbar-btn-container ${path === '/' ? 'btn-selected' : 'btn-unselected'}`}
  style={{ borderRadius: '2.5em 0.3em 0.3em 2.5em' }}
>
  <div className="navbar-btn_shadow-div-inset">
    <div className="navbar-btn_shadow-div-outset">
      <img className="button-icons bi-social" src={homeIcon} alt="social feed icon" />
    </div>
  </div>
  <div className="navbar-btn-text">Home</div>
</Link>

<Link
  to="/recordingBooth"
  className={`navbar-btn-container ${
    path === '/recordingBooth' ? 'btn-selected' : 'btn-unselected'
  }`}
>
  <div className="navbar-btn_shadow-div-inset">
    <div className="navbar-btn_shadow-div-outset">
      <img className="button-icons bi-record" src={micIcon} alt="record song icon" />
    </div>
  </div>
  <div className="navbar-btn-text">Record</div>
</Link>

<Link
  to="/search"
  state={{ returnValue: null }}
  className={`navbar-btn-container ${
    path === '/search' ? 'btn-selected' : 'btn-unselected'
  }`}
>
  <div className="navbar-btn_shadow-div-inset">
    <div className="navbar-btn_shadow-div-outset">
      <img className="button-icons" src={searchIcon} alt="search icon" />
    </div>
  </div>
  <div className="navbar-btn-text">Search</div>
</Link>

<Link
  to={user ? `/profile/${user?._id}` : '/auth'}
  state={{ propSongUser: user }}
  className={`navbar-btn-container ${
    path.slice(0, 8) === '/profile' ? 'btn-selected' : 'btn-unselected'
  }`}
  style={{ borderRadius: '0.3em 2.5em 2.5em 0.3em' }}
>
  <div className="navbar-btn_shadow-div-inset">
    <div className="navbar-btn_shadow-div-outset">
      <img
        className="button-icons bi-profile"
        src={profileIcon}
        alt="user profile icon"
        />
    </div>
  </div>
  <div className="navbar-btn-text">Profile</div>
</Link> 
*/
}
