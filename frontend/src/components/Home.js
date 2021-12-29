import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TheContext from "../TheContext";
import TheViewContext from "../TheViewContext";
import usePostLike from "./utils/usePostLike";
import usePostFollow from "./utils/usePostFollow";
import useDebugInformation from "./utils/useDebugInformation"
import FormatDate from "./FormatDate"
import actions from "../api";
import HomeFeed from "./songFeedComponents/HomeFeed";
import TrendingFeed from "./songFeedComponents/TrendingFeed";
import FollowingFeed from "./songFeedComponents/FollowingFeed";
import AudioTimeSlider from "./AudioTimeSlider.js";
import Comments from "./Comments.js";
import NavBar from "./NavBar.js";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import bullet from "../images/bullet-point.svg";
import like from "../images/heart2.svg";

function Home(props) {
  useDebugInformation("Home", props)
  const { user } = React.useContext(TheContext);

  const { 
    handlePostLike, 
    returnLikeSongId, 
    setReturnLikeSongId, 
    totalLikes, 
    setTotalLikes,
  } = usePostLike();
  const { 
    handlePostFollow, 
    returnFollowSongId, 
    setReturnFollowSongId, 
    totalFollowers, 
    setTotalFollowers,
    updateFollowFeed
  } = usePostFollow();
  
  const [songInView, setSongInView] = useState({});
  const [totalFollowsLikesArr, setTotalFollowsLikesArr] = useState([]);
  const [commentsArr, setCommentsArr] = useState([])
  const [totalComments, setTotalComments] = useState();

  const [isHomeFeed, setIsHomeFeed] = useState(true);
  const [isTrendingFeed, setIsTrendingFeed] = useState(false);
  const [isFollowingFeed, setIsFollowingFeed] = useState(false);
  const [isLiked, setIsLiked] = useState()
  const [isFollowed, setIsFollowed] = useState()
  const [isPlaying, setIsPlaying] = useState(false);
  const [poppedUp, setPoppedUp] = useState(false);
  const [home] = useState(`#6d6d6d`);
  
  const commentInputRef = useRef();
  const playPauseRef = useRef();

  const showFeedInDisplay = useCallback(() => {
    if (isHomeFeed) return <HomeFeed />
    else if (isTrendingFeed) return <TrendingFeed />
    else if (isFollowingFeed) return <FollowingFeed updateFollowFeed={updateFollowFeed} />
  }, [isHomeFeed, isTrendingFeed, isFollowingFeed])

  useEffect(() => {
    let newArr = totalFollowsLikesArr.map((each) => {
      if (each.songId === songInView._id) {
        if (songInView._id === returnLikeSongId || songInView._id === returnFollowSongId) {
          if (each.totalFollowers.length !== totalFollowers.length) {
            let newFollowTotal = totalFollowers
            setIsFollowed(checkIfFollowed(newFollowTotal))
            setTotalFollowers(newFollowTotal)
            return { ...each, totalFollowers: newFollowTotal }
          } else if (each.totalLikes.length !== totalLikes.length) {
            let newLikesTotal  = totalLikes
            setIsLiked(checkIfLiked(newLikesTotal))
            setTotalLikes(newLikesTotal)
            return { ...each, totalLikes: newLikesTotal }
          } else {
            return each
          }
        } else {
          setIsLiked(checkIfLiked(each.totalLikes))
          setIsFollowed(checkIfFollowed(each.totalFollowers))
          setReturnFollowSongId(null)
          setReturnLikeSongId(null)
          setTotalLikes(each.totalLikes)
          setTotalFollowers(each.totalFollowers)
          return each
        }
      } else {
        return each
      }
    })
    setTotalFollowsLikesArr(newArr)
  }, [songInView, returnFollowSongId, returnLikeSongId, totalFollowers, totalLikes])

  const checkIfLiked = (arr) => {
    let liked = false
    arr.forEach(each => {
      if (each.likeUser === user._id) return liked = true
    })
    return liked
  }

  const checkIfFollowed = (arr) => {
    let followed = false
    arr.forEach(each => {
      if (each.follower === user._id) return followed = true
    })
    return followed
  }

  const handlePlayPause = (bool) => {
    if (bool === true) return setIsPlaying(true)
    else return setIsPlaying(false)
  }

  const popUpComments = () => {
    if (poppedUp === false) {
      setPoppedUp(true)
      commentInputRef.current.focus()
    } else {
      setPoppedUp(false)
    }
  }

  return (
    <TheViewContext.Provider
      value={{
        songInView,
        setSongInView,
        commentsArr,
        setCommentsArr,
        totalFollowsLikesArr, 
        setTotalFollowsLikesArr,
        isFollowingFeed,
      }}
    >
      <div className="Home">
        <div className="section-1_feed">
          <div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div className="each-feed_shadow-div-inset">
                <button
                  className={isHomeFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setIsHomeFeed(true)
                    setIsTrendingFeed(false)
                    setIsFollowingFeed(false)
                  }}
                >
                  <div className={isHomeFeed ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Feed
                  </div>
                </button>
              </div>
              
              <div className="each-feed_shadow-div-inset" style={{ borderRadius: '50px' }}>
                <button
                  className={isTrendingFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setIsTrendingFeed(true)
                    setIsHomeFeed(false)
                    setIsFollowingFeed(false)
                  }}
                >
                  <div className={isTrendingFeed ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Trending
                  </div>
                </button>
              </div>

              <div
                className="each-feed_shadow-div-inset"
                style={{ borderRadius: '50px 5px 5px 50px' }}
              >
                <button
                  className={isFollowingFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setIsFollowingFeed(true)
                    setIsTrendingFeed(false)
                    setIsHomeFeed(false)
                  }}
                >
                  <div className={isFollowingFeed ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Following
                  </div>
                </button>
              </div>
            </div>
          </div>

          {showFeedInDisplay()}

          <Comments
            commentInputRef={commentInputRef}
            songInView={songInView}
            commentsArray={commentsArr}
            setCommentsArray={setCommentsArr}
            totalComments={totalComments}
            setTotalComments={setTotalComments}
            poppedUp={poppedUp}
            whichMenu="Home"
          />

          <div className="section-1c_song-details">
            <div className="song-details-1_actions">
              <div className="actions_shadow-div-outset">
                <div className="actions_shadow-div-inset">
                  <div className="action-btns-container">
                    <button
                      className={`action-btn_shadow-div-outset ${isFollowed ? "liked-followed-commented" : ""}`}
                      onClick={() => { handlePostFollow(songInView?.songUser._id, songInView._id) }}
                      style={{ borderRadius: '50px 5px 5px 50px' }}
                    >
                      <div
                        className="action-btn-icon_shadow-div-inset"
                        style={{ borderRadius: '40px 4px 4px 40px' }}
                      >
                        <img
                          className="social-icons si-follow"
                          src={follow}
                          alt="follow user icon"
                        />
                      </div>
                      <div className="action-btn-container">
                        <div className="action-btn-text">
                          <p style={{ color: 'white' }}>{totalFollowers?.length}</p>
                          <p>
                            {(totalFollowers?.length === 1)
                              ? "Follow"
                              : "Follows"
                            }
                          </p>
                        </div>
                      </div>
                    </button>

                    <button 
                      className={`action-btn_shadow-div-outset ${isLiked ? "liked-followed-commented" : ""}`} 
                      onClick={() => { handlePostLike("Song", songInView._id, totalFollowsLikesArr) }}
                    >
                      <div className="action-btn-icon_shadow-div-inset">
                        <img className="social-icons si-like" src={like} alt="like post icon" />
                      </div>
                      <div className="action-btn-container">
                        <div className="action-btn-text">
                          <p style={{ color: 'white' }}>{totalLikes?.length}</p>
                          <p>
                            {(totalLikes?.length === 1) 
                              ? "Like"
                              : "Likes"
                            }
                          </p>
                        </div>
                      </div>
                    </button>

                    <button className="action-btn_shadow-div-outset" onClick={popUpComments}>
                      <div className="action-btn-icon_shadow-div-inset">
                        <img
                          className="social-icons si-comment"
                          src={comments}
                          alt="comment on post icon"
                        />
                      </div>
                      <div className="action-btn-container">
                        <div className="action-btn-text">
                          <p style={{ color: 'white' }}>{totalComments}</p>
                          <p>
                            {(totalComments === 1) 
                              ? "Comment"
                              : "Comments"
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="song-details-2_song-data">
              <div className="song-data-container">
                <div className="song-user-section">
                  <div className="song-user-container">
                    <div className="user-pic-container">
                      <div className="user-pic_shadow-div-outset">
                        <Link
                          to={`/profile/${songInView.songUser?._id}`}
                          className="user-pic_shadow-div-inset"
                        >
                          <img
                            src={songInView.songUser?.picture}
                            alt=""
                            ref={props.profilePicRef}
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="song-title-container">
                      <div className="song-title_shadow-div-outset">
                        <div className="song-title_shadow-div-inset">
                          <p id="one">
                            {songInView?.songName}
                          </p>
                          <p id="two">
                            <img src={bullet} alt="bullet point" />
                            {songInView.songUser?.userName}
                          </p>
                        </div>

                        <div className="song-caption-container">
                          <div className="song-date">
                            <FormatDate date={songInView?.songDate} />{' '}
                            <img src={bullet} alt="bullet point" />
                          </div>
                          <p className="song-caption">
                            {songInView?.songCaption
                              ? songInView?.songCaption
                              : 'no caption for this song'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="song-play-section">
                  <div className="play-song-container">
                    <div className="play-btn-container">
                      <div className="play-btn-container-2">
                        <div className="play-btn_shadow-div-inset">
                          {isPlaying ? 
                            (
                              <button 
                                className="play-btn_shadow-div-outset" 
                                onClick={() => handlePlayPause(false)}
                              >
                                <img
                                  className="button-icons bi-pause"
                                  src={pause}
                                  ref={playPauseRef}
                                  alt="pause"
                                />
                              </button>
                            ) : (
                              <button 
                                className="play-btn_shadow-div-outset" 
                                onClick={() => handlePlayPause(true)}
                              >
                                <img
                                  className="button-icons bi-play"
                                  src={play}
                                  ref={playPauseRef}
                                  alt="play"
                                />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="play-bar-container">
                    <div className="play-bar_shadow-div-inset">
                      <AudioTimeSlider
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentSong={songInView}
                        location={home}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavBar locationClass={'NavBarHome'}/>
      </div>
    </TheViewContext.Provider>
  )
}

export default Home
