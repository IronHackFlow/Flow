import { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import useHandleOSK from '../utils/useHandleOSK'
import { sendIcon } from '../assets/images/_icons'


export default function CommentInputModal({ isOpen, onClose}) {
  const { handleOnFocus } = useHandleOSK()
  const [comment, setComment] = useState()

  if (!isOpen) return null;
  
  const expandTextarea = (text) => {
    setComment(text.value)
    text.style.height = "inherit"
    let computed = window.getComputedStyle(text);
    let height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                + parseInt(computed.getPropertyValue('padding-top'), 10)
                + text.scrollHeight
                + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    text.style.height = `${height}px`
  }

  return ReactDOM.createPortal(
    <div 
      className="CommentInputModal" 
      style={isOpen ? {position: "fixed"} : {position: "relative"}}
    >
      <form className="social-comment-form">
        <div className="social-input-container">
          <textarea
            className="social-comment-input"
            type="text"
            placeholder="Make a comment..."
            autoFocus
            value={comment}
            onFocus={() => handleOnFocus()}
            onChange={(e) => expandTextarea(e.target)}
          />
        </div>
        <div className="comment-btn-container">
          <button className="comment-button" onClick={() => onClose(false)}>
            <img className="social-icons si-send" src={sendIcon} alt="send" />
          </button>
        </div>
      </form>
    </div>,
    document.body
  )
}
//<div className="com-cont-1">
//  <form className="social-comment-form" onSubmit={(e) => handleSubmit(e, comment, props.songInView._id)}>
//    <div className="social-input-container">
//      <input
//        className="social-comment-input"
//        ref={props.commentInputRef}
//        onChange={e => setComment(e.target.value)}
//        type="text"
//        placeholder="Make a comment..."
//      ></input>
//    </div>
//    <div className="comment-btn-container">
//      <button className="comment-button">
//        <img className="social-icons si-send" src={sendIcon} alt="send" />
//      </button>
//    </div>
//  </form>
//</div>