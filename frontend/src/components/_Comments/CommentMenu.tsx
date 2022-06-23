import { useEffect, useState, Dispatch, SetStateAction, PropsWithChildren } from 'react'
import CommentItem from './CommentItem'
import TextInputModal from './TextInputModal'
import { IComment, ISong } from '../../interfaces/IModels'
import { CommentActions, ITextModalObject } from './Logic/types'
import { LayoutTwo, LayoutThree } from '../__Layout/LayoutWrappers'
import { commentIcon, goBackIcon } from '../../assets/images/_icons'

type CommentMenuProps = {
  song: ISong
  page: string
  isOpen: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

type CommentMenuButtonProps = PropsWithChildren<{
  onClick: () => void
  addClass: string
}>

export default function CommentMenu({ song, page, isOpen, onClose }: CommentMenuProps) {
  const [songComments, setSongComments] = useState<IComment[]>([])
  const initialModalObject = {
    inputType: CommentActions.Hide,
    songId: song?._id,
    comment: undefined,
    isEditing: '',
  }
  const [commentInput, setCommentInput] = useState<ITextModalObject>(initialModalObject)

  useEffect(() => {
    console.log(song, 'wtf is going on??')
    setSongComments(song.comments)
  }, [song])

  const handleCloseMenu = () => {
    onClose(false)
    setCommentInput(initialModalObject)
  }

  const toggleTextInputModal = () => {
    setCommentInput(prev => ({
      ...prev,
      inputType:
        prev.inputType !== CommentActions.Comment ? CommentActions.Comment : CommentActions.Hide,
      comment: undefined,
      isEditing: '',
    }))
  }

  return (
    <div
      className={`CommentMenu ${isOpen ? 'show-menu' : 'hide-menu'}`}
      style={page === 'home' && isOpen ? { marginBottom: '-8%' } : { marginBottom: '0%' }}
    >
      <LayoutThree
        classes={[
          'comments__list--container',
          'comments__list--shadow-outset',
          'comments__list--shadow-inset',
        ]}
      >
        <ul className="comments__list">
          {songComments?.map(item => {
            return (
              <CommentItem
                key={item._id}
                comment={item}
                song={song}
                textModalObject={commentInput}
                setTextModalObject={setCommentInput}
              />
            )
          })}
        </ul>
      </LayoutThree>

      <LayoutThree
        classes={[
          'comments__header--container',
          'comments__header--shadow-outset',
          'comments__header--shadow-inset',
        ]}
      >
        <CommentMenuButton onClick={handleCloseMenu} addClass="close">
          <img className="button-icons" src={goBackIcon} alt="go back" />
        </CommentMenuButton>
        <LayoutTwo classes={['comments__title--container', 'comments__title--shadow-outset']}>
          <h3 className="comments__text">Comments </h3>
          <p>{songComments?.length}</p>
        </LayoutTwo>

        <CommentMenuButton onClick={toggleTextInputModal} addClass="addComment">
          {/* <p>Comment</p> */}
          <div className="comments__header-icon">
            <img className="button-icons" src={commentIcon} alt="add comment" />
          </div>
        </CommentMenuButton>
      </LayoutThree>

      <TextInputModal
        type={commentInput.inputType}
        textModalObject={commentInput}
        setTextModalObject={setCommentInput}
      />
    </div>
  )
}

const CommentMenuButton = ({ onClick, addClass, children }: CommentMenuButtonProps) => {
  return (
    <div className="comments__header-btn--container">
      <button
        className={`comments__header-btn ${addClass}`}
        type="button"
        onClick={() => onClick()}
      >
        {children}
      </button>
    </div>
  )
}
