import { useContext, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SongDataContext } from '../contexts/SongData'
import Loading from '../components/Loading'
import LikeButton from "../components/LikeButton"
import FollowButton from "../components/FollowButton"
import ButtonSocialAction from "../components/ButtonSocialAction"
import usePostFollow from '../utils/usePostFollow';
import usePostLike from '../utils/usePostLike';
import CommentButton from "../components/CommentButton"
import CommentMenu from "../components/CommentMenu"
import CommentInputModal from "../components/CommentInputModal"
import AudioTimeSlider from "../components/AudioTimeSlider"
import useFormatDate from "../utils/useFormatDate"
import gifsArr from '../assets/images/gifs.json'
import gradientbg from '../assets/images/gradient-bg-2.png'
import { followIcon, commentIcon, playIcon, pauseIcon, previousIcon, forwardIcon, closeIcon, thumbsUpIcon } from '../assets/images/_icons'

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
  const [showCommentInputModal, setShowCommentInputModal] = useState(false)
  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [commentsArray, setCommentsArray] = useState([])
  const [totalComments, setTotalComments] = useState(currentSong?.song_comments?.length)
  const [songScreen] = useState(`#353535`)

  const commentInputRef = useRef()
  const playPauseRef = useRef()


  useEffect(() => {
    let filterSongs = homeFeedSongs?.filter(each => each.song?.song_user?._id === currentSong?.song_user?._id)
    setUsersSongs(filterSongs)
  }, [homeFeedSongs])

  const popUpComments = () => {
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
            console.log(songInView, "back")
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
    if (returnValue) navigate("/search", { state: { returnValue: returnValue }})
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
      <CommentInputModal isOpen={showCommentInputModal} onClose={setShowCommentInputModal} />
      <CommentMenu
        commentInputRef={commentInputRef}
        songInView={songInView}
        commentsArray={commentsArray}
        setCommentsArray={setCommentsArray}
        totalComments={totalComments}
        setTotalComments={setTotalComments}
        isOpen={showCommentMenu}
        onClose={setShowCommentMenu}
        onCloseInput={setShowCommentInputModal}
      />

      <div className="song-screen--container">
      <div className="close-window-frame">
        <div className="song-listing-container">
          <div className="song-listing-outer">
            <div className="song-listing-inner">
              <div className="listing-photo-container">
                <div className="listing-photo-outer">
                  <div className="listing-photo-inner">
                    <img src={songInView?.song?.song_user?.picture} alt="song user" />
                  </div>
                </div>
              </div>

              <div className="listing-track-container">
                <div className="track-title-container">
                  <div className="track-title-outer">
                    <p className="track-name">{songInView?.song?.name}</p>
                    <p className="track-index">
                      <span>
                        {getSongIndex(usersSongs, songInView)}
                      </span>
                      of {usersSongs?.length}
                    </p>
                  </div>
                </div>
                <div className="track-details-container">
                  <p>
                    {songInView?.song?.caption
                      ? songInView?.song?.caption
                      : "No caption for this song"
                    }
                  </p>
                  <p>
                    by: <span style={{ color: '#b7a2a6' }}>{songInView?.song?.song_user?.user_name}</span>
                  </p>
                  <p>on: {formatDate(songInView?.song?.date, "MMMM_Dth_YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="close-window-container">
          <button className="close-window-outer" onClick={() => onClose()}>
            <div className="close-window-inner">
              <img src={closeIcon} alt="close window" />
            </div>
          </button>
        </div>
      </div>

      <div 
        className="song-video-frame"
        style={isLoading === true ? {opacity: "0"} : {opacity: "1"}}
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

      <div className="song-details-container">
        <div className="song-details">
          <div className="song-play-container">
            <div className="song-play-outer">
              <div className="play-buttons-container">
                <div className="play-buttons-left">
                  <button className="play-arrow-container" onClick={() => findCurrentSong('back')}>
                    <img src={previousIcon} alt="go back" />
                  </button>
                </div>

                <div className="play-buttons-middle">
                  <div className="play-outer">
                    {isPlaying
                      ? (
                        <button className="play-inner" onClick={() => setIsPlaying(false)}>
                          <div className="play-img-container">
                            <img src={pauseIcon} ref={playPauseRef} style={{marginLeft: '0%'}} alt="pause icon" />
                          </div>
                        </button>
                      )
                      : (
                        <button className="play-inner" onClick={() => setIsPlaying(true)}>
                          <div className="play-img-container">
                            <img src={playIcon} ref={playPauseRef} alt="play icon" />
                          </div>
                        </button>
                      )}
                  </div>
                </div>

                <div className="play-buttons-right">
                  <button className="play-arrow-container" onClick={() => findCurrentSong('next')}>
                    <img src={forwardIcon} alt="go forward" />
                  </button>
                </div>
              </div>

              <div className="play-slider-container">
                <AudioTimeSlider
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentSong={songInView}
                  location={songScreen}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="social-buttons">
          <div className="social-list">
            <ButtonSocialAction 
              type="follow"
              songInView={{id: songInView?.song?.song_user?._id, list: songInView?.song?.song_user?.followers}}
              btnStyle="songScreen"
              action={{ add: postFollow, delete: deleteFollow }}
            />
            <ButtonSocialAction 
              type="like"
              songInView={{id: songInView?.song?._id, list: songInView?.song?.song_likes }}
              btnStyle="songScreen"
              action={{ add: addSongLike, delete: deleteSongLike }}
            />
            {/* <FollowButton songInView={songInView.song} btnStyle="songScreen" />
            <LikeButton songInView={songInView.song} btnStyle="songScreen" /> */}
            <CommentButton songInView={songInView.song} btnStyle="songScreen" isPushed={showCommentMenu} onClose={popUpComments} />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
