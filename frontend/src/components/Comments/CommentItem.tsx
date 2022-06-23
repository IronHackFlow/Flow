import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'
// import { Link } from 'react-router-dom'
// import { UserContext } from '../../contexts/AuthContext'
// import HomeContext from '../../contexts/HomeContext'
// import ButtonCommentActions from './ButtonCommentActions'
// import useFormatDate from '../../utils/useFormatDate'
// import { Comments } from '../../constants/Types'

// type Props = {
//   commentData: Comments,
// }

// type CommentUserTypes = {
//   _id: string,
//   user_name: string,
//   picture: string
// }

// export default function CommentItem({ commentData }: Props) {
//   const { user } = useContext(UserContext)
//   const { songInView, showCommentMenu, commentToEdit, setCommentToEdit } = useContext(HomeContext)
//   const { _id: songId } = songInView
//   const { _id: songUserId } = songInView?.song_user
//   const { _id: id , date: commentDate, comment: commentText, likes } = commentData
//   const commentUser = commentData.user as CommentUserTypes
//   const {
//     _id: commentUserId,
//     user_name: commentUserName,
//     picture: commentPicture,
//   } = commentUser
//   const { formatDate } = useFormatDate()

//   const [isAuthor, setIsAuthor] = useState<boolean>(false)
//   const [isCommenterUser, setIsCommenterUser] = useState<boolean>(false)
//   const [isEditClass, setIsEditClass] = useState<boolean>(false)

//   useEffect(() => {
//     if (commentUserId === user?._id) setIsCommenterUser(true)
//     if (songUserId === commentUserId) setIsAuthor(true)
//   }, [commentUserId])

//   useEffect(() => {
//     if (!showCommentMenu) setCommentToEdit({commentToEditId: "", editCommentValue: ""})
//     if (id === commentToEdit?.commentToEditId) setIsEditClass(true)
//     else setIsEditClass(false)
//   }, [showCommentMenu, commentToEdit])

//   return (
//     <li id={id} className={`comments__item ${isEditClass ? 'highlight' : ''}`}>
//       <div className="comment-list-inner">
//         <div className="comment-list-photo">
//           <div className="comment-photo-inner">
//             <div className="comment-photo-outer">
//               <Link to={`/profile/${commentUserId}`} state={{ propSongUser: commentUser }}>
//                 <img src={commentPicture} alt="user's profile" />
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="comments__text--container">
//           <div className="comments__text--shadow-outset">
//             <div className="comments__user-details">
//               <p className="comments__username">
//                 {commentUserName}
//                 <span>{isAuthor ? `${String.fromCodePoint(8226)} song author` : null}</span>
//               </p>
//               <p className="comments__date">
//                 {commentData.editedOn
//                   ? `${formatDate(commentData.editedOn, 'm')} ${String.fromCodePoint(8226)} edited`
//                   : commentDate
//                   ? formatDate(commentDate, 'm')
//                   : '1y'}
//               </p>
//             </div>
//             <p className="comments__comment">{commentText}</p>
//           </div>
//         </div>
//       </div>

//       <div className="comments__actions--container">
//         <div className="space-filler"></div>
//         <div className="comments__actions">
//           <div className="comments__actions--shadow-inset">
//             {isCommenterUser ? (
//               <>
//                 <ButtonCommentActions
//                   type="delete"
//                   id={id}
//                   commentData={commentData}
//                 />
//                 <ButtonCommentActions
//                   type="edit"
//                   id={id}
//                   // commentData={commentData}
//                   // value={commentText}
//                 />
//               </>
//             ) : (
//               <>
//                 <ButtonCommentActions
//                   type="like"
//                   id={id}
//                   value={likes}
//                 />
//                 <ButtonCommentActions type="reply" id="" />
//               </>
//             )}

//             <div className="comment-popout-container"></div>
//           </div>
//         </div>
//       </div>
//     </li>
//   )
// }
