import { useEffect, useState } from 'react'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import './styles/style.css'
import TheContext from './TheContext'
import actions from './api'
import Auth from './components/Auth'
import Home from './components/Home'
import NavBar from './components/NavBar'
import TestAudio from './components/TestAudio'
import EditLyrics from './components/EditLyrics'
import EditProfileScreen from './components/EditProfileScreen'
import EditProfile from './components/EditProfile'
import Profile from './components/Profile'
import SongScreen from './components/SongScreen'
import Search from './components/Search'

function App() {
  const location = useLocation()
  const history = useHistory()
  const [user, setUser] = useState()
  const [userIsAuth, setUserIsAuth] = useState()
  const [userToggle, setUserToggle] = useState(false)
  const [locationIndicator, setLocationIndicator] = useState()

  useEffect(() => {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById("body").style.height = `${h}px`
  }, [])

  // useEffect(() => {
  //   if (userIsAuth) {
  //     actions
  //       .getAUser({ id: userIsAuth })
  //       .then(res => {
  //         setUser(res.data)
  //         console.log("User is logged in, go to profile to log out", user)
  //       })
  //       .catch(console.error)
  //   } else {
  //     history.push('/auth')
  //   }
  // }, [userIsAuth])

  useEffect(() => {
    actions
      .isUserAuth()
      .then(res => {
        setUser(res.data.user)
        console.log(res.data.user, "is logged in ")
      })
      .catch(console.error)
  }, [])


  useEffect(() => {
    setLocationIndicator(location)
  }, [location])

  return (
    <TheContext.Provider
      value={{
        user,
        setUser,
        userIsAuth,
        setUserIsAuth,
        userToggle,
        setUserToggle,
        locationIndicator,
        setLocationIndicator,
      }}
    >
      <div className="App">
        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route exact path="/authSignUp" render={props => <Auth {...props} />} /> 
          <Route exact path="/authLogIn" render={props => <Auth {...props} />} /> 
          <Route exact path="/auth" render={props => <Auth {...props} />} />
          <Route exact path="/navBar" render={props => <NavBar {...props} />} />
          <Route exact path="/profile/:id" render={props => <Profile {...props} />} />
            <Route exact path="/profile/:id/editLyrics" render={props => <EditLyrics {...props} />} />
          <Route exact path="/profile" render={props => <Profile {...props} />} />
          <Route exact path="/recordingBooth" render={props => <TestAudio {...props} />} />
            <Route exact path="/recordingBooth/editLyrics" render={props => <EditLyrics {...props} />} />
          <Route exact path="/editprofile-screen" render={props => <EditProfileScreen {...props} />} />
          <Route exact path="/editprofile" render={props => <EditProfile {...props} />} />
          <Route exact path="/songScreen/:id" render={props => <SongScreen {...props} />} />
          <Route exact path="/search" render={props => <Search {...props} />} />
        </Switch>
      </div>
    </TheContext.Provider>
  )
}

export default App
