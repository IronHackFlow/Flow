import { useEffect, useState, Dispatch, SetStateAction, PropsWithChildren } from 'react'
import CommentItem from './CommentItem'
import TextInputModal from './TextInputModal'
// import { IComment, } from '../../interfaces/IModels'
import { IComment } from '../../../../backend/src/models/Comment'
import { ISong } from '../../../../backend/src/models/Song'
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
  const [currentSong, setCurrentSong] = useState<ISong>(song)
  const [songComments, setSongComments] = useState<IComment[]>([])
  const initialModalObject = {
    inputType: CommentActions.Hide,
    songId: currentSong?._id,
    comment: undefined,
    isEditing: '',
  }
  const [commentInput, setCommentInput] = useState<ITextModalObject>(initialModalObject)

  useEffect(() => {
    setCurrentSong(song)
  }, [song])

  useEffect(() => {
    console.log(song, 'wtf is going on??')
    setSongComments(currentSong.comments)
    setCommentInput(initialModalObject)
  }, [currentSong])

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
                song={currentSong}
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
