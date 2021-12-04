import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TheContext from "../TheContext";
import TheViewContext from "../TheViewContext";
import FormatDate from "./utils/FormatDate"
import actions from "../api";
import DisplaySong from "./DisplaySong.js";
import AudioTimeSlider from "./AudioTimeSlider.js";
import Comments from "./Comments.js";
import NavBar from "./NavBar.js";
import gifsArr from "../images/gifs.json";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import bullet from "../images/bullet-point.svg";
import like from "../images/heart2.svg";

function Home(props) {
  const { 
    user
  } = React.useContext(TheContext);

  const gifsCopy = [...gifsArr];
  const [theFeedBool, setTheFeedBool] = useState(true);
  const [trendingBool, setTrendingBool] = useState(false);
  const [followingBool, setFollowingBool] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInView, setAudioInView] = useState(null);
  const [songInView, setSongInView] = useState({});
  const [songUserInView, setSongUserInView] = useState({});
  const [commentsInView, setCommentsInView] = useState([]);
  const [likesInView, setLikesInView] = useState();
  const [followersInView, setFollowersInView] = useState();
  const [poppedUp, setPoppedUp] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();
  const [totalComments, setTotalComments] = useState();
  const [commentsArray, setCommentsArray] = useState([])
  const [theFeedSongs, setTheFeedSongs] = useState([]);
  const [trendingSongsFeed, setTrendingSongsFeed] = useState([]);
  const [followingSongsFeed, setFollowingSongsFeed] = useState([]);  
  const [displayFeed, setDisplayFeed] = useState([])
  const [displayTrending, setDisplayTrending] = useState([])
  const [displayFollowing, setDisplayFollowing] = useState([])
  const [updateFollowFeed, setUpdateFollowFeed] = useState();
  
  const windowRef = useRef();
  const commentInputRef = useRef();
  const profilePicRef = useRef();
  const playPauseRef = useRef();
  const [home] = useState(`#6d6d6d`);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    actions
      .getMostLikedSongs()
      .then(res => {
        let commentArray = []
        const songsArray = res.data.map((each, index)=> {
          commentArray.push({ songId: each._id, comments: each.songComments })
          return { song: each, songVideo: gifsCopy[index].url }
        }).reverse()
        const sortByLikes = res.data.sort((a, b) => b.songLikes.length - a.songLikes.length)
        const trendingArray = sortByLikes.map((each, index) => {
          return { song: each, songVideo: gifsCopy[index].url }
        })
        setCommentsArray(commentArray)
        setTheFeedSongs(songsArray)
        setTrendingSongsFeed(trendingArray)
      }, signal)
      .catch(console.error)
    return () => controller.abort()
  }, [totalLikes])

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    actions
      .getUserFollowsSongs(updateFollowFeed)
      .then(res => {
        const songsArray = res.data.map((each, index) => {
          return { song: each, songVideo: gifsCopy[index].url }
        }).reverse()
        console.log(res.data, "all songs by users you're following")
        setFollowingSongsFeed(songsArray)
      }, signal)
      .catch(console.error)
    return () => controller.abort()
  }, [updateFollowFeed])

  useEffect(() => {
    setUpdateFollowFeed(user.userFollows)
  }, [user])

  useEffect(() => {
    setTotalFollowers(followersInView?.length)
  }, [followersInView])

  useEffect(() => {
    setTotalLikes(likesInView?.length)
  }, [likesInView])

  useEffect(() => {
    setTotalComments(commentsInView?.length)
  }, [])

  useEffect(() => {
    let feed = theFeedSongs.map((eachSong, index) => {
      return <DisplaySong eachSong={eachSong} passKey={`${uuidv4()}feed${eachSong.song._id}_${index}`} />
    })
    setDisplayFeed(feed)
  }, [theFeedSongs])

  useEffect(() => {
    let trend = trendingSongsFeed.map((eachSong, index) => {
      return <DisplaySong eachSong={eachSong} passKey={`${uuidv4()}trending${eachSong.song._id}_${index + 1}`} />
    })
    setDisplayTrending(trend)
  }, [trendingSongsFeed])
  
  useEffect(() => {
    let follow = followingSongsFeed.map((eachSong, index) => {
      return <DisplaySong eachSong={eachSong} passKey={`${uuidv4()}following${eachSong.song._id}_${index + 3}`} />
    })
    setDisplayFollowing(follow)
  }, [followingSongsFeed])

  const showSongs = useCallback(() => {
    if (theFeedBool) return displayFeed
    else if (trendingBool) return displayTrending
    else if (followingBool) return displayFollowing
  }, [displayFeed, displayTrending, displayFollowing, theFeedBool, trendingBool, followingBool])

  // const scrollToTop = () => {
  //   console.log(window, 'lol??')
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth'
  //   })
  // }
  const handlePlayPause = (bool) => {
    if (bool === true) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const followCheck = () => {
    if (user._id === songUserInView._id) {
      console.log(songUserInView, `You can't follow yourself lol`)
    } else {
      actions
      .getAUser({ id: songUserInView._id })
      .then(res => {
        let deleteObj = null

        res.data.followers.forEach(each => {
          if (each.follower === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          postFollow()
        } else {
          deleteFollow(deleteObj)
        }
      })
      .catch(console.error)
    }
  }

  const postFollow = () => {
    actions
      .addFollow({ followedUser: songUserInView._id, followDate: new Date() })
      .then(res => {
        console.log(`added a follow to: `, res.data.followedData._doc)
        setTotalFollowers(res.data.followedData._doc.followers.length)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows.reverse())
      })
      .catch(console.error)
  }

  const deleteFollow = deleteObj => {
    actions
      .deleteFollow({ followedUser: songUserInView._id, deleteObj: deleteObj })
      .then(res => {
        console.log(`deleted a follow from: `, res.data.followerData._doc)
        setTotalFollowers(res.data.followedData._doc.followers.length)
        setUpdateFollowFeed(res.data.followerData._doc.userFollows.reverse())
      })
      .catch(console.error)
  }

  const likeCheck = () => {
    actions
      .getSong({ id: songInView._id })
      .then(res => {
        let deleteObj = null

        res.data.songLikes.forEach(each => {
          if (each.likeUser === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          postLike()
        } else {
          deleteLike(deleteObj)
        }
      })
      .catch(console.error)
  }

  const postLike = () => {
    actions
      .addLike({
        likerSong: songInView._id,
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
        likerSong: songInView._id,
        deleteObj: deleteObj,
        commLike: false,
      })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error)
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
        songUserInView,
        setSongUserInView,
        commentsInView,
        setCommentsInView,
        likesInView,
        setLikesInView,
        followersInView,
        setFollowersInView,
        audioInView,
        setAudioInView,
      }}
    >
      <div className="Home">
        <div className="section-1_feed">
          <div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div className="each-feed_shadow-div-inset">
                <div
                  className={theFeedBool ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setTheFeedBool(true)
                    setTrendingBool(false)
                    setFollowingBool(false)
                  }}
                >
                  <div className={theFeedBool ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Feed
                  </div>
                </div>
              </div>
              
              <div className="each-feed_shadow-div-inset" style={{ borderRadius: '50px' }}>
                <div
                  className={trendingBool ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setTrendingBool(true)
                    setTheFeedBool(false)
                    setFollowingBool(false)
                  }}
                >
                  <div className={trendingBool ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Trending
                  </div>
                </div>
              </div>

              <div
                className="each-feed_shadow-div-inset"
                style={{ borderRadius: '50px 5px 5px 50px' }}
              >
                <div
                  className={followingBool ? "each-feed_shadow-div-outset toggle-feed" : "each-feed_shadow-div-outset"}
                  onClick={() => {
                    setFollowingBool(true)
                    setTrendingBool(false)
                    setTheFeedBool(false)
                  }}
                >
                  <div className={followingBool ? "each-feed_shadow-div-inset-2 toggle-feed-2" : "each-feed_shadow-div-inset-2"}>
                    Following
                  </div>
                </div>
              </div>
            </div>
          </div>


          <ul className="video-scroll-container" ref={windowRef}>
            {showSongs()}
            {/* <div className="scroll-top-container" onClick={() => scrollToTop()}>
              <div className="scroll-top-button">
                ^
              </div>
            </div> */}
          </ul>

          <Comments
            commentInputRef={commentInputRef}
            songInView={songInView}
            commentsArray={commentsArray}
            setCommentsArray={setCommentsArray}
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
                    <div
                      className="action-btn_shadow-div-outset"
                      onClick={followCheck}
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
                      <div className="action-btn-text">
                        <p style={{ color: 'white' }}>{totalFollowers}</p>
                        <p>
                          {(totalFollowers === 1)
                              ? "Follow"
                              : "Follows"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset" onClick={likeCheck}>
                      <div className="action-btn-icon_shadow-div-inset">
                        <img className="social-icons si-like" src={like} alt="like post icon" />
                      </div>
                      <div className="action-btn-text">
                        <p style={{ color: 'white' }}>{totalLikes}</p>
                        <p>
                          {(totalLikes === 1) 
                              ? "Like"
                              : "Likes"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset" onClick={popUpComments}>
                      <div className="action-btn-icon_shadow-div-inset">
                        <img
                          className="social-icons si-comment"
                          src={comments}
                          alt="comment on post icon"
                        />
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
                  </div>
                </div>
              </div>
            </div>

            <div className="song-details-2_song-data">
              <div className="song-data-container">
                <div className="song-user-section">
                  <div className="user-pic-container">
                    <div className="user-pic_shadow-div-outset">
                      <Link
                        to={`/profile/${songUserInView._id}`}
                        className="user-pic_shadow-div-inset"
                      >
                        <img
                          src={songUserInView?.picture}
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
                          {songInView.songName}
                        </p>
                        <p id="two"><img src={bullet} alt="bullet point" />{songUserInView.userName}</p>
                      </div>

                      <div className="song-caption-container">
                        <div className="song-date">
                          <FormatDate date={songInView.songDate} />{' '}
                          <img src={bullet} alt="bullet point" />
                        </div>
                        <p className="song-caption">
                          {songInView.songCaption
                            ? songInView.songCaption
                            : 'no caption for this song'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="song-play-section">
                  <div className="play-bar-container">
                    <AudioTimeSlider
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      currentSong={songInView}
                      location={home}
                      />
                  </div>

                  <div className="play-song-container">
                    <div className="play-btn-container">
                      <div className="play-btn_shadow-div-outset">
                        <div className="play-btn_shadow-div-inset">
                          {isPlaying 
                            ? (
                              <button 
                                className="play-btn_shadow-div-outset-2" 
                                onClick={() => handlePlayPause(false)}
                              >
                                <img
                                  className="button-icons bi-play"
                                  src={pause}
                                  ref={playPauseRef}
                                  alt="pause"
                                />
                              </button>
                            )
                            : (
                              <button 
                                className="play-btn_shadow-div-outset-2" 
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavBar
          profilePicRef={profilePicRef}
        />
      </div>
    </TheViewContext.Provider>
  )
}

export default Home
