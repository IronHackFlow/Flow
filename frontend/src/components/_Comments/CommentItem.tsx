import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import { LayoutTwo, LayoutThree } from '../__Layout/LayoutWrappers'
import { IComment, ISong } from '../../interfaces/IModels'
import {
  DeleteButtonWrapper,
  EditButtonWrapper,
  LikeButtonWrapper,
  ReplyButtonWrapper,
} from './ItemButtonWrappers'
import { ITextModalObject } from './Logic/types'
import useFormatDate from '../../hooks/useFormatDate'

type CommentItemProps = {
  comment: IComment
  song: ISong
  textModalObject: ITextModalObject
  setTextModalObject: Dispatch<SetStateAction<ITextModalObject>>
}

export default function CommentItem({
  comment,
  song,
  textModalObject,
  setTextModalObject,
}: CommentItemProps) {
  const { user } = useAuth()
  const { formatDate } = useFormatDate()
  const listId = comment?._id
  const editId = textModalObject?.isEditing
  const commentUser = comment?.user
  const userId = user?._id
  const isCommentUser = userId === commentUser?._id ? true : false
  const isCommentSongUser = song?.user?._id === commentUser?._id ? true : false

  return (
    <li id={comment?._id} className={`comments__item ${listId === editId ? 'highlight' : ''}`}>
      <div className="comment-list-inner">
        <LayoutThree classes={['comment-list-photo', 'comment-photo-inner', 'comment-photo-outer']}>
          <Link to={`/profile/${commentUser?._id}`} state={{ propSongUser: commentUser }}>
            <img src={commentUser?.picture} alt="user's profile" />
          </Link>
        </LayoutThree>

        <LayoutTwo classes={['comments__text--container', 'comments__text--shadow-outset']}>
          <div className="comments__user-details">
            <p className="comments__username">
              {commentUser?.username}
              <span>{isCommentSongUser && `${String.fromCodePoint(8226)} song author`}</span>
            </p>
            <p className="comments__date">
              {comment?.updatedOn && comment?.updatedOn !== comment?.createdOn
                ? `${formatDate(comment?.updatedOn, 'm')} ${String.fromCodePoint(8226)} edited`
                : formatDate(comment?.createdOn, 'm')}
            </p>
          </div>
          <p className="comments__comment">{comment?.text}</p>
        </LayoutTwo>
      </div>

      <div className="comments__actions--container">
        <div className="space-filler"></div>
        <LayoutTwo classes={['comments__actions', 'comments__actions--shadow-inset']}>
          <LikeButtonWrapper isCommentUser={isCommentUser} comment={comment} userId={userId} />
          <ReplyButtonWrapper isCommentUser={isCommentUser} comment={comment} />
          <EditButtonWrapper
            isCommentUser={isCommentUser}
            setTextModalObject={setTextModalObject}
            comment={comment}
          />
          <DeleteButtonWrapper isCommentUser={isCommentUser} comment={comment} />
        </LayoutTwo>
      </div>
    </li>
  )
}
