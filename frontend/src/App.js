import { useEffect, useState } from 'react'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import './styles/style.css'
import TheContext from './TheContext'
import actions from './api'
import Auth from './components/Auth'
import Home from './components/Home'
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
  const [user, setUser] = useState({})
  const [userIsAuth, setUserIsAuth] = useState({})
  const [userViewed, setUserViewed] = useState({})
  const [locationIndicator, setLocationIndicator] = useState()

  useEffect(() => {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById("body").style.height = `${h}px`
  }, [])

  // useEffect(() => {
  //   actions
  //     .getAUser(userId)
  //     .then(res => {
  //       setUser(res.data)
  //       console.log('user is logged in', user)
  //     })
  //     .catch(console.error)
  // }, [])

  useEffect(() => {
    if (userIsAuth) {
      actions
        .getAUser({ id: userIsAuth })
        .then(res => {
          setUser(res.data)
          console.log(res.data, "WHATLSKDJ")
          console.log("User is logged in, go to profile to log out", user)
        })
    }
  }, [userIsAuth])

  useEffect(() => {
    actions
      .isUserAuth()
      .then(data => {
        console.log(data.data, "COME ON MAN")
        if (data.data.isLoggedIn) {

          setUserIsAuth(data.data.user)
        }
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
        userViewed,
        setUserViewed,
        locationIndicator,
        setLocationIndicator,
      }}
    >
      <div className="App">
        {  console.log('ice cream', user)}
        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route exact path="/AuthSignUp" render={props => <Auth {...props} />} /> 
          <Route exact path="/AuthLogIn" render={props => <Auth {...props} />} /> 
          <Route exact path="/auth" render={props => <Auth setUser={setUser} {...props} />} />
          <Route exact path="/profile/:id" render={props => <Profile user={user} {...props} />} />
            <Route exact path="/profile/:id/EditLyrics" render={props => <EditLyrics {...props} />} />
          <Route exact path="/profile" render={props => <Profile user={user} {...props} />} />
          <Route exact path="/recordingBooth" render={props => <TestAudio {...props} />} />
            <Route exact path="/recordingBooth/EditLyrics" render={props => <EditLyrics {...props} />} />
          <Route exact path="/editprofile-screen" render={props => <EditProfileScreen {...props} />} />
          <Route exact path="/editprofile" render={props => <EditProfile {...props} />} />
          <Route exact path="/SongScreen/:id" render={props => <SongScreen {...props} />} />
          <Route exact path="/search" render={props => <Search {...props} />} />
        </Switch>
      </div>
    </TheContext.Provider>
  )
}

export default App
