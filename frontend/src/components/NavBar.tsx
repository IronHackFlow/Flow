import { useContext, memo } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { UserContext } from '../contexts/AuthContext'
// import { homeIcon, micIcon, searchIcon, profileIcon } from '../assets/images/_icons'
// import useDebugInformation from '../utils/useDebugInformation'

// type Props = {
//   pageClass?: String,
//   isVisible?: Boolean
// }
// function NavBar({ pageClass, isVisible } : Props) {
//   // useDebugInformation('NavBar', { pageClass, isVisible })
//   const { user } = useContext(UserContext)
//   const location = useLocation()
//   const path = location.pathname

//   return (
//     <div
//       className={`NavBar ${pageClass}`}
//       style={isVisible ? { height: '0%', visibility: 'hidden' } : {}}
//     >
//       <div className="navbar_section">
//         <div className="navbar_shadow-div-outset">
//           <div className="navbar_shadow-div-inset">
//             <Link
//               to="/"
//               className={`navbar-btn-container ${path === '/' ? 'btn-selected' : 'btn-unselected'}`}
//               style={{ borderRadius: '2.5em 0.3em 0.3em 2.5em' }}
//             >
//               <div className="navbar-btn_shadow-div-inset">
//                 <div className="navbar-btn_shadow-div-outset">
//                   <img className="button-icons bi-social" src={homeIcon} alt="social feed icon" />
//                 </div>
//               </div>
//               <div className="navbar-btn-text">Home</div>
//             </Link>

//             <Link
//               to="/recordingBooth"
//               className={`navbar-btn-container ${
//                 path === '/recordingBooth' ? 'btn-selected' : 'btn-unselected'
//               }`}
//             >
//               <div className="navbar-btn_shadow-div-inset">
//                 <div className="navbar-btn_shadow-div-outset">
//                   <img className="button-icons bi-record" src={micIcon} alt="record song icon" />
//                 </div>
//               </div>
//               <div className="navbar-btn-text">Record</div>
//             </Link>

//             <Link
//               to="/search"
//               state={{ returnValue: null }}
//               className={`navbar-btn-container ${
//                 path === '/search' ? 'btn-selected' : 'btn-unselected'
//               }`}
//             >
//               <div className="navbar-btn_shadow-div-inset">
//                 <div className="navbar-btn_shadow-div-outset">
//                   <img className="button-icons" src={searchIcon} alt="search icon" />
//                 </div>
//               </div>
//               <div className="navbar-btn-text">Search</div>
//             </Link>

//             <Link
//               to={user ? `/profile/${user?._id}` : '/auth'}
//               state={{ propSongUser: user }}
//               className={`navbar-btn-container ${
//                 path.slice(0, 8) === '/profile' ? 'btn-selected' : 'btn-unselected'
//               }`}
//               style={{ borderRadius: '0.3em 2.5em 2.5em 0.3em' }}
//             >
//               <div className="navbar-btn_shadow-div-inset">
//                 <div className="navbar-btn_shadow-div-outset">
//                   <img
//                     className="button-icons bi-profile"
//                     src={profileIcon}
//                     alt="user profile icon"
//                   />
//                 </div>
//               </div>
//               <div className="navbar-btn-text">Profile</div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NavBar
