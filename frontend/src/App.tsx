import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './styles/style.css'
import { AuthProvider } from './contexts/_AuthContext/AuthContext'
import Auth from './pages/_Auth/Auth'
import Home from './pages/_Home/Home'
import Navbar from './components/_Navbar/Navbar'
import Loading from './components/Loading'
import { SongDataProvider } from './contexts/_SongContext/SongData'
const LazySearch = React.lazy(() => import('./pages/Search'))
const LazyEditProfile = React.lazy(() => import('./pages/_EditProfile/EditProfile'))
const LazyProfile = React.lazy(() => import('./pages/_Profile/Profile'))
const LazySongScreen = React.lazy(() => import('./pages/_SongScreen/SongScreenDisplay'))
const LazyTestAudio = React.lazy(() => import('./pages/_Record/Record'))
const LazyEditLyrics = React.lazy(() => import('./components/_EditLyrics/EditLyrics'))

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SongDataProvider>
          <div className="App">
            <Suspense fallback={<Loading margin={0.5} isLoading={true} />}>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/auth" element={<Auth />}></Route>
                <Route path="/navbar" element={<Navbar />}></Route>
                <Route path="/profile/:id" element={<LazyProfile />}></Route>
                <Route path="/record" element={<LazyTestAudio />}></Route>
                <Route path="/editLyrics" element={<LazyEditLyrics />}></Route>
                <Route path="/editProfile" element={<LazyEditProfile />}></Route>
                <Route path="/songScreen/:id" element={<LazySongScreen />}></Route>
                <Route path="/search" element={<LazySearch />}></Route>
              </Routes>
            </Suspense>
          </div>
        </SongDataProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
