import { useContext, useEffect, useState, useCallback } from 'react'
// import { UserContext } from '../../contexts/AuthContext'
// import HomeContext from '../../contexts/HomeContext'
// import usePostComment from '../../utils/usePostComment'
// import usePostLike from '../../utils/usePostLike'
// import ContinueModal from '../ContinueModal'
// import { Comments, Likes } from '../../constants/Types'
// import { deleteIcon, commentIcon, thumbsUpIcon, editIcon } from '../../assets/images/_icons'

// type Props = {
//   type: string,
//   id: string,
//   commentData?: Comments,
//   value?: any
// }

// function ButtonCommentActions({ type, id, commentData, value }: Props) {
//   const { user } = useContext(UserContext)
//   const { songInView, setShowCommentInputModal, commentToEdit, setCommentToEdit } =
//     useContext(HomeContext)
//   const { deleteComment } = usePostComment()
//   const { addCommentLike, deleteCommentLike } = usePostLike()

//   const [isLiked, setIsLiked] = useState<boolean>(false)
//   const [isDelete, setIsDelete] = useState<boolean>(false)
//   const [total, setTotal] = useState<number>(0)
//   const [usersLike, setUsersLike] = useState<Likes>()

//   useEffect(() => {
//     if (type !== 'like') return

//     let likes = value
//     setIsLiked(false)
//     setTotal(likes?.length)

//     for (let i = 0; i < likes?.length; i++) {
//       if (likes[i].user === user?._id) {
//         setIsLiked(true)
//         setUsersLike(likes[i])
//         break
//       }
//     }
//   }, [type])

//   const deleteCallback = useCallback(() => {
//     setIsDelete(false)
//     return deleteComment(songInView?._id, commentData)
//   }, [type])

//   const onClick = () => {
//     switch (type) {
//       case 'like':
//         if (!isLiked) {
//           setTotal(prev => prev + 1)
//           setIsLiked(true)
//           return addCommentLike(id, songInView?._id, setUsersLike)
//         } else {
//           setTotal(prev => prev - 1)
//           setIsLiked(false)
//           return deleteCommentLike(id, songInView?._id, usersLike)
//         }
//       case 'reply':
//         break
//       case 'edit':
//         if (commentToEdit?.commentToEditId === id) {
//           setCommentToEdit({commentToEditId: "", editCommentValue: ""})
//           return setShowCommentInputModal('comment')
//         } else {
//           setCommentToEdit({
//             commentToEditId: id,
//             editCommentValue: value,
//           })
//           return setShowCommentInputModal('edit')
//         }
//       case 'delete':
//         return setIsDelete(true)
//       default:
//     }
//   }

//   return (
//     <div className="comments__btn--container">
//       <button
//         className={`comments__btn ${type} ${
//           type === 'like' && isLiked ? 'comment-like-btn-pressed' : ''
//         }`}
//         style={type === 'like' || type === 'delete' ? { borderRadius: '40px 4px 4px 40px' } : {}}
//         onClick={() => onClick()}
//       >
//         <div className={`comments__btn-icon ${type}`}>
//           <img
//             className={`social-icons ${type}`}
//             alt={`${type} icon`}
//             src={
//               type === 'like'
//                 ? thumbsUpIcon
//                 : type === 'reply'
//                 ? commentIcon
//                 : type === 'delete'
//                 ? deleteIcon
//                 : editIcon
//             }
//           />
//         </div>
//         <div className="comments__btn-text--container">
//           <p className={`comments__btn-text ${type}`}>{type}</p>
//           {(type === 'like' || type === 'reply') && (
//             <p className={`comments__btn-number ${type}`}>{total}</p>
//           )}
//         </div>
//       </button>
//       <ContinueModal
//         title="Delete Comment"
//         text="Are you sure you want to delete this comment?"
//         btnText="delete"
//         isOpen={isDelete}
//         onClose={setIsDelete}
//         onExit={deleteCallback}
//       />
//     </div>
//   )
// }

// export default ButtonCommentActions
