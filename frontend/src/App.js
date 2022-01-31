import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, } from 'react-router-dom'
import './styles/style.css'
import TheContext from './contexts/TheContext'
import SongData from './contexts/SongData'
import { songData } from './contexts/SongData'
import actions from './api'
import Auth from './pages/Auth/Auth'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import TestAudio from './pages/TestAudio'
import EditLyrics from './components/EditLyrics'
import EditProfile from './pages/EditProfile/EditProfile'
import Profile from './pages/Profile'
import SongScreen from './pages/SongScreen'
import Search from './pages/Search'

function App(props) {
  const { 
    homeFeedSongs, setHomeFeedSongs, 
    trendingFeedSongs, setTrendingFeedSongs, 
    followingFeedSongs, setFollowingFeedSongs,
    allSongComments, setAllSongComments,
    allSongCommentLikes, setAllSongCommentLikes,
    allSongLikes, setAllSongLikes,
    allSongFollowers, setAllSongFollowers,
    isLoading, setIsLoading
  } = SongData()

  const location = useLocation()
  const [user, setUser] = useState()
  const [locationIndicator, setLocationIndicator] = useState()

  useEffect(() => {
    actions
      .isUserAuth()
      .then(res => {
        console.log(res, "I GOT AN AUTH USER HERE")
        setUser(res.data.user)
      })
      .catch(err => console.log(err))
  }, [])
  
  useEffect(() => {
    setLocationIndicator(location)
  }, [location])
  
  return (
    <TheContext.Provider
      value={{
        user,
        setUser,
        locationIndicator,
        setLocationIndicator,
      }}
    >
      <songData.Provider 
        value = {{
          homeFeedSongs, setHomeFeedSongs, 
          trendingFeedSongs, setTrendingFeedSongs,
          followingFeedSongs, setFollowingFeedSongs,
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
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/navBar" element={<NavBar />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/recordingBooth" element={<TestAudio />}></Route>
            <Route path="/editLyrics" element={<EditLyrics />}></Route>
            <Route path="/editProfile" element={<EditProfile />}></Route>
            <Route path="/songScreen/:id" element={<SongScreen />}></Route>
            <Route path="/search" element={<Search />}></Route>
          </Routes>
        </div>
      </songData.Provider>
    </TheContext.Provider>
  )
}

export default App
