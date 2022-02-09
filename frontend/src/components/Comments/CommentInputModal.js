import { useEffect, useState, useRef, useCallback } from 'react'
import useHandleOSK from '../../utils/useHandleOSK'
import usePostComment from '../../utils/usePostComment'
import { sendIcon } from '../../assets/images/_icons'

export default function CommentInputModal({ songId, isOpen, onClose, onEdit }) {
  const { handleOnFocus } = useHandleOSK()
  const { addComment, editComment } = usePostComment()
  const [comment, setComment] = useState()
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
    if (isOpen === 'edit') setComment(onEdit.editValue)
    else setComment('')
  }, [isOpen, onEdit])

  const expandTextarea = useCallback(
    text => {
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
    [comment, songId, isOpen, onEdit],
  )

  const handleSubmit = (e, songId, value) => {
    e.preventDefault()
    if (value === '') return
    if (isOpen === 'comment') {
      addComment(songId, value)
    } else if (isOpen === 'edit') {
      editComment(songId, onEdit.comment, value)
    }
    setComment('')
    onClose(null)
  }

  return (
    <div
      className="CommentInputModal"
      style={
        isOpen ? { position: 'fixed', display: 'flex' } : { position: 'relative', display: 'none' }
      }
    >
      <form className="comment-input__form" onSubmit={e => handleSubmit(e, songId, comment)}>
        <div className="comment-input__input--container">
          <textarea
            className="comment-input__input"
            ref={inputRef}
            type="text"
            placeholder="Express your thoughts..."
            value={comment}
            onFocus={() => handleOnFocus()}
            onChange={e => expandTextarea(e.target)}
          />
        </div>
        <div className="comment-input__header">
          <div className="comment-input__title--container">
            <div className="comment-input__title">
              <h2>
                {isOpen === 'comment'
                  ? 'Leave your Comment'
                  : isOpen === 'edit'
                  ? 'Edit your Comment'
                  : 'Make your Reply'}
              </h2>
            </div>
          </div>

          <div className="comment-input__btn--container">
            <div className="comment-input__btn">
              <button
                className="comment-input__btn--cancel"
                type="button"
                onClick={() => onClose(null)}
              >
                cancel
              </button>
            </div>

            <div className="comment-input__btn">
              <button
                className="comment-input__btn--submit"
                type="submit"
                onClick={e => handleSubmit(e, songId, comment)}
              >
                <img className="social-icons si-send" src={sendIcon} alt="send" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
