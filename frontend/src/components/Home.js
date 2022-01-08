import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import actions from "../api";
import TheContext from "../TheContext";
import TheViewContext from "../TheViewContext";
import { songData } from "./songFeedComponents/SongData"
import usePostLike from "./utils/usePostLike";
import usePostFollow from "./utils/usePostFollow";
import usePostComment from "./utils/usePostComment";
import useEventListener from "./utils/useEventListener";
import useDebugInformation from "./utils/useDebugInformation"
import FormatDate from "./FormatDate"
import HomeFeed from "./songFeedComponents/HomeFeed";
import TrendingFeed from "./songFeedComponents/TrendingFeed";
import FollowingFeed from "./songFeedComponents/FollowingFeed";
import AudioTimeSlider from "./AudioTimeSlider.js";
import Comments from "./Comments.js";
import NavBar from "./NavBar.js";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import follow from "../images/follow.svg";
import commentsvg from "../images/comment.svg";
import bullet from "../images/bullet-point.svg";
import like from "../images/heart2.svg";

function Home(props) {
  const { user, windowSize } = useContext(TheContext);
  const { homeFeedArrTest, isLoading, setIsLoading } = useContext(songData)
  
  useDebugInformation("Home", props)
  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('Home').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('Home').style.height = `${onChange}px`
    }
  })

  const { handlePostLikeSong, handleInViewLikes, likes } = usePostLike();
  const { handlePostFollow, handleInViewFollowers, followers } = usePostFollow();

  const [songInView, setSongInView] = useState(homeFeedArrTest[0]?.song);
  const [totalComments, setTotalComments] = useState();
  const [isHomeFeed, setIsHomeFeed] = useState(true);
  const [isTrendingFeed, setIsTrendingFeed] = useState(false);
  const [isFollowingFeed, setIsFollowingFeed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poppedUp, setPoppedUp] = useState(false);
  const [home] = useState(`#6d6d6d`);

  const commentInputRef = useRef();
  const playPauseRef = useRef();

  useEffect(() => {
    if (songInView) {
      const songId = songInView?._id
      handleInViewLikes(songId)
      handleInViewFollowers(songId)
    }
  }, [songInView, isHomeFeed, isTrendingFeed, isFollowingFeed])
  
  const showFeedInDisplay = useCallback(() => {
    if (isHomeFeed) return <HomeFeed />
    else if (isTrendingFeed) return <TrendingFeed />
    else if (isFollowingFeed) return <FollowingFeed />
  }, [isHomeFeed, isTrendingFeed, isFollowingFeed])

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
        totalComments,
        setTotalComments,
        isFollowingFeed,
        isLoading, 
        setIsLoading, isHomeFeed,
      }}
    >
      <div className="Home" id="Home">
        <div className="section-1_feed">
          <div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div 
                className="each-feed_shadow-div-inset"
                style={{borderRadius: "3px 3px 3px 19px"}}
              >
                <button
                  className={isHomeFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  style={{borderRadius: "30px 5px 5px 30px"}}
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
              
              <div className="each-feed_shadow-div-inset">
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
                style={{ borderRadius: '3px 3px 19px 3px' }}
              >
                <button
                  className={isFollowingFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  style={{borderRadius: "8px 45px 45px 8px"}}
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
                      className={`action-btn_shadow-div-outset ${followers?.IS_FOLLOWED ? "liked-followed-commented" : ""}`}
                      style={{ borderRadius: '50px 5px 5px 50px' }}
                      onClick={() => { 
                        handlePostFollow(
                          songInView._id, 
                          songInView.songUser._id, 
                          followers?.IS_FOLLOWED, 
                          followers?.USERS_FOLLOW_TO_DELETE
                        ) 
                      }}
                    >
                      <div
                        className="action-btn-icon_shadow-div-inset"
                        style={{ borderRadius: '40px 4px 4px 40px' }}
                      >
                        <img
                          className="social-icons follow"
                          src={follow}
                          alt="follow user icon"
                        />
                      </div>
                      <div className="action-btn-container">
                        <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                        </div>
                        <div className="action-btn-text">
                          <p style={{ color: 'white' }}>{followers?.TOTAL_FOLLOWERS}</p>
                          <p>
                            {(followers?.TOTAL_FOLLOWERS === 1)
                              ? "Follow"
                              : "Follows"
                            }
                          </p>
                        </div>
                      </div>
                    </button>

                    <button 
                      className={`action-btn_shadow-div-outset 
                        ${likes?.IS_LIKED ? "liked-followed-commented" : ""}
                      `} 
                      onClick={() => { 
                        handlePostLikeSong(
                          songInView?._id, 
                          songInView?.songUser?._id, 
                          likes?.IS_LIKED, 
                          likes?.USERS_LIKE_TO_DELETE
                        ) 
                      }}
                    >
                      <div className="action-btn-icon_shadow-div-inset">
                        <img className="social-icons like" src={like} alt="like post icon" />
                      </div>
                      <div className="action-btn-container">
                        <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                        </div>
                        <div className="action-btn-text">
                          <p style={{ color: 'white' }}>{likes?.TOTAL_LIKES}</p>
                          <p>
                            {(likes?.TOTAL_LIKES === 1) 
                              ? "Like"
                              : "Likes"
                            }
                          </p>
                        </div>
                      </div>
                    </button>
 {/* {console.log( "HEHEHEHEHHEHEHEHEHEHEHEHEHEHE")} */}
                    <button className={`action-btn_shadow-div-outset ${poppedUp ? "comment-pressed" : ""}`} onClick={popUpComments}>
                      <div className="action-btn-icon_shadow-div-inset">
                        <img
                          className="social-icons comment"
                          src={commentsvg}
                          alt="comment on post icon"
                        />
                      </div>
                      <div className="action-btn-container">
                        <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                        </div>
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
                          to={`/profile/${songInView?.songUser?._id}`}
                          state={{ propSongUser: songInView?.songUser }}
                          className="user-pic_shadow-div-inset"
                        >
                          <div className="loading loading-pic" style={isLoading ? {opacity: "1"} : {opacity: "0"}}></div>
                          <img
                            src={songInView?.songUser?.picture}
                            alt=""
                            ref={props.profilePicRef}
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="song-title-container">
                      <div className="song-title_shadow-div-outset">
                        <div className="song-title_shadow-div-inset">
                          <div className="loading loading-title" style={isLoading ? {opacity: "1"} : {opacity: "0"}}></div>
                          <p id="one">
                            {songInView?.songName}
                          </p>
                          <p id="two">
                            <img src={bullet} alt="bullet point" />
                            {songInView?.songUser?.userName}
                          </p>
                        </div>

                        <div className="song-caption-container">
                          <div className="song-date" style={isLoading ? {opacity: "0"} : {opacity: "1"}}>
                            <FormatDate date={songInView?.songDate} />{' '}
                            <img src={bullet} alt="bullet point" />
                          </div>
                          <p className="song-caption" style={isLoading ? {opacity: "0"} : {opacity: "1"}}>
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
