import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../contexts/TheContext'
import { homeIcon, micIcon, searchIcon, profileIcon } from '../assets/images/_icons'

function NavBar(props) {
  // useDebugInformation("NavBar", props)
  const { user, locationIndicator } = React.useContext(TheContext)
  const [selectedBtn, setSelectedBtn] = useState('')

  useEffect(() => {
    if (locationIndicator?.pathname === '/') {
      setSelectedBtn('home')
    }  else if (locationIndicator?.pathname === '/search') {
      setSelectedBtn('search')
    }  else if (locationIndicator?.pathname.slice(0, 8) === '/profile') {
      setSelectedBtn('profile')
    } else if (locationIndicator?.pathname === "/recordingBooth") {
      setSelectedBtn('recordBooth')
    }
  }, [locationIndicator])

  return (
    <div className={`NavBar ${props.locationClass}`}>
      <div className="navbar_section">
        <div className="navbar_shadow-div-outset">
          <div className="navbar_shadow-div-inset">
            <Link
              // to={user ? "/" : "auth"}
              to="/"
              className={`navbar-btn-container ${selectedBtn === 'home' ? "btn-selected" : 'btn-unselected'}`}
              style={{ borderRadius: '40px 8px 8px 40px' }}
            >
              <div className="navbar-btn_shadow-div-inset">
                <div className="navbar-btn_shadow-div-outset">
                  <img
                    className="button-icons bi-social"
                    src={homeIcon}
                    alt="social feed icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text">
                Home
              </div>
            </Link>

            <Link
              to={"/recordingBooth"}
              className={`navbar-btn-container ${selectedBtn === 'recordBooth' ? "btn-selected" : 'btn-unselected'}`}
            >
              <div className="navbar-btn_shadow-div-inset">
                <div className="navbar-btn_shadow-div-outset">
                  <img
                    className="button-icons bi-record"
                    src={micIcon}
                    alt="record song icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text">
                Record
              </div>
            </Link>

            <Link 
              to={{pathname: "/search", link: locationIndicator?.pathname }} 
              className={`navbar-btn-container ${selectedBtn === 'search' ? "btn-selected" : 'btn-unselected'}`}
            >
              <div className="navbar-btn_shadow-div-inset">
                <div className="navbar-btn_shadow-div-outset">
                  <img
                    className="button-icons"
                    src={searchIcon}
                    alt="search icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text">
                Search
              </div>
            </Link>

            <Link
              to={user ? `/profile/${user?._id}` : '/auth'}
              state={{ propSongUser: user }}
              className={`navbar-btn-container ${selectedBtn === 'profile' ? "btn-selected" : 'btn-unselected'}`}
              style={{ borderRadius: '8px 40px 40px 8px' }}
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
              <div className="navbar-btn-text">
                Profile
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
