import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'
// import { UserContext } from '../contexts/AuthContext'
// import { SongDataContext } from '../contexts/SongData'
// import usePostLike from '../utils/usePostLike'
// import usePostFollow from '../utils/usePostFollow'
// import { Likes, Follows } from '../constants/Types'
// import { followIcon, thumbsUpIcon } from '../assets/images/_icons'

// type Props = {
//   type: string,
//   songInView: {id: string, list: Array<Follows> | Array<Likes>},
//   btnStyle: string,
//   action: {add: (id: string, action: Dispatch<SetStateAction<Likes | Follows>>) => void, delete: () => void}
// }

// export default function ButtonSocialAction({ type, songInView, btnStyle, action }: Props) {
//   const { user } = useContext(UserContext)
//   const { isLoading } = useContext(SongDataContext)
//   const { addSongLike, deleteSongLike } = usePostLike()
//   const { postFollow, deleteFollow } = usePostFollow()

//   const [total, setTotal] = useState<number>(0)
//   const [hasUser, setHasUser] = useState<boolean>()
//   const [usersAction, setUsersAction] = useState<Likes | Follows>()

//   const userId = user?._id
//   const id = songInView?.id
//   const socialList = songInView?.list

//   useEffect(() => {
//     if (!user || !socialList) return
//     setHasUser(false)
//     setTotal(socialList?.length)

//     for (let i = 0; i < socialList.length; i++) {
//       if (socialList[i].user._id === userId) {
//         setHasUser(true)
//         setUsersAction(socialList[i])
//         break
//       }
//     }
//   }, [songInView?.list])

//   const postHandler = () => {
//     if (type === 'follow' && id === user?._id) return
//     if (hasUser) {
//       if (type === 'follow') deleteFollow(id, usersAction)
//       else deleteSongLike(id, usersAction)
//       setHasUser(false)
//       setTotal(prev => prev - 1)
//     } else {
//       if (type === 'follow') postFollow(id, setUsersAction)
//       else addSongLike(id, setUsersAction)
//       setHasUser(true)
//       setTotal(prev => prev + 1)
//     }
//   }

//   if (btnStyle === 'home') {
//     return (
//       <button
//         className={`action-btn_shadow-div-outset ${hasUser ? 'liked-followed-commented' : ''}`}
//         style={type === 'follow' ? { borderRadius: '50px 5px 5px 50px' } : {}}
//         onClick={() => postHandler()}
//       >
//         <div
//           className="action-btn-icon_shadow-div-inset"
//           style={type === 'follow' ? { borderRadius: '40px 4px 4px 40px' } : {}}
//         >
//           <img
//             className={`social-icons ${type}`}
//             src={type === 'follow' ? followIcon : thumbsUpIcon}
//             alt={`${type} user icon`}
//           />
//         </div>

//         <div className="action-btn-container">
//           <div
//             className="loading loading-btn"
//             style={isLoading ? { opacity: '1' } : { opacity: '0' }}
//           ></div>
//           <div className="action-btn-text">
//             <p style={{ color: 'white' }}>{total}</p>
//             <p>{total === 1 ? `${type}` : `${type}s`}</p>
//           </div>
//         </div>
//       </button>
//     )
//   } else {
//     return (
//       <div className="songscreen__btn">
//         <div className="songscreen__text--container">
//           <p className="songscreen__text num">{total}</p>
//           <p className="songscreen__text title">{total === 1 ? `${type}` : `${type}s`}</p>
//         </div>
//         <button
//           className={`social-button ${hasUser ? 'pushed' : ''}`}
//           onClick={(e: any) => {
//             e.target.style.transition = 'all .2s ease-in'
//             postHandler()
//           }}
//         >
//           <img
//             className={`social-icons ${type}`}
//             src={type === 'follow' ? followIcon : thumbsUpIcon}
//             alt={`${type} user icon`}
//           />
//         </button>
//       </div>
//     )
//   }
// }
