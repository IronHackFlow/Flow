import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import actions from '../api'
import TheContext from '../TheContext'
import AudioTimeSlider from "./AudioTimeSlider"
import Comments from "./Comments"
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

  const history = useHistory();
  const gifsCopy = [...gifsArr];
  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();
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
;
  useEffect(() => {
    setTotalFollowers(thisSong?.songUser?.followers?.length)
  }, [thisSong])

  useEffect(() => {
    setTotalLikes(thisSong?.songLikes?.length)
  }, [thisSong])

  useEffect(() => {
    console.log(props.location.songInfo?.songUser, "i don't know")
    actions
      .getUserSongs({ songUser: props.location.songInfo?.songUser })
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
      })
      .catch(console.error)
  }, [props.location])

  useEffect(() => {
    console.log(props.location, history.location, "WHAHASFHSLDKFJ")
    let song = allSongs.filter(each => each._id === props.location.songInfo._id)
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
    if (props.location.link === '/search') {
      history.push({
        pathname: '/search',
        searchValue: history.location.searchValue
      })
    } else {
      history.push({
        pathname: `/profile/${thisSong.songUser?._id}`,
        profileInfo: thisSong.songUser,
      })
    }
  }

  const getRandomBackground = () => {
    let index = Math.floor(Math.random() * gifsCopy.length)
    return gifsCopy[index].url
  }

  const popUpComments = () => {
    if (poppedUp === false) {
      setPoppedUp(true)
      commentInputRef.current.focus()
    } else {
      setPoppedUp(false)
    }
  }

  const followCheck = () => {
    if (user._id === thisSong.songUser._id) {
      console.log(`You can't follow yourself lol`)
      return null
    }
    actions
      .getAUser({ id: user._id })
      .then(res => {
        let deleteObj = null

        res.data.userFollows.forEach(each => {
          if (each.followed === thisSong.songUser._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          followUser()
        } else {
          deleteFollow(deleteObj)
        }
      })
      .catch(console.error)
  }

  const likeCheck = () => {
    actions
      .getSong({ id: thisSong._id })
      .then(res => {
        let deleteObj = null

        res.data.songLikes.forEach(each => {
          if (each.likeUser === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          likePost()
        } else {
          deleteLike(deleteObj)
        }
      })
      .catch(console.error)
  }

  const followUser = () => {
    actions
      .addFollow({
        followedUser: thisSong.songUser._id,
        followDate: new Date(),
      })
      .then(res => {
        console.log(`added a follow to: `, res.data)
        setTotalFollowers(res.data.followedData._doc.followers.length)
      })
      .catch(console.error)
  }

  const deleteFollow = deleteObj => {
    actions
      .deleteFollow({
        followedUser: thisSong.songUser._id,
        deleteObj: deleteObj,
      })
      .then(res => {
        console.log(`deleted a follow from: `, res.data)
        setTotalFollowers(res.data.followedData._doc.followers.length)
      })
      .catch(console.error)
  }

  const likePost = () => {
    actions
      .addLike({
        likerSong: thisSong._id,
        likeDate: new Date(),
        commLike: false,
      })
      .then(res => {
        console.log(`added a like to: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error)
  }

  const deleteLike = deleteObj => {
    actions
      .deleteLike({
        likerSong: thisSong._id,
        deleteObj: deleteObj,
        commLike: false,
      })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error)
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
              <div className="social-button" onClick={followCheck} ref={followBtn}>
                <img className="social-icons follow" src={follow} alt="follow user icon"></img>
              </div>
              <div className="button-title">
                <p style={{ color: '#ff3b8c' }}>{totalFollowers}</p>
                <p>
                  {(totalFollowers === 1)
                    ? "Follower"
                    : "Followers"
                  }
                </p>
              </div>
            </div>

            <div className="social-button-container">
              <div className="social-button" onClick={likeCheck}>
                <img className="social-icons heart" src={heart2} alt="like post icon"></img>
              </div>
              <div className="button-title">
                <p style={{color: '#ff3b8c'}}>{totalLikes}</p>
                <p>
                  {(totalLikes === 1)
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
