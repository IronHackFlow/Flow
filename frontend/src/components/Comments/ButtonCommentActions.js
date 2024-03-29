import { useContext, useEffect, useState, useCallback } from 'react'
import TheContext from '../../contexts/TheContext'
import HomeContext from '../../contexts/HomeContext'
import usePostComment from '../../utils/usePostComment'
import ContinueModal from '../ContinueModal'
import useDebugInformation from '../../utils/useDebugInformation'
import { deleteIcon, commentIcon, thumbsUpIcon, editIcon } from '../../assets/images/_icons'

function ButtonCommentActions({ type, actions }) {
  const { user } = useContext(TheContext)
  const { songInView, setCommentToEdit, setShowCommentInputModal, isEdit, setIsEdit } =
    useContext(HomeContext)
  const { deleteComment } = usePostComment()
  const [isLiked, setIsLiked] = useState()
  const [isDelete, setIsDelete] = useState(false)
  const [total, setTotal] = useState()
  const [usersLike, setUsersLike] = useState()

  useEffect(() => {
    if (type !== 'like') return

    let likes = actions?.likes
    setIsLiked(false)
    setTotal(likes?.length)

    for (let i = 0; i < likes?.length; i++) {
      if (likes[i].user === user?._id) {
        setIsLiked(true)
        setUsersLike(likes[i])
        break
      }
    }
  }, [type])

  const deleteCallback = useCallback(() => {
    setIsDelete(false)
    return deleteComment(songInView?._id, actions.toDelete)
  }, [type])

  const onClick = () => {
    switch (type) {
      case 'like':
        if (!isLiked) {
          setTotal(prev => prev + 1)
          setIsLiked(true)
          return actions.add(actions.commentId, songInView?._id, setUsersLike)
        } else {
          setTotal(prev => prev - 1)
          setIsLiked(false)
          return actions.delete(actions.commentId, songInView?._id, usersLike)
        }
      case 'reply':
        break
      case 'edit':
        if (actions.isEdit === actions.itemId) {
          setIsEdit(null)
          return setShowCommentInputModal('comment')
        } else {
          setIsEdit(actions.itemId)
          setCommentToEdit({
            comment: actions.comment,
            editValue: actions.value,
            update: actions.update,
          })
          return setShowCommentInputModal('edit')
        }
      case 'delete':
        return setIsDelete(true)
      default:
    }
  }

  return (
    <div className="comments__btn--container">
      <button
        className={`comments__btn ${type} ${
          type === 'like' && isLiked ? 'comment-like-btn-pressed' : ''
        }`}
        style={type === 'like' || type === 'delete' ? { borderRadius: '40px 4px 4px 40px' } : null}
        onClick={() => onClick()}
      >
        <div className={`comments__btn-icon ${type}`}>
          <img
            className={`social-icons ${type}`}
            alt={`${type} icon`}
            src={
              type === 'like'
                ? thumbsUpIcon
                : type === 'reply'
                ? commentIcon
                : type === 'delete'
                ? deleteIcon
                : editIcon
            }
          />
        </div>
        <div className="comments__btn-text--container">
          <p className={`comments__btn-text ${type}`}>{type}</p>
          {(type === 'like' || type === 'reply') && (
            <p className={`comments__btn-number ${type}`}>{total}</p>
          )}
        </div>
      </button>
      <ContinueModal
        title="Delete Comment"
        text="Are you sure you want to delete this comment?"
        btnText="delete"
        isOpen={isDelete}
        onClose={setIsDelete}
        onExit={deleteCallback}
      />
    </div>
  )
}

export default ButtonCommentActions
