import { useContext, useEffect, useState } from 'react'
import { SongDataContext } from '../../contexts/SongData'
import HomeContext from '../../contexts/HomeContext'
import CommentItem from './CommentItem'
import { goBackIcon } from '../../assets/images/_icons'

export default function CommentMenu({ page }) {
  const { homeFeedSongs } = useContext(SongDataContext)
  const { songInView, showCommentMenu, setShowCommentMenu, setShowCommentInputModal } =
    useContext(HomeContext)
  const [songComments, setSongComments] = useState([])
  // const [isEdit, setIsEdit] = useState(null)
  const [updateComments, setUpdateComments] = useState(false)

  useEffect(() => {
    homeFeedSongs?.forEach(song => {
      if (song.song._id === songInView?._id) {
        if (songComments?.length !== song.song.song_comments.length) {
          setSongComments(song.song.song_comments)
        } else if (updateComments) {
          setSongComments(song.song.song_comments)
        } else {
          setSongComments(songInView?.song_comments)
        }
      }
    })
  }, [songInView, homeFeedSongs, updateComments])

  return (
    <div
      className={`CommentMenu ${showCommentMenu ? 'show-menu' : 'hide-menu'}`}
      style={page === 'home' && showCommentMenu ? { marginBottom: '-8%' } : { marginBottom: '0%' }}
    >
      <div className="comments__list--container">
        <div className="comments__list--shadow-outset">
          <div className="comments__list--shadow-inset">
            <ul className="comments__list">
              {songComments?.map(item => {
                return (
                  <CommentItem
                    key={item._id}
                    commentData={item}
                    // isEdit={isEdit}
                    // setIsEdit={setIsEdit}
                    update={setUpdateComments}
                  />
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="comments__header--container">
        <div className="comments__header--shadow-outset">
          <div className="comments__header--shadow-inset">
            <div className="comments__back-btn--container">
              <button
                className="comments__back-btn"
                type="button"
                onClick={() => {
                  setShowCommentMenu(false)
                  setShowCommentInputModal(null)
                }}
              >
                <img className="button-icons" src={goBackIcon} alt="go back" />
              </button>
            </div>

            <div className="comments__title--container">
              <div className="comments__title--shadow-outset">
                <h3 className="comments__text">Comments </h3>
                <p>{songComments?.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
