import React, { useState, ReactNode, Suspense } from 'react'
import { Routes, Route, Navigate, useOutlet, Outlet } from 'react-router-dom'
import { trpc } from './utils/trpc'
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
const LazySongScreen = React.lazy(() => import('./pages/songPage/SongScreenDisplay'))
const LazyTestAudio = React.lazy(() => import('./pages/_RecordPage/RecordPage'))
const LazyEditLyrics = React.lazy(() => import('./pages/_EditLyrics/EditLyrics'))

// const queryClient = new QueryClient()

const getAuthToken = () => {
  const token = localStorage.getItem('token')!
  return `Bearer ${token}`
}

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://iron-flow.herokuapp.com/api/trpc'
          : 'http://localhost:5000/api/trpc',
      headers() {
        return { Authorization: getAuthToken() }
      },
      // fetch(url, options: any) {
      //   return fetch(url, {
      //     ...options,
      //     headers: { headers: getAuthToken() },
      //     credentials: 'include',
      //   })
      // },
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
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
    </trpc.Provider>
  )
}

const PrivateRoutes = () => {
  const { user } = useAuth()
  return user !== null ? <Outlet /> : <Navigate to="/auth" replace={true} />
}

export default App
