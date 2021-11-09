import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../TheContext'
import mic from '../images/modern-mic.svg'
import avatar from '../images/avatar.svg'
import home from '../images/home.svg'
import search from '../images/search.svg'

function NavBar(props) {
  const { user, setUser, setUserViewed, locationIndicator } = React.useContext(TheContext)

  const socialBtnRef1 = useRef()
  const socialBtnRef2 = useRef()
  const socialBtnRef3 = useRef()
  const socialBtnRef4 = useRef()
  const socialBtnRef5 = useRef()
  const searchBtnRef1 = useRef()
  const searchBtnRef2 = useRef()
  const searchBtnRef3 = useRef()
  const searchBtnRef4 = useRef()
  const searchBtnRef5 = useRef()
  const profileBtnRef1 = useRef()
  const profileBtnRef2 = useRef()
  const profileBtnRef3 = useRef()
  const profileBtnRef4 = useRef()
  const profileBtnRef5 = useRef()
  const recordBtnRef1 = useRef()
  const recordBtnRef2 = useRef()
  const recordBtnRef3 = useRef()
  const recordBtnRef4 = useRef()
  const recordBtnRef5 = useRef()

  useEffect(() => {
    user ? setUserViewed(user) : setUser({})
  }, [])

  useEffect(() => {
    if (props.searchPoppedUp === true) {
      searchBtnRef1.current.style.background = '#ec6aa0'
      searchBtnRef1.current.style.boxShadow =
        '#523c45 2px 2px 3px inset, #fab1cf -2px -2px 3px inset'
      searchBtnRef1.current.style.border = '1px solid #ec6aa0'
      searchBtnRef1.current.style.transition = 'all .4s'
      searchBtnRef2.current.style.boxShadow =
        'rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset'
      searchBtnRef2.current.style.height = '32px'
      searchBtnRef2.current.style.width = '32px'
      searchBtnRef2.current.style.transition = 'all .4s'
      searchBtnRef3.current.style.boxShadow = 'none'
      searchBtnRef4.current.style.filter =
        'invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)'
      searchBtnRef5.current.style.color = 'white'
    } else if (props.searchPoppedUp === false) {
      if (locationIndicator?.pathname === '/recordingBooth') {
        searchBtnRef1.current.style.background = 'initial'
        searchBtnRef1.current.style.boxShadow = '2px 2px 3px #353535, -3px -3px 4px #787878'
        searchBtnRef1.current.style.border = 'none'
        searchBtnRef1.current.style.transition = 'all .4s'
        searchBtnRef2.current.style.boxShadow =
          '#333333 2px 2px 3px 0px inset, #838383 -2px -2px 3px inset'
        searchBtnRef2.current.style.height = '40px'
        searchBtnRef2.current.style.width = '40px'
        searchBtnRef2.current.style.transition = 'all .4s'
        searchBtnRef3.current.style.boxShadow = '#333333 2px 2px 3px 0px, #838383 -2px -2px 3px'
        searchBtnRef4.current.style.filter =
          'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
        searchBtnRef5.current.style.color = '#ff8ebd'
      } else {
        searchBtnRef1.current.style.background = 'initial'
        searchBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
        searchBtnRef1.current.style.border = 'none'
        searchBtnRef1.current.style.transition = 'all .4s'
        searchBtnRef2.current.style.boxShadow =
          'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
        searchBtnRef2.current.style.height = '40px'
        searchBtnRef2.current.style.width = '40px'
        searchBtnRef2.current.style.transition = 'all .4s'
        searchBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
        searchBtnRef4.current.style.filter =
          'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
        searchBtnRef5.current.style.color = '#ff8ebd'
      }
    }

    if (locationIndicator?.pathname.slice(0, 8) === '/profile') {
      profileBtnRef1.current.style.background = '#ec6aa0'
      profileBtnRef1.current.style.boxShadow =
        'inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8'
      profileBtnRef1.current.style.border = '1px solid #ec6aa0'
      profileBtnRef1.current.style.transition = 'all .4s'
      profileBtnRef2.current.style.boxShadow =
        'rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset'
      profileBtnRef2.current.style.height = '32px'
      profileBtnRef2.current.style.width = '32px'
      profileBtnRef2.current.style.transition = 'all .4s'
      profileBtnRef3.current.style.boxShadow = 'none'
      profileBtnRef4.current.style.filter =
        'invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)'
      profileBtnRef5.current.style.color = 'white'

      socialBtnRef1.current.style.background = 'initial'
      socialBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
      socialBtnRef1.current.style.border = 'none'
      socialBtnRef1.current.style.transition = 'all .4s'
      socialBtnRef2.current.style.boxShadow =
        'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
      socialBtnRef2.current.style.height = '40px'
      socialBtnRef2.current.style.width = '40px'
      socialBtnRef2.current.style.transition = 'all .4s'
      socialBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
      socialBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      socialBtnRef5.current.style.color = '#ff8ebd'

      recordBtnRef1.current.style.background = 'initial'
      recordBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
      recordBtnRef1.current.style.border = 'none'
      recordBtnRef1.current.style.transition = 'all .4s'
      recordBtnRef2.current.style.boxShadow =
        'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
      recordBtnRef2.current.style.height = '40px'
      recordBtnRef2.current.style.width = '40px'
      recordBtnRef2.current.style.transition = 'all .4s'
      recordBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
      recordBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      recordBtnRef5.current.style.color = '#ff8ebd'

      searchBtnRef1.current.style.background = 'initial'
      searchBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
      searchBtnRef1.current.style.border = 'none'
      searchBtnRef1.current.style.transition = 'all .4s'
      searchBtnRef2.current.style.boxShadow =
        'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
      searchBtnRef2.current.style.height = '40px'
      searchBtnRef2.current.style.width = '40px'
      searchBtnRef2.current.style.transition = 'all .4s'
      searchBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
      searchBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      searchBtnRef5.current.style.color = '#ff8ebd'
      
    } else if (locationIndicator?.pathname === '/') {
      socialBtnRef1.current.style.background = '#ec6aa0'
      socialBtnRef1.current.style.boxShadow =
        'inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8'
      socialBtnRef1.current.style.border = '1px solid #ec6aa0'
      socialBtnRef1.current.style.transition = 'all .4s'
      socialBtnRef2.current.style.boxShadow =
        'rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset'
      socialBtnRef2.current.style.height = '32px'
      socialBtnRef2.current.style.width = '32px'
      socialBtnRef2.current.style.transition = 'all .4s'
      socialBtnRef3.current.style.boxShadow = 'none'
      socialBtnRef4.current.style.filter =
        'invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)'
      socialBtnRef5.current.style.color = 'white'

      profileBtnRef1.current.style.background = 'initial'
      profileBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
      profileBtnRef1.current.style.border = 'none'
      profileBtnRef1.current.style.transition = 'all .4s'
      profileBtnRef2.current.style.boxShadow =
        'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
      profileBtnRef2.current.style.height = '40px'
      profileBtnRef2.current.style.width = '40px'
      profileBtnRef2.current.style.transition = 'all .4s'
      profileBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
      profileBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      profileBtnRef5.current.style.color = '#ff8ebd'

      recordBtnRef1.current.style.background = 'initial'
      recordBtnRef1.current.style.boxShadow = '2px 2px 5px #888888, -3px -3px 3px #ffffff'
      recordBtnRef1.current.style.border = 'none'
      recordBtnRef1.current.style.transition = 'all .4s'
      recordBtnRef2.current.style.boxShadow =
        'inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff'
      recordBtnRef2.current.style.height = '40px'
      recordBtnRef2.current.style.width = '40px'
      recordBtnRef2.current.style.transition = 'all .4s'
      recordBtnRef3.current.style.boxShadow = '2px 2px 3px 0px #929292, -2px -2px 3px #ffffff'
      recordBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      recordBtnRef5.current.style.color = '#ff8ebd'
    }
    else if (locationIndicator?.pathname === "/recordingBooth") {
      recordBtnRef1.current.style.background = "#ec6aa0";
      recordBtnRef1.current.style.boxShadow = "rgb(91 55 70) 2px 2px 3px inset, rgb(244 196 216) -2px -2px 3px inset"
      recordBtnRef1.current.style.border = "1px solid #ec6aa0"
      recordBtnRef1.current.style.transition = "all .4s"
      recordBtnRef2.current.style.boxShadow = "rgb(91 55 70) 2px 2px 3px inset, rgb(244 196 216) -2px -2px 3px inset"
      recordBtnRef2.current.style.height = "32px"
      recordBtnRef2.current.style.width = "32px"
      recordBtnRef2.current.style.transition = "all .4s"
      recordBtnRef3.current.style.boxShadow = "none"
      recordBtnRef4.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      recordBtnRef5.current.style.color = "white" 

      searchBtnRef1.current.style.background = 'initial'
      searchBtnRef1.current.style.boxShadow = '2px 2px 3px #353535, -3px -3px 4px #787878'
      searchBtnRef1.current.style.border = 'none'
      searchBtnRef1.current.style.transition = 'all .4s'
      searchBtnRef2.current.style.boxShadow =
        '#333333 2px 2px 3px 0px inset, #838383 -2px -2px 3px inset'
      searchBtnRef2.current.style.height = '40px'
      searchBtnRef2.current.style.width = '40px'
      searchBtnRef2.current.style.transition = 'all .4s'
      searchBtnRef3.current.style.boxShadow = '#333333 2px 2px 3px 0px, #838383 -2px -2px 3px'
      searchBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      searchBtnRef5.current.style.color = '#ff8ebd'
      
      profileBtnRef1.current.style.background = 'initial'
      profileBtnRef1.current.style.boxShadow = '2px 2px 3px 0px #353535, -3px -3px 4px #787878'
      profileBtnRef1.current.style.border = 'none'
      profileBtnRef1.current.style.transition = 'all .4s'
      profileBtnRef2.current.style.boxShadow =
        '#333333 2px 2px 3px 0px inset, #838383 -2px -2px 3px inset'
      profileBtnRef2.current.style.height = '40px'
      profileBtnRef2.current.style.width = '40px'
      profileBtnRef2.current.style.transition = 'all .4s'
      profileBtnRef3.current.style.boxShadow = '#333333 2px 2px 3px 0px, #838383 -2px -2px 3px'
      profileBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      profileBtnRef5.current.style.color = '#ff8ebd'

      socialBtnRef1.current.style.background = 'initial'
      socialBtnRef1.current.style.boxShadow = '2px 2px 3px 0px #353535, -3px -3px 4px #787878'
      socialBtnRef1.current.style.border = 'none'
      socialBtnRef1.current.style.transition = 'all .4s'
      socialBtnRef2.current.style.boxShadow =
        '#333333 2px 2px 3px 0px inset, #838383 -2px -2px 3px inset'
      socialBtnRef2.current.style.height = '40px'
      socialBtnRef2.current.style.width = '40px'
      socialBtnRef2.current.style.transition = 'all .4s'
      socialBtnRef3.current.style.boxShadow = '#333333 2px 2px 3px 0px, #838383 -2px -2px 3px'
      socialBtnRef4.current.style.filter =
        'invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)'
      socialBtnRef5.current.style.color = '#ff8ebd'
    }
  }, [locationIndicator, props.searchPoppedUp])

  return (
    <div className="NavBar">
      <div className="navbar_section">
        <div className="navbar_shadow-div-outset">
          <div className="navbar_shadow-div-inset">
            <Link
              to="/"
              className="navbar-btn-container"
              ref={socialBtnRef1}
              style={{ borderRadius: '40px 8px 8px 40px' }}
            >
              <div className="navbar-btn_shadow-div-inset" ref={socialBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={socialBtnRef3}>
                  <img
                    className="button-icons bi-social"
                    src={home}
                    ref={socialBtnRef4}
                    alt="social feed icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text" ref={socialBtnRef5}>
                Home
              </div>
            </Link>

            <Link
              to={"/recordingBooth"}
              ref={recordBtnRef1}
              className="navbar-btn-container"
            >
              <div className="navbar-btn_shadow-div-inset" ref={recordBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={recordBtnRef3}>
                  <img
                    className="button-icons bi-record"
                    src={mic}
                    ref={recordBtnRef4}
                    alt="record song icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text" ref={recordBtnRef5}>
                Record
              </div>
            </Link>

            <Link to={{pathname: "/search", link: locationIndicator?.pathname }} className="navbar-btn-container" ref={searchBtnRef1} onClick={props.popUpSearch}>
              <div className="navbar-btn_shadow-div-inset" ref={searchBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={searchBtnRef3}>
                  <img
                    className="button-icons"
                    src={search}
                    ref={searchBtnRef4}
                    alt="search icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text" ref={searchBtnRef5}>
                Search
              </div>
            </Link>

            <Link
              to={user._id ? `/profile/${user._id}` : '/auth'}
              className="navbar-btn-container"
              ref={profileBtnRef1}
              style={{ borderRadius: '8px 40px 40px 8px' }}
            >
              <div className="navbar-btn_shadow-div-inset" ref={profileBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={profileBtnRef3}>
                  <img
                    className="button-icons bi-profile"
                    src={avatar}
                    ref={profileBtnRef4}
                    alt="user profile icon"
                  />
                </div>
              </div>
              <div className="navbar-btn-text" ref={profileBtnRef5}>
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
