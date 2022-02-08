import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../../contexts/TheContext'
import ButtonCommentActions from './ButtonCommentActions'
import usePostLike from '../../utils/usePostLike'
import useFormatDate from '../../utils/useFormatDate'

export default function CommentItem({ itemId, songInView, comment, isOpen, isEdit, setIsEdit }) {
  const { user } = useContext(TheContext)
  const { _id: songId } = songInView
  const { id: songUserId } = songInView.song_user
  const { _id: id, user: commentUser, date: commentDate, comment: commentText, likes } = comment
  const { _id: commentUserId, user_name: commentUserName, picture: commentPicture } = comment.user
  const { addCommentLike, deleteCommentLike } = usePostLike()
  const { formatDate } = useFormatDate()

  const [isCommenterAuthor, setIsCommenterAuthor] = useState(false)
  const [isCommenterUser, setIsCommenterUser] = useState(false)
  const [isEditClass, setIsEditClass] = useState(false)

  useEffect(() => {
    if (commentUserId === user?._id) setIsCommenterUser(true)
    if (songUserId === commentUserId) setIsCommenterAuthor(true)
  }, [])

  useEffect(() => {
    if (!isOpen) setIsEdit(null)
    if (itemId === isEdit) setIsEditClass(true)
    else setIsEditClass(false)
  }, [isOpen, isEdit])

  return (
    <li id={itemId} className={`comments__item ${isEditClass ? 'highlight' : ''}`}>
      <div className="comment-list-inner">
        <div className="comment-list-photo">
          <div className="comment-photo-inner">
            <div className="comment-photo-outer">
              <Link to={`/profile/${commentUserId}`} state={{ propSongUser: commentUser }}>
                <img src={commentPicture} alt="user's profile" />
              </Link>
            </div>
          </div>
        </div>

        <div className="comment-text-container">
          <div className="comment-list-outer">
            <p className="comment-username">
              {commentUserName}
              <span>{isCommenterAuthor ? ' 𑁦 song author' : null}</span>
            </p>
            <div className="comment-date">{formatDate(commentDate, 'm')}</div>
            <p className="comment-text">{commentText}</p>
          </div>
        </div>
      </div>

      <div className="comments__actions--container">
        <div className="space-filler"></div>
        <div className="comments__actions">
          <div className="comments__actions--shadow-inset">
            {isCommenterUser ? (
              <>
                <ButtonCommentActions
                  type="delete"
                  actions={{ songId: songId, toDelete: comment }}
                />
                <ButtonCommentActions
                  type="edit"
                  actions={{
                    itemId: itemId,
                    comment: comment,
                    isEdit: isEdit,
                    setEdit: setIsEdit,
                    value: commentText,
                  }}
                />
              </>
            ) : (
              <>
                <ButtonCommentActions
                  type="like"
                  actions={{
                    add: addCommentLike,
                    delete: deleteCommentLike,
                    songId: songId,
                    commentId: id,
                    likes: [...likes],
                  }}
                />
                <ButtonCommentActions type="reply" />
              </>
            )}

            <div className="comment-popout-container"></div>
          </div>
        </div>
      </div>
    </li>
  )
}
