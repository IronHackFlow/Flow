import { useContext, useEffect, useState } from 'react'
import { commentIcon } from '../../assets/images/_icons'
import { SongDataContext } from '../../contexts/SongData'

export default function CommentButton({ songInView, btnStyle, isPushed, onClose }) {
  const { homeFeedSongs, isLoading } = useContext(SongDataContext)
  const comments = songInView?.song_comments
  const [totalComments, setTotalComments] = useState()

  useEffect(() => {
    setTotalComments(comments?.length)
    homeFeedSongs.forEach(song => {
      if (song.song._id === songInView?._id) {
        if (totalComments !== song.song.song_comments.length) {
          setTotalComments(song.song.song_comments.length)
        }
      }
    })
  }, [songInView, homeFeedSongs])

  if (btnStyle === 'home') {
    return (
      <>
        <button
          className={`action-btn_shadow-div-outset ${isPushed ? 'comment-pressed' : ''}`}
          onClick={() => onClose()}
        >
          <div className="action-btn-icon_shadow-div-inset">
            <img className="social-icons comment" src={commentIcon} alt="comment on post icon" />
          </div>
          <div className="action-btn-container">
            <div
              className="loading loading-btn"
              style={isLoading ? { opacity: '1' } : { opacity: '0' }}
            ></div>
            <div className="action-btn-text">
              <p style={{ color: 'white' }}>{totalComments}</p>
              <p>{totalComments === 1 ? 'comment' : 'comments'}</p>
            </div>
          </div>
        </button>
      </>
    )
  } else {
    return (
      <>
        <div className="songscreen__btn">
          <div className="songscreen__text--container">
            <p className="songscreen__text num">{totalComments}</p>
            <p className="songscreen__text title">{totalComments === 1 ? 'comment' : 'comments'}</p>
          </div>
          <button className={`social-button ${isPushed ? 'pushed' : ''}`} onClick={() => onClose()}>
            <img
              className="social-icons comment"
              src={commentIcon}
              alt="comment on post icon"
            ></img>
          </button>
        </div>
      </>
    )
  }
}
