import {
  useEffect,
  useState,
  useRef,
  useCallback,
  SetStateAction,
  Dispatch,
  forwardRef,
} from 'react'
import ReactDOM from 'react-dom'
import useMobileKeyboardHandler from '../../hooks/useMobileKeyboardHandler'
import CommentFormData from './Logic/CommentFormData'
import { CommentActions, ITextModalObject } from './Logic/types'
// import { ISong, IComment } from '../../interfaces/IModels'
import { IComment } from '../../../../backend/src/models/Comment'
import { sendIcon } from '../../assets/images/_icons'

type TextInputProps = {
  type: string
  textModalObject: ITextModalObject
  setTextModalObject: Dispatch<SetStateAction<ITextModalObject>>
}

export default function TextInputModal({
  type,
  textModalObject,
  setTextModalObject,
}: TextInputProps) {
  const root = document.getElementById('root')!
  const { handleSubmit, error, setError, notification, setNotification } = CommentFormData()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  if (textModalObject.inputType === '') return null
  return ReactDOM.createPortal(
    <div
      className="CommentInputModal"
      style={
        type ? { position: 'fixed', display: 'flex' } : { position: 'relative', display: 'none' }
      }
    >
      <form
        className="comment-input__form"
        // onSubmit={e => handleSubmit(e, songInView?._id, comment)}
      >
        <TextArea commentToEdit={textModalObject.comment} ref={inputRef} />
        <div className="comment-input__header">
          <div className="comment-input__title--container">
            <div className="comment-input__title">
              <p className="comment-input__text">
                {type === CommentActions.Comment
                  ? 'Leave your Comment'
                  : type === CommentActions.Edit
                  ? 'Edit your Comment'
                  : 'Make your Reply'}
              </p>
            </div>
          </div>

          <div className="comment-input__btn--container">
            <div className="comment-input__btn">
              <button
                className="comment-input__btn--cancel"
                type="button"
                onClick={() =>
                  setTextModalObject(prev => ({
                    ...prev,
                    inputType: CommentActions.Hide,
                    comment: undefined,
                    isEditing: '',
                  }))
                }
              >
                cancel
              </button>
            </div>

            <div className="comment-input__btn">
              <button
                className="comment-input__btn--submit"
                type="submit"
                onClick={e =>
                  handleSubmit(
                    e,
                    type,
                    textModalObject.songId,
                    inputRef.current,
                    textModalObject.comment,
                  )
                }
              >
                <img className="social-icons si-send" src={sendIcon} alt="send" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>,
    root,
  )
}

const TextArea = forwardRef(
  ({ commentToEdit }: { commentToEdit: IComment | undefined }, ref: any) => {
    const { handleOnFocus } = useMobileKeyboardHandler()
    const [comment, setComment] = useState<string>(commentToEdit ? commentToEdit.text : '')

    useEffect(() => {
      const commentText = commentToEdit ? commentToEdit.text : ''
      setComment(commentText)
    }, [commentToEdit])

    useEffect(() => {
      if (ref) ref.current.focus()
    }, [ref])

    const expandTextarea = useCallback(
      (text: EventTarget & HTMLTextAreaElement) => {
        setComment(text.value)
        text.style.height = 'inherit'
        let computed = window.getComputedStyle(text)
        let height =
          parseInt(computed.getPropertyValue('border-top-width'), 10) +
          parseInt(computed.getPropertyValue('padding-top'), 10) +
          text.scrollHeight +
          parseInt(computed.getPropertyValue('padding-bottom'), 10) +
          parseInt(computed.getPropertyValue('border-bottom-width'), 10)
        text.style.height = `${height}px`
      },
      [comment],
    )

    return (
      <div className="comment-input__input--container">
        <textarea
          className="comment-input__input"
          ref={ref}
          placeholder="Express your thoughts..."
          value={comment}
          onFocus={() => handleOnFocus()}
          onChange={e => expandTextarea(e.target)}
        />
      </div>
    )
  },
)
