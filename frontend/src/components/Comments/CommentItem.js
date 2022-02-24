import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../../contexts/TheContext'
import HomeContext from '../../contexts/HomeContext'
import ButtonCommentActions from './ButtonCommentActions'
import usePostLike from '../../utils/usePostLike'
import useFormatDate from '../../utils/useFormatDate'

export default function CommentItem({
  commentData,
  // isEdit,
  // setIsEdit,
  update,
}) {
  const { user } = useContext(TheContext)
  const { songInView, showCommentMenu, isEdit, setIsEdit } = useContext(HomeContext)
  const { _id: songId } = songInView
  const { _id: songUserId } = songInView?.song_user
  const { _id: id, user: commentUser, date: commentDate, comment: commentText, likes } = commentData
  const {
    _id: commentUserId,
    user_name: commentUserName,
    picture: commentPicture,
  } = commentData.user
  const { addCommentLike, deleteCommentLike } = usePostLike()
  const { formatDate } = useFormatDate()

  const [isAuthor, setIsAuthor] = useState(false)
  const [isCommenterUser, setIsCommenterUser] = useState(false)
  const [isEditClass, setIsEditClass] = useState(false)

  useEffect(() => {
    if (commentUserId === user?._id) setIsCommenterUser(true)
    if (songUserId === commentUserId) setIsAuthor(true)
  }, [commentUserId])

  useEffect(() => {
    if (!showCommentMenu) setIsEdit(null)
    if (id === isEdit) setIsEditClass(true)
    else setIsEditClass(false)
  }, [showCommentMenu, isEdit])

  return (
    <li id={id} className={`comments__item ${isEditClass ? 'highlight' : ''}`}>
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

        <div className="comments__text--container">
          <div className="comments__text--shadow-outset">
            <div className="comments__user-details">
              <p className="comments__username">
                {commentUserName}
                <span>{isAuthor ? `${String.fromCodePoint(8226)} song author` : null}</span>
              </p>
              <p className="comments__date">
                {commentData.editedOn
                  ? `${formatDate(commentData.editedOn, 'm')} ${String.fromCodePoint(8226)} edited`
                  : commentDate
                  ? formatDate(commentDate, 'm')
                  : '1y'}
              </p>
            </div>
            <p className="comments__comment">{commentText}</p>
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
                  actions={{ songId: songId, toDelete: commentData }}
                />
                <ButtonCommentActions
                  type="edit"
                  actions={{
                    itemId: id,
                    comment: commentData,
                    isEdit: isEdit,
                    setEdit: setIsEdit,
                    value: commentText,
                    update: update,
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
