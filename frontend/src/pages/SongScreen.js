import { useContext, useLayoutEffect, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SongDataContext } from '../contexts/SongData'
import Loading from '../components/Loading'
import ButtonSocialAction from '../components/ButtonSocialAction'
import usePostFollow from '../utils/usePostFollow'
import usePostLike from '../utils/usePostLike'
import CommentButton from '../components/Comments/CommentButton'
import CommentMenu from '../components/Comments/CommentMenu'
import CommentInputModal from '../components/Comments/CommentInputModal'
import AudioTimeSlider from '../components/AudioTimeSlider'
import useFormatDate from '../utils/useFormatDate'
import gifsArr from '../assets/images/gifs.json'
import gradientbg from '../assets/images/gradient-bg-2.png'
import { playIcon, pauseIcon, previousIcon, forwardIcon, goBackIcon } from '../assets/images/_icons'

export default function SongScreen() {
  const { homeFeedSongs, isLoading } = useContext(SongDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { currentSong, returnValue } = location.state
  const { formatDate } = useFormatDate()
  const { addSongLike, deleteSongLike } = usePostLike()
  const { postFollow, deleteFollow } = usePostFollow()

  const gifsCopy = [...gifsArr]
  const [songInView, setSongInView] = useState({ song: currentSong, songVideo: gifsCopy[0].url })
  const [usersSongs, setUsersSongs] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [showCommentInputModal, setShowCommentInputModal] = useState(null)
  const [editComment, setEditComment] = useState(null)
  const [songScreen] = useState(`#353535`)
  const [isMarquee, setIsMarquee] = useState(false)

  const titleRef = useRef()
  const wrapperRef = useRef()
  const playPauseRef = useRef()

  useLayoutEffect(() => {
    let computedTitleWidth = window.getComputedStyle(titleRef.current)
    let computedWrapperWidth = window.getComputedStyle(wrapperRef.current)
    let titleWidth = parseInt(computedTitleWidth.getPropertyValue('width'))
    let wrapperWidth = parseInt(computedWrapperWidth.getPropertyValue('width'))

    if (titleWidth >= wrapperWidth) setIsMarquee(true)
    else setIsMarquee(false)
  }, [songInView])

  useEffect(() => {
    let filterSongs = homeFeedSongs?.filter(
      each => each.song?.song_user?._id === currentSong?.song_user?._id,
    )
    setUsersSongs(filterSongs)
  }, [homeFeedSongs])

  const handleCommentMenu = () => {
    setShowCommentMenu(true)
    setShowCommentInputModal(true)
  }

  const findCurrentSong = direction => {
    usersSongs.filter((each, index) => {
      if (each.song._id === songInView?.song?._id) {
        if (direction === 'back') {
          if (index === 0) {
            return null
          } else {
            setSongInView(usersSongs[index - 1])
            console.log(songInView, 'back')
          }
        } else {
          if (index === usersSongs.length - 1) {
            return null
          } else {
            setSongInView(usersSongs[index + 1])
          }
        }
      }
    })
  }

  const getSongIndex = (array, current) => {
    let index = array.map((each, index) => {
      if (each.song._id === current.song._id) {
        return index + 1
      }
    })
    return index
  }

  const onClose = () => {
    if (returnValue) navigate('/search', { state: { returnValue: returnValue } })
    else navigate(-1)
  }

  return (
    <div
      id="SongScreen"
      className="SongScreen"
      style={{
        backgroundImage: `url('${gradientbg}'), url(${songInView?.songVideo})`,
      }}
    >
      <Loading addClass={'LoadingSongScreen'} />
      <CommentInputModal
        songId={songInView?.song?._id}
        isOpen={showCommentInputModal}
        onClose={setShowCommentInputModal}
        onEdit={editComment}
      />
      <CommentMenu
        songInView={songInView?.song}
        isOpen={showCommentMenu}
        onClose={setShowCommentMenu}
        onCloseInput={setShowCommentInputModal}
        setEditComment={setEditComment}
      />

      <div className="song-screen--container">
        <div className="songscreen__header--container">
          <div className="songscreen__header--shadow-outset">
            <div className="songscreen__header--shadow-inset">
              <div className="songscreen__exit--container">
                <button className="songscreen__exit-btn" onClick={() => onClose()}>
                  <img className="button-icons" src={goBackIcon} alt="go back" />
                </button>
              </div>
              <div className="songscreen__title--container">
                <div className="songscreen__title--shadow-inset">
                  <div className="songscreen__photo--container">
                    <div className="songscreen__photo--shadow-inset">
                      <div className="songscreen__photo--shadow-outset">
                        <img src={songInView?.song?.song_user?.picture} alt="song user" />
                      </div>
                    </div>
                  </div>

                  <div className="songscreen__song-data--container">
                    <div className="songscreen__song-title--container">
                      <div className="songscreen__song-title--shadow-inset">
                        <div
                          className={`marquee-wrapper ${isMarquee ? 'marquee--animation' : ''}`}
                          ref={wrapperRef}
                        >
                          <p className="songscreen__song-title" id="marquee-one" ref={titleRef}>
                            {songInView?.song?.name}
                          </p>
                          {isMarquee && (
                            <p className="songscreen__song-title" id="marquee-two" ref={titleRef}>
                              {songInView?.song?.name}
                            </p>
                          )}
                        </div>
                        <p className="songscreen__song-index">
                          <span>{getSongIndex(usersSongs, songInView)}</span>
                          of {usersSongs?.length}
                        </p>
                      </div>
                    </div>
                    <div className="songscreen__song-data">
                      <p>
                        {songInView?.song?.caption
                          ? songInView?.song?.caption
                          : 'No caption for this song'}
                      </p>
                      <p>
                        by: <span> {songInView?.song?.song_user?.user_name}</span>
                      </p>
                      <p>on: {formatDate(songInView?.song?.date, 'MMMM_Dth_YYYY')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="song-video-frame"
          style={isLoading === true ? { opacity: '0' } : { opacity: '1' }}
        >
          <div className="song-lyric-container">
            {songInView?.song?.lyrics?.map((each, index) => {
              return (
                <div className="each-lyric-container" key={`${each}_${index}`}>
                  <p className="each-lyric-no">{index + 1}</p>
                  <p className="each-lyric-line">{each}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="songscreen__interactions--container">
          <div className="songscreen__play--container">
            <div className="songscreen__play--shadow-inset">
              <div className="songscreen__play--shadow-outset">
                <div className="songscreen__play">
                  <div className="songscreen__navigate back">
                    <button
                      className="songscreen__navigate-btn"
                      onClick={() => findCurrentSong('back')}
                    >
                      <img src={previousIcon} alt="go back" />
                    </button>
                  </div>

                  <div className="songscreen__play-btn--container">
                    <div className="songscreen__play-btn--shadow-inset">
                      {isPlaying ? (
                        <div className="songscreen__play-btn">
                          <div className="songscreen__play-btn--shadow-outset">
                            <button
                              className="songscreen__play-btn--shadow-outset2"
                              onClick={() => setIsPlaying(false)}
                            >
                              <div className="songscreen__play-btn--shadow-inset">
                                <img
                                  src={pauseIcon}
                                  ref={playPauseRef}
                                  style={{ marginLeft: '0%' }}
                                  alt="pause icon"
                                />
                              </div>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="songscreen__play-btn">
                          <div className="songscreen__play-btn--shadow-outset">
                            <button
                              className="songscreen__play-btn--shadow-outset2"
                              onClick={() => setIsPlaying(true)}
                            >
                              <div className="songscreen__play-btn--shadow-inset">
                                <img src={playIcon} ref={playPauseRef} alt="play icon" />
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="songscreen__navigate forward">
                    <button
                      className="songscreen__navigate-btn"
                      onClick={() => findCurrentSong('next')}
                    >
                      <img src={forwardIcon} alt="go forward" />
                    </button>
                  </div>
                </div>

                <div className="songscreen__audioslider--container">
                  <div className="songscreen__audioslider--shadow-inset">
                    <div className="songscreen__audioslider--shadow-outset">
                      <AudioTimeSlider
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentSong={songInView.song}
                        location={songScreen}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="songscreen__social-btns--container">
            <div className="songscreen__social-btns--shadow-outset">
              <div className="songscreen__social-btns--shadow-inset">
                <div className="songscreen__btn--container follow">
                  <ButtonSocialAction
                    type="follow"
                    songInView={{
                      id: songInView?.song?.song_user?._id,
                      list: songInView?.song?.song_user?.followers,
                    }}
                    btnStyle="songScreen"
                    action={{ add: postFollow, delete: deleteFollow }}
                  />
                </div>
                <div className="songscreen__btn--container like">
                  <ButtonSocialAction
                    type="like"
                    songInView={{ id: songInView?.song?._id, list: songInView?.song?.song_likes }}
                    btnStyle="songScreen"
                    action={{ add: addSongLike, delete: deleteSongLike }}
                  />
                </div>
                <div className="songscreen__btn--container comment">
                  <CommentButton
                    songInView={songInView.song}
                    btnStyle="songScreen"
                    isPushed={showCommentMenu}
                    onClose={handleCommentMenu}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
