import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import TheContext from "../contexts/TheContext";
import TheViewContext from "../contexts/TheViewContext";
import { songData } from "../contexts/SongData"
import usePostLike from "../utils/usePostLike";
import usePostFollow from "../utils/usePostFollow";
import useEventListener from "../utils/useEventListener";
import useDebugInformation from "../utils/useDebugInformation";
import useFormatDate from "../utils/useFormatDate";
import Feed from "../components/Feed"
import AudioTimeSlider from "../components/AudioTimeSlider.js";
import Comments from "../components/Comments.js";
import NavBar from "../components/NavBar.js";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import follow from "../images/follow.svg";
import commentsvg from "../images/comment.svg";
import bullet from "../images/bullet-point.svg";
import like from "../images/like-thumb-up.svg";

function Home(props) {
  const { user, windowSize } = useContext(TheContext);
  const { homeFeedSongs, trendingFeedSongs, followingFeedSongs, isLoading, setIsLoading } = useContext(songData)

  useDebugInformation("Home", props)
  // useEventListener('resize', e => {
  //   var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  //   if (onChange < 600) {
  //     document.getElementById('body').style.height = `${windowSize}px`
  //     document.getElementById('Home').style.height = `${windowSize}px`
  //   } else {
  //     setTimeout(() => {
  //       document.getElementById('body').style.height = `${onChange}px`
  //       document.getElementById('Home').style.height = `${onChange}px`
  //     }, 1000)
  //   }
  // })

  const { handlePostLike, handleInViewLikes, likes } = usePostLike();
  const { handlePostFollow, handleInViewFollowers, followers } = usePostFollow();
  const { formatDate } = useFormatDate()

  const initialInView = {
    homeFeed: null,
    trendingFeed: null,
    followingFeed: null
  }

  const [trackInView, setTrackInView] = useState(initialInView)
  const [songInView, setSongInView] = useState(homeFeedSongs[0]?.song);
  const [totalComments, setTotalComments] = useState();
  const [isHomeFeed, setIsHomeFeed] = useState(true);
  const [isTrendingFeed, setIsTrendingFeed] = useState(false);
  const [isFollowingFeed, setIsFollowingFeed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poppedUp, setPoppedUp] = useState(false);
  const commentInputRef = useRef();
  const playPauseRef = useRef();

  useEffect(() => {
    if (songInView) {
      const songId = songInView?._id
      handleInViewLikes(songId)
      handleInViewFollowers(songId)
    }
  }, [songInView, isHomeFeed, isTrendingFeed, isFollowingFeed])
  
  const [feedTracker, setFeedTracker] = useState('home')

  useEffect(() => {
    if (isHomeFeed) {
      setFeedTracker('home')
    } else if (isTrendingFeed) {
      setFeedTracker('trending')
    } else {
      setFeedTracker('following')
    }
  }, [isHomeFeed, isTrendingFeed, isFollowingFeed])

  const showFeedInDisplay = useCallback(() => {
    let homeFeed = <Feed feedSongs={homeFeedSongs} setSongInView={setSongInView} trackInView={trackInView?.homeFeed} isHomeFeed={isHomeFeed} isTrendingFeed={isTrendingFeed} isFollowingFeed={isFollowingFeed} />
    let trendFeed = <Feed feedSongs={trendingFeedSongs} setSongInView={setSongInView} trackInView={trackInView?.trendingFeed} isHomeFeed={isHomeFeed} isTrendingFeed={isTrendingFeed} isFollowingFeed={isFollowingFeed} />
    let followFeed = <Feed feedSongs={followingFeedSongs} setSongInView={setSongInView} trackInView={trackInView?.followingFeed} isHomeFeed={isHomeFeed} isTrendingFeed={isTrendingFeed} isFollowingFeed={isFollowingFeed} />

    if (isHomeFeed) {
      return homeFeed
    }
    else if (isTrendingFeed) {
      return trendFeed
    }
    else if (isFollowingFeed) {
      return followFeed
    }
  }, [homeFeedSongs, trendingFeedSongs, isHomeFeed, isTrendingFeed, isFollowingFeed])

  const popUpComments = () => {
    if (poppedUp === false) {
      setPoppedUp(true)
      commentInputRef.current.focus()
    } else {
      setPoppedUp(false)
    }
  }

  const setHomeFeed = () => {
    if (feedTracker === "trending") {
      setTrackInView(prev => ({
        ...prev,
        trendingFeed: songInView
      }))
    } else {
      setTrackInView(prev => ({
        ...prev,
        followingFeed: songInView
      }))
    }
    setIsHomeFeed(true)
    setIsTrendingFeed(false)
    setIsFollowingFeed(false)
  }

  const setTrendingFeed = () => {
    if (feedTracker === "home") {
      setTrackInView(prev => ({
        ...prev,
        homeFeed: songInView
      }))
    } else {
      setTrackInView(prev => ({
        ...prev,
        followingFeed: songInView
      }))
    }

    setIsTrendingFeed(true)
    setIsHomeFeed(false)
    setIsFollowingFeed(false)
  }

  const setFollowingFeed = () => {
    if (feedTracker === "trending") {
      setTrackInView(prev => ({
        ...prev,
        trendingFeed: songInView
      }))
    } else {
      setTrackInView(prev => ({
        ...prev,
        homeFeed: songInView
      }))
    }

    setIsFollowingFeed(true)
    setIsHomeFeed(false)
    setIsTrendingFeed(false)

  }

  return (
    <TheViewContext.Provider
      value={{
        songInView,
        setSongInView,
        totalComments,
        setTotalComments,
        isFollowingFeed,
        isHomeFeed,
      }}
    >
      <div className="Home" id="Home">
        <div className="section-1_feed">
          <div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div 
                className="each-feed_shadow-div-inset"
                style={{borderRadius: "0.3vh 0.3vh 0.3vh 2.5vh"}}
              >
                <button
                  className={isHomeFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  style={{borderRadius: "4vh .2vh .2vh 4vh"}}
                  onClick={() => setHomeFeed()}
                >
                  <div className={isHomeFeed ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Feed
                  </div>
                </button>
              </div>
              
              <div className="each-feed_shadow-div-inset">
                <button
                  className={isTrendingFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => setTrendingFeed()}
                >
                  <div className={isTrendingFeed ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Trending
                  </div>
                </button>
              </div>

              <div
                className="each-feed_shadow-div-inset"
                style={{ borderRadius: '.3vh .3vh 2.5vh .3vh' }}
              >
                <button
                  className={isFollowingFeed ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  style={{borderRadius: ".2vh 4vh 4vh .2vh"}}
                  onClick={() => setFollowingFeed()}
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
                          songInView.song_user._id, 
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
                        handlePostLike(
                          likes,
                          null,
                          songInView?._id, 
                          songInView?.song_user?._id, 
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
                          to={`/profile/${songInView?.song_user?._id}`}
                          state={{ propSongUser: songInView?.song_user }}
                          className="user-pic_shadow-div-inset"
                        >
                          <div className="loading loading-pic" style={isLoading ? {opacity: "1"} : {opacity: "0"}}></div>
                          <img
                            src={songInView?.song_user?.picture}
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
                            {songInView?.name}
                          </p>
                          <p id="two">
                            <img src={bullet} alt="bullet point" />
                            {songInView?.song_user?.user_name}
                          </p>
                        </div>

                        <div className="song-caption-container">
                          <div className="song-date" style={isLoading ? {opacity: "0"} : {opacity: "1"}}>
                            <p>{formatDate(songInView?.date, 'm')}</p>
                            <img src={bullet} alt="bullet point" />
                          </div>
                          <p className="song-caption" style={isLoading ? {opacity: "0"} : {opacity: "1"}}>
                            {songInView?.caption
                              ? songInView?.caption
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
                        <div className="play-btn_inset-container">
                          <div className="play-btn_shadow-div-inset">
                            <button 
                              className="play-btn_shadow-div-outset" 
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              <img
                                className={`button-icons ${isPlaying ? 'bi-pause' : 'bi-play'}`}
                                src={isPlaying ? pause : play}
                                ref={playPauseRef}
                                alt="play or pause"
                              />
                            </button>
                          </div>
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
                        bgColor={`#6d6d6d`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavBar />
      </div>
    </TheViewContext.Provider>
  )
}

export default Home
