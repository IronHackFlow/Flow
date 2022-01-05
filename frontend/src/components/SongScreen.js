import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import actions from '../api'
import TheContext from '../TheContext'
import AudioTimeSlider from "./AudioTimeSlider"
import Comments from "./Comments"
import usePostLike from "./utils/usePostLike";
import usePostFollow from "./utils/usePostFollow";

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
  const { user } = React.useContext(TheContext)
  const { handlePostLike, likes, setLikes } = usePostLike();
  const { handlePostFollow, followers, setFollowers } = usePostFollow();

  const navigate = useNavigate();
  const location = useLocation()
  const { state, searchValue, link } = location.state

  const gifsCopy = [...gifsArr];
  const [thisSong, setThisSong] = useState({});
  const [allSongs, setAllSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poppedUp, setPoppedUp] = useState(false);
  const [commentsArray, setCommentsArray] = useState([])
  const [totalComments, setTotalComments] = useState(thisSong?.songComments?.length);
  const [songScreen] = useState(`#353535`);

  const windowRef = useRef();
  const commentInputRef = useRef();
  const followBtn = useRef();
  const playPauseRef = useRef();

  useEffect(() => {
    setFollowers(prevFollowers => ({
      ...prevFollowers,
      'TOTAL_FOLLOWERS': thisSong?.songUser?.followers?.length
    }))
  }, [thisSong])

  useEffect(() => {
    setLikes(prevLikes => ({
      ...prevLikes,
      'TOTAL_LIKES': thisSong?.songLikes?.length
    }))
  }, [thisSong])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    actions
      .getUserSongs({ songUser: state?.songUser })
      .then(res => {
        setAllSongs(res.data)
        setAllSongs(prevArr => prevArr.map((each, index) => ({
          ...each,
          songVideo: gifsCopy[index].url,
          songIndex: index + 1
        })))
        let commentArr = res.data.map((each) => {
          return { songId: each._id, comments: each.songComments }
        })
        setCommentsArray(commentArr)
      }, signal)
      .catch(console.error)
      
    return () => controller.abort()
  }, [props.location])

  useEffect(() => {
    let song = allSongs.filter(each => each._id === state?._id)
    setThisSong(song[0])
  }, [allSongs])

  const handlePlayPause = (bool) => {
    if (bool === true) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const closeSongWindow = () => {
    if (link === '/search') {
      navigate('/search',  { state: searchValue })
    } else {
      navigate(`/profile/${thisSong.songUser?._id}`, { state: thisSong?.songUser })
    }
    // navigate(-1)
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
    allSongs.forEach((each, index) => {
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
      className="SongScreen"
      style={{
        backgroundImage: `url('${gradientbg}'), url(${thisSong?.songVideo})`,
      }}
    >
      <div className="close-window-frame">
        <div className="song-listing-container">
          <div className="song-listing-outer">
            <div className="song-listing-inner">
              <div className="listing-photo-container">
                <div className="listing-photo-outer">
                  <div className="listing-photo-inner">
                    <img src={thisSong?.songUser?.picture} alt="song user" />
                  </div>
                </div>
              </div>
              <div className="listing-track-container">
                <div className="track-title-container">
                  <div className="track-title-outer">
                    <p className="track-name">{thisSong?.songName}</p>
                    <p className="track-index"><span style={{color: '#ffa6cb'}}>{thisSong?.songIndex}</span> of {allSongs.length}</p>
                  </div>
                </div>
                <div className="track-details-container">
                  <p>
                    {thisSong?.songCaption
                      ? thisSong?.songCaption
                      : "No caption for this song"
                    }
                  </p>
                  <p>
                    by: <span style={{ color: '#b7a2a6' }}>{thisSong?.songUser?.userName}</span>
                  </p>
                  <p>on: {moment(thisSong?.songDate).format('LL')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="close-window-container">
          <div className="close-window-outer" onClick={closeSongWindow}>
            <div className="close-window-inner">
              <img src={close} alt="close window" />
            </div>
          </div>
        </div>
      </div>

      <div className="song-video-frame" ref={windowRef}> 
        <div className="song-lyric-container">
          {thisSong?.songLyricsStr?.map((each, index) => {
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
                        <div className="play-inner" onClick={() => handlePlayPause(false)}>
                          <div className="play-img-container">
                            <img src={pause} ref={playPauseRef} style={{marginLeft: '0%'}} alt="pause icon" />
                          </div>
                        </div>
                      )
                      : (
                        <div className="play-inner" onClick={() => handlePlayPause(true)}>
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
                className="social-button" 
                ref={followBtn}
                onClick={() => { 
                  handlePostFollow(
                    thisSong._id, 
                    thisSong.songUser._id, 
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
                className="social-button" 
                onClick={() => { 
                  handlePostLike(
                    thisSong._id, 
                    thisSong.songUser._id,
                    likes?.IS_LIKED,
                    likes?.USERS_LIKE_TO_DELETE
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
              <div className={poppedUp ? "social-button pushed" : "social-button"} onClick={popUpComments}>
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
