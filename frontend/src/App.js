import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, } from 'react-router-dom'
import './styles/style.css'
import TheContext from './TheContext'
import SongData from './components/songFeedComponents/SongData'
import { songData } from './components/songFeedComponents/SongData'
import actions from './api'
import useDebugInformation from "./components/utils/useDebugInformation"
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

function App(props) {
  // useDebugInformation("App", props)
  const { 
    homeFeedArrTest, setHomeFeedArrTest, 
    trendingFeedArrTest, setTrendingFeedArrTest, 
    commentsArrTest, setCommentsArrTest,
    likesArrTest, setLikesArrTest,
    followersArrTest, setFollowersArrTest,
    isLoading, setIsLoading
  } = SongData()
  
  const location = useLocation()
  const [user, setUser] = useState()
  const [userToggle, setUserToggle] = useState(false)
  const [locationIndicator, setLocationIndicator] = useState()
  const [windowSize, setWindowSize] = useState()

  useEffect(() => {
    actions
      .isUserAuth()
      .then(res => {
        console.log(res, "does this get anythin?")
        setUser(res.data.user)
      })
      .catch((err) => {
        console.log(err)
      })

  }, [userToggle])

  useLayoutEffect(() => {
    const handleResize = () => {
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      document.getElementById("body").style.height = `${h}px`
      setWindowSize(h)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])



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
          homeFeedArrTest, setHomeFeedArrTest, 
          trendingFeedArrTest, setTrendingFeedArrTest, 
          likesArrTest, setLikesArrTest,
          followersArrTest, setFollowersArrTest,
          commentsArrTest, setCommentsArrTest,
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
