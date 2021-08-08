import { useEffect, useState, useRef } from "react";
import { Switch, Route, Link } from 'react-router-dom'
import './styles/style.css'
import TheContext from './TheContext'
import actions from './api'
import Auth from './components/Auth'
import Home from './components/Home'
import TestAudio from './components/TestAudio'
import EditProfileScreen from './components/EditProfileScreen'
import EditProfile from './components/EditProfile'
import Profile from './components/Profile'
import OtherProfile from './components/OtherProfile'
import Notification from './components/Notification'
import SongScreen from './components/SongScreen'

function App() {
  const [navDisplayed, setNavDisplayed] = useState(false);
  const [user, setUser] = useState({});
  const [userViewed, setUserViewed] = useState({});
  const [toggleExplore, setToggleExplore] = useState();
  const [toggleSocial, setToggleSocial] = useState();
  const [toggleProfile, setToggleProfile] = useState();

  const navRef = useRef();

  useEffect(() => {
    user ? setUserViewed(user) : setUser({})
    console.log(user, "you're the user")
    console.log(userViewed, "but what's userViewed?")
  }, [])

  useEffect(() => {
    actions
    .getUser()
    .then((res) => {
      setUser(res.data)
    }).catch(console.error)
  }, [])

  const navDisplayCheck = () => {
    if (navDisplayed === true) {
      navRef.current.style.height = "0px"
      navRef.current.style.borderBottom = "none"
      navRef.current.style.animation = 'none'
      setNavDisplayed(false)
    }
    else {
      navRef.current.style.height = "325px"
      navRef.current.style.borderBottom = "5px solid #a6a6a6"
      navRef.current.style.transition = "height .5s"
      navRef.current.style.animation = "massiveMenu .8s linear forwards"
      setNavDisplayed(true)
    }
  }
  const hideNavBar = () => {
    if (navDisplayed === true) {
      navRef.current.style.height = "0px"
      navRef.current.style.animation = 'none'
      setNavDisplayed(false)
    }    
  }
  return (
    <TheContext.Provider value={{
        user, setUser, 
        userViewed, setUserViewed, 
        navDisplayed, setNavDisplayed,
        toggleSocial, setToggleSocial,
        toggleExplore, setToggleExplore,
        toggleProfile, setToggleProfile,
    }}>
      <div className="App">
        <nav ref={navRef}>
            <div className="menu">
              <div className="menu-route mr-1">
                <div className="menu-outset mo-1">
                  <div className="menu-inset mi-1">
                    <Link to="/" onClick={hideNavBar}>Home</Link>
                  </div>
                </div>
              </div>
              <div className="menu-route mr-2">
                <div className="menu-outset mo-2">
                  <div className="menu-inset mi-2">
                    <Link to="/auth" onClick={hideNavBar}>Log in</Link>
                  </div>
                </div>
              </div>
              <div className="menu-route mr-3">
                <div className="menu-outset mo-3">
                  <div className="menu-inset mi-3">
                    <Link 
                      to="/explore-feed" 
                      onClick={() => {
                        hideNavBar()
                        setToggleProfile(false)
                      }}>
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
              <div className="menu-route mr-4">
                <div className="menu-outset mo-4">
                  <div className="menu-inset mi-4">
                    <Link to="/recordingBooth" onClick={hideNavBar}>Record</Link>
                  </div>
                </div>
              </div>
              <div className="menu-route mr-5">
                <div className="menu-outset mo-5">
                  <div className="menu-inset mi-5">
                    <Link 
                      to={user._id ? {pathname: `/profile/${user._id}`, profileInfo: user } : `/auth`} 
                      onClick={() => {
                        hideNavBar()
                        setToggleProfile(true)
                      }}>
                        Profile
                    </Link>
                  </div>
                </div>
              </div>
              <div className="menu-route mr-6">
                <div className="menu-outset mo-6">
                  <div className="menu-inset mi-6">
                    <Link 
                      to="/social-feed" 
                      onClick={() => {
                        hideNavBar()
                        setToggleProfile(false)
                      }}>
                      Social
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        </nav>

        <div className="hamburger-button" onClick={navDisplayCheck}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <Notification/>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route exact path="/auth" render={(props) => <Auth setUser={setUser} {...props} />} />
          <Route exact path="/profile/:id" render={(props) => <Profile user={user} {...props} />} />
          <Route exact path="/profile" render={(props) => <Profile user={user} {...props} />} />
          <Route exact path="/recordingBooth" render={(props) => <TestAudio {...props} />} />
          <Route exact path="/editprofile-screen" render={(props) => <EditProfileScreen {...props} />} />
          <Route exact path="/editprofile" render={(props) => <EditProfile {...props} />} />
          {/* <Route exact path="/social-feed" render={(props) => <SocialFeed {...props} />} />
          <Route exact path="/explore-feed" render={(props) => <SocialFeed {...props} />} /> */}
          <Route exact path="/SongScreen/:id" render={(props) => <SongScreen {...props} />} />
        </Switch>
      </div>
    </TheContext.Provider>
  );
}

export default App;
