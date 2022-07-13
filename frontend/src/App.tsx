import React, { ReactNode, Suspense } from 'react'
import { Routes, Route, Navigate, useOutlet, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './styles/style.css'
import { useAuth, AuthProvider } from './contexts/_AuthContext/AuthContext'
import Auth from './pages/_Auth/Auth'
import Home from './pages/_Home/Home'
import Navbar from './components/_Navbar/Navbar'
import Loading from './components/Loading/Loading'
const LazySearch = React.lazy(() => import('./pages/Search'))
const LazyEditProfile = React.lazy(() => import('./pages/_EditProfile/EditProfile'))
const LazyProfile = React.lazy(() => import('./pages/_Profile/Profile'))
const LazySongScreen = React.lazy(() => import('./pages/_SongScreen/SongScreenDisplay'))
const LazyTestAudio = React.lazy(() => import('./pages/_RecordPage/RecordPage'))
const LazyEditLyrics = React.lazy(() => import('./pages/_EditLyrics/EditLyrics'))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<Loading margin={0.5} isLoading={true} />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/profile/:id" element={<LazyProfile />} />
                <Route path="/editProfile" element={<LazyEditProfile />} />
                <Route path="/record" element={<LazyTestAudio />} />
                <Route path="/editLyrics" element={<LazyEditLyrics />} />
                <Route path="/songScreen/:id" element={<LazySongScreen />} />
                <Route path="/search" element={<LazySearch />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

const PrivateRoutes = () => {
  const { user } = useAuth()
  return user !== null ? <Outlet /> : <Navigate to="/auth" replace={true} />
}

export default App
