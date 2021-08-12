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
import SongScreen from './components/SongScreen'

function App() {
  const [user, setUser] = useState({});
  const [userViewed, setUserViewed] = useState({});
  const [navDisplayed, setNavDisplayed] = useState(false);
  const [toggleFeed, setToggleFeed] = useState(true);
  const [toggleRecord, setToggleRecord] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);

  const navRef = useRef();

  useEffect(() => {
    actions
    .getUser()
    .then((res) => {
      setUser(res.data)
      console.log("user is logged in", user)
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
        toggleRecord, setToggleRecord,
        toggleFeed, setToggleFeed,
        toggleProfile, setToggleProfile,
    }}>
      <div className="App">
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
