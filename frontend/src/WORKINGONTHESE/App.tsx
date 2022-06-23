import React, { Suspense } from 'react'
// import { Routes, Route } from 'react-router-dom'
// import './styles/style.css'
// import { SongDataProvider } from './contexts/SongData'
// import { UserContextProvider } from './contexts/AuthContext'
// import Auth from './pages/Auth/Auth'
// import Home from './pages/Home'
// import NavBar from './components/NavBar'
// import Loading from './components/Loading'
// const LazySearch = React.lazy(() => import('./pages/Search'))
// const LazyEditProfile = React.lazy(() => import('./pages/EditProfile/EditProfile'))
// const LazyProfile = React.lazy(() => import('./pages/_Profile/Profile'))
// const LazySongScreen = React.lazy(() => import('./pages/SongScreen'))
// const LazyTestAudio = React.lazy(() => import('./pages/Record'))
// const LazyEditLyrics = React.lazy(() => import('./components/EditLyrics/EditLyrics'))

// function App() {

//   return (
//     <UserContextProvider>
//       <SongDataProvider>
//         <div className="App">
//           <Suspense fallback={<Loading margin={0.5} isLoading={true} />}>
//             <Routes>
//               <Route path="/" element={<Home />}></Route>
//               <Route path="/auth" element={<Auth />}></Route>
//               <Route path="/navBar" element={<NavBar />}></Route>
//               <Route path="/profile/:id" element={<LazyProfile />}></Route>
//               <Route path="/recordingBooth" element={<LazyTestAudio />}></Route>
//               <Route path="/editLyrics" element={<LazyEditLyrics />}></Route>
//               <Route path="/editProfile" element={<LazyEditProfile />}></Route>
//               <Route path="/songScreen/:id" element={<LazySongScreen />}></Route>
//               <Route path="/search" element={<LazySearch />}></Route>
//             </Routes>
//           </Suspense>
//         </div>
//       </SongDataProvider>
//     </UserContextProvider>
//   )
// }

// export default App
