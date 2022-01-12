import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, } from 'react-router-dom'
import './styles/style.css'
import TheContext from './TheContext'
import SongData from './components/songFeedComponents/SongData'
import { songData } from './components/songFeedComponents/SongData'
import actions from './api'
import useDebugInformation from './utils/useDebugInformation'
import useEventListener from './utils/useEventListener'
import Auth from './pages/Auth'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import TestAudio from './pages/TestAudio'
import EditLyrics from './components/EditLyrics'
import EditProfileScreen from './components/EditProfileScreen'
import EditProfile from './components/EditProfile'
import Profile from './pages/Profile'
import SongScreen from './pages/SongScreen'
import Search from './pages/Search'

function App(props) {
  // useDebugInformation("App", props)
  const { 
    homeFeedSongs, setHomeFeedSongs, 
    trendingFeedSongs, setTrendingFeedSongs, 
    allSongComments, setAllSongComments,
    allSongCommentLikes, setAllSongCommentLikes,
    allSongLikes, setAllSongLikes,
    allSongFollowers, setAllSongFollowers,
    isLoading, setIsLoading
  } = SongData()

  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    document.getElementById('body').style.height = `${onChange}px`
    setWindowSize(onChange)
  })
  
  const location = useLocation()
  const [user, setUser] = useState()
  const [userToggle, setUserToggle] = useState(false)
  const [locationIndicator, setLocationIndicator] = useState()
  const [windowSize, setWindowSize] = useState()

  useEffect(() => {
    actions
      .isUserAuth()
      .then(res => {
        console.log(res, "I GOT AN AUTH USER HERE")
        setUser(res.data.user)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [userToggle])
  
  // useLayoutEffect(() => {
  //   const handleResize = () => {
  //     var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  //     document.getElementById("body").style.height = `${h}px`
  //     setWindowSize(h)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [])



  useEffect(() => {
    setLocationIndicator(location)
  }, [location])
  
  return (
    <TheContext.Provider
      value={{
        user,
        setUser,
        userToggle,
        setUserToggle,
        locationIndicator,
        setLocationIndicator,
        windowSize,
        setWindowSize
      }}
    >
      <songData.Provider 
        value = {{
          homeFeedSongs, setHomeFeedSongs, 
          trendingFeedSongs, setTrendingFeedSongs,
          allSongComments, setAllSongComments,
          allSongCommentLikes, setAllSongCommentLikes,
          allSongLikes, setAllSongLikes,
          allSongFollowers, setAllSongFollowers,
          isLoading, setIsLoading
        }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />}></Route> 
            {/* <Route exact path="/authSignUp" render={props => <Auth {...props} />} /> 
            <Route exact path="/authLogIn" render={props => <Auth {...props} />} />  */}
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/navBar" element={<NavBar />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route path="/profile/:id/editLyrics" element={<EditLyrics />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/recordingBooth" element={<TestAudio />}></Route>
            <Route path="/recordingBooth/editLyrics" element={<EditLyrics />}></Route>
            <Route path="/editprofile-screen" element={<EditProfileScreen />}></Route>
            <Route path="/editprofile" element={<EditProfile />}></Route>
            <Route path="/songScreen/:id" element={<SongScreen />}></Route>
            <Route path="/search" element={<Search />}></Route>
          </Routes>
        </div>
      </songData.Provider>
    </TheContext.Provider>
  )
}

export default App
