import { Dispatch, SetStateAction, useState } from 'react'
import ItemButton from './ItemButton'
import ContinueModal from '../_Modals/ContinueModal'
import { IComment } from '../../interfaces/IModels'
import { CommentActions, ITextModalObject } from './Logic/types'

interface IButtonWrapper {
  isCommentUser: boolean
  comment: IComment
}

interface IEditButtonWrapper extends IButtonWrapper {
  setTextModalObject: Dispatch<SetStateAction<ITextModalObject>>
}

interface ILikeButtonWrapper extends IButtonWrapper {
  userId: string | undefined
}

export const EditButtonWrapper = ({
  isCommentUser,
  comment,
  setTextModalObject,
}: IEditButtonWrapper) => {
  const handleOnEdit = () => {
    // TODO: Handle case where user clicks edit button on a comment,
    // and then clicks on another edit button on a different comment
    setTextModalObject(prev => ({
      ...prev,
      inputType: prev.inputType !== CommentActions.Edit ? CommentActions.Edit : CommentActions.Hide,
      comment: prev.inputType !== CommentActions.Edit ? comment : undefined,
      isEditing: prev.inputType !== CommentActions.Edit ? comment._id : '',
    }))
  }

  if (!isCommentUser) return null
  return (
    <div className="comments__btn--container">
      <ItemButton type={CommentActions.Edit} onClick={() => handleOnEdit()} />
    </div>
  )
}

export const DeleteButtonWrapper = ({ isCommentUser, comment }: IButtonWrapper) => {
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const handleOnDelete = () => {
    // delete comment with useMutation
    // commentId && songId
    console.log('deleting comment')
  }

  if (!isCommentUser) return null
  return (
    <div className="comments__btn--container">
      <ItemButton type={CommentActions.Delete} onClick={() => setIsDelete(true)} />
      <ContinueModal
        title="Delete Comment"
        text="Are you sure you want to delete this comment?"
        btnText="delete"
        isOpen={isDelete}
        onClose={setIsDelete}
        onExit={handleOnDelete}
      />
    </div>
  )
}

export const LikeButtonWrapper = ({ isCommentUser, comment, userId }: ILikeButtonWrapper) => {
  const isLiked = comment.likes.includes(userId ? userId : '') ? true : false

  const handleOnLike = () => {
    // add/delete like with useMutation
    // songId && commentId
  }

  return (
    <div className="comments__btn--container">
      <ItemButton
        type={CommentActions.Like}
        onClick={() => handleOnLike()}
        total={comment?.likes?.length}
        isLiked={isLiked}
      />
    </div>
  )
}

export const ReplyButtonWrapper = ({ isCommentUser, comment }: IButtonWrapper) => {
  const handleOnReply = () => {
    // reply to comment
  }

  return (
    <div className="comments__btn--container">
      <ItemButton
        type={CommentActions.Reply}
        onClick={() => handleOnReply()}
        total={comment?.replies?.length}
      />
    </div>
  )
}
