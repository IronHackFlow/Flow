import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'
import { songData } from '../components/songFeedComponents/SongData'
import AudioTimeSlider from "../components/AudioTimeSlider"
import Loading from '../components/Loading'
import Comments from "../components/Comments"
import useEventListener from '../utils/useEventListener'
import usePostLike from "../utils/usePostLike"
import usePostFollow from "../utils/usePostFollow"
import useFormatDate from "../utils/useFormatDate"
import gifsArr from '../images/gifs.json'
import follow from '../images/follow.svg'
import comments from '../images/comment.svg'
import play from '../images/play.svg'
import pause from '../images/pause.svg'
import backward from '../images/backward.svg'
import forward from '../images/forward.svg'
import close from '../images/close.svg'
import heart2 from '../images/heart2.svg'
import gradientbg from '../images/gradient-bg-2.png'

function SongScreen(props) {
  const { user, windowSize } = useContext(TheContext)
  const { isLoading, setIsLoading } = useContext(songData)

  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('SongScreen').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('SongScreen').style.height = `${onChange}px`
    }
  })

  const { handlePostLike, handleInViewLikes, likes } = usePostLike();
  const { handlePostFollow, handleInViewFollowers, followers } = usePostFollow();
  const { formatDate } = useFormatDate()
  const navigate = useNavigate();
  const location = useLocation();
  const { propCurrentSong, propSearchValue, propReturnLink } = location.state

  const gifsCopy = [...gifsArr];
  const [thisSong, setThisSong] = useState(propCurrentSong);
  const [allSongs, setAllSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false)
  const [poppedUp, setPoppedUp] = useState(false)
  const [commentsArray, setCommentsArray] = useState([])
  const [totalComments, setTotalComments] = useState(propCurrentSong?.song_comments?.length);
  const [songScreen] = useState(`#353535`);

  const windowRef = useRef();
  const commentInputRef = useRef();
  const followBtn = useRef();
  const playPauseRef = useRef();

  useEffect(() => {
    setIsLoading(true)
    let songUserId = propCurrentSong.song_user._id
    let songId = propCurrentSong._id

    async function getUserSongs(songUserId, songId) {
      await actions
        .getUserSongs({ song_user: songUserId })
        .then(res => {
          setAllSongs(res.data)
          setAllSongs(prevArr => prevArr.map((each, index) => {
            if (each._id === songId) {
              setThisSong({...each, songVideo: gifsCopy[index].url, songIndex: index + 1})
            }
            return {
              ...each,
              songVideo: gifsCopy[index].url,
              songIndex: index + 1
            }
          }))
          setIsLoading(false)
        })
        .catch(console.error)
    }
    getUserSongs(songUserId, songId)
  }, [])

  useEffect(() => {
    if (thisSong) {
      const songId = thisSong?._id
      handleInViewLikes(songId)
      handleInViewFollowers(songId)
    }
  }, [thisSong])

  const onClose = () => {
    if (propReturnLink === '/search') {
      navigate('/search',  { state: { propSearchValue: propSearchValue } })
    } else {
      navigate(`/profile/${propCurrentSong?.song_user._id}`, { state: { propSongUser: propCurrentSong?.song_user } })
    }
  }

  const popUpComments = () => {
    if (poppedUp === false) {
      setPoppedUp(true)
      commentInputRef.current.focus()
    } else {
      setPoppedUp(false)
    }
  }

  const findCurrentSong = direction => {
    allSongs.filter((each, index) => {
      if (each._id === thisSong?._id) {
        if (direction === 'back') {
          if (index === 0) {
            return null
          } else {
            setThisSong(allSongs[index - 1])
          }
        } else {
          if (index === allSongs.length - 1) {
            return null
          } else {
            setThisSong(allSongs[index + 1])
          }
        }
      }
    })
  }

  return (
    <div
      id="SongScreen"
      className="SongScreen"
      style={{
        backgroundImage: `url('${gradientbg}'), url(${thisSong?.songVideo})`,
      }}
    >
      <Loading addClass={'LoadingSongScreen'} />
      <div className="close-window-frame">
        <div className="song-listing-container">
          <div className="song-listing-outer">
            <div className="song-listing-inner">
              <div className="listing-photo-container">
                <div className="listing-photo-outer">
                  <div className="listing-photo-inner">
                    <img src={thisSong?.song_user?.picture} alt="song user" />
                  </div>
                </div>
              </div>
              <div className="listing-track-container">
                <div className="track-title-container">
                  <div className="track-title-outer">
                    <p className="track-name">{thisSong?.name}</p>
                    <p className="track-index"><span style={{color: '#ffa6cb', fontSize: '.8rem'}}>{thisSong?.songIndex}</span> of {allSongs.length}</p>
                  </div>
                </div>
                <div className="track-details-container">
                  <p>
                    {thisSong?.caption
                      ? thisSong?.caption
                      : "No caption for this song"
                    }
                  </p>
                  <p>
                    by: <span style={{ color: '#b7a2a6' }}>{thisSong?.song_user?.userName}</span>
                  </p>
                  <p>on: {formatDate(thisSong?.date, "MMMM Dth YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="close-window-container">
          <div className="close-window-outer" onClick={onClose}>
            <div className="close-window-inner">
              <img src={close} alt="close window" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className="song-video-frame"
        ref={windowRef}
        style={isLoading === true ? {opacity: "0"} : {opacity: "1"}}
      >
        <div className="song-lyric-container">
          {thisSong?.lyrics?.map((each, index) => {
            return (
              <div className="each-lyric-container" key={`${each}_${index}`}>
                <p className="each-lyric-no">{index + 1}</p>
                <p className="each-lyric-line">{each}</p>
              </div>
            )
          })}
        </div>
      </div>

      <Comments
        commentInputRef={commentInputRef}
        poppedUp={poppedUp}
        songInView={thisSong}
        commentsArray={commentsArray}
        setCommentsArray={setCommentsArray}
        totalComments={totalComments}
        setTotalComments={setTotalComments}
        whichMenu="SongScreen"
      />

      <div className="song-details-container">
        <div className="song-details">
          <div className="song-play-container">
            <div className="song-play-outer">
              <div className="play-buttons-container">
                <div className="play-buttons-left">
                  <div className="play-arrow-container" onClick={() => findCurrentSong('back')}>
                    <img src={backward} alt="go back" />
                  </div>
                </div>

                <div className="play-buttons-middle">
                  <div className="play-outer">
                    {isPlaying
                      ? (
                        <div className="play-inner" onClick={() => setIsPlaying(false)}>
                          <div className="play-img-container">
                            <img src={pause} ref={playPauseRef} style={{marginLeft: '0%'}} alt="pause icon" />
                          </div>
                        </div>
                      )
                      : (
                        <div className="play-inner" onClick={() => setIsPlaying(true)}>
                          <div className="play-img-container">
                            <img src={play} ref={playPauseRef} alt="play icon" />
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="play-buttons-right">
                  <div className="play-arrow-container" onClick={() => findCurrentSong('next')}>
                    <img src={forward} alt="go forward" />
                  </div>
                </div>
              </div>

              <div className="play-slider-container">
                <AudioTimeSlider
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentSong={thisSong}
                  location={songScreen}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="social-buttons">
          <div className="social-list">
            <div className="social-button-container">
              <div 
                className={`social-button ${followers.IS_FOLLOWED ? "pushed" : ""}`} 
                ref={followBtn}
                onClick={() => { 
                  handlePostFollow(
                    thisSong?.song_user?._id, 
                    followers?.IS_FOLLOWED, 
                    followers?.USERS_FOLLOW_TO_DELETE
                  ) 
                }}
              > 
                <img className="social-icons follow" src={follow} alt="follow user icon"></img>
              </div>
              <div className="button-title">
                <p style={{ color: '#ff3b8c' }}>{followers?.TOTAL_FOLLOWERS}</p>
                <p>
                  {(followers?.TOTAL_FOLLOWERS === 1)
                    ? "Follower"
                    : "Followers"
                  }
                </p>
              </div>
            </div>

            <div className="social-button-container">
              <div 
                className={`social-button ${likes.IS_LIKED ? "pushed" : ""}`} 
                onClick={(e) => { 
                  e.target.style.transition = "all .2s ease-in"
                  handlePostLike(
                    likes,
                    null,
                    thisSong._id, 
                    thisSong.song_user._id,
                  ) 
                }}
              >
                <img className="social-icons heart" src={heart2} alt="like post icon"></img>
              </div>
              <div className="button-title">
                <p style={{color: '#ff3b8c'}}>{likes?.TOTAL_LIKES}</p>
                <p>
                  {(likes?.TOTAL_LIKES === 1)
                    ? "Like"
                    : "Likes"
                  }
                </p>
              </div>
            </div>

            <div className="social-button-container">
              <div className={`social-button ${poppedUp ? "pushed" : ""}`} onClick={popUpComments}>
                <img
                  className="social-icons comment"
                  src={comments}
                  alt="comment on post icon"
                ></img>
              </div>
              <div className="button-title">
                <p style={{color: '#ff3b8c'}}>{totalComments}</p>
                <p>
                  {(totalComments === 1)
                    ? "Comment"
                    : "Comments"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SongScreen
