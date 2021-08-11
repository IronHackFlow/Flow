import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group"
import { useLocation, Link } from "react-router-dom";
import TheContext from "../TheContext";
import TheViewContext from "../TheViewContext";
import actions from "../api";
import DisplaySong from "./DisplaySong.js";
import Comments from "./Comments.js";
import Search from "./Search.js";
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
    user, setUser, userViewed, setUserViewed,
    navDisplayed, toggleSocial, setToggleSocial,
    setToggleExplore, setToggleProfile
  } = React.useContext(TheContext);

  const location = useLocation();
  const gifsCopy = [...gifsArr];
  const [theFeedSongs, setTheFeedSongs] = useState([]);
  const [exploreFeedSongs, setExploreFeedSongs] = useState([]);
  const [songInView, setSongInView] = useState({});
  const [songUserInView, setSongUserInView] = useState({});
  const [commentsInView, setCommentsInView] = useState([]);
  const [likesInView, setLikesInView] = useState();
  const [followersInView, setFollowersInView] = useState();
  const [audioInView, setAudioInView] = useState();
  const [userLiked, setUserLiked] = useState();
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState();
  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();
  const [totalComments, setTotalComments] = useState();

  const popUpSearchRef = useRef();
  const commentPopUpRef = useRef();
  const commentBtn = useRef();
  const searchBtn = useRef();
  const audioRef = useRef();
  const windowRef = useRef();
  const profilePicRef = useRef();
  const opacityRef1 = useRef();
  const opacityRef2 = useRef();
  const searchInputRef = useRef();
  const searchButtonRef = useRef();
  const commentInputRef = useRef();
  const commentButtonRef = useRef();
  const playPauseRef = useRef();
  const followBtnRef1 = useRef();
  const followBtnRef2 = useRef();
  const followBtnRef3 = useRef();

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((res) => {
        const songsArray = res.data.map((each) => {
          return {song: each, songVideo: getRandomBackground()}
        })
        setTheFeedSongs(songsArray);
      })
      .catch(console.error);
  }, []);

  // useEffect(() => {
  //   const followingArray = user.userFollows.map((each) => {
  //     actions
  //     .getUserSongs({ songUser: each.followed })
  //     .then((res) => {
  //       // const songsArray = res.data.map((each) => {
  //       //   return {song: each, songVideo: getRandomBackground()}
  //       // })
  //       // setTheFeedSongs(songsArray);
  //       return res.data
  //     })
  //     .catch(console.error)
  //   })
  //   console.log(followingArray)
  // }, []);

  useEffect(() => {
    if (location.pathname === "/explore-feed") {
      setToggleExplore(true)
      setToggleSocial(false)
    }
    if (location.pathname === "/social-feed") {
      setToggleSocial(true)
      setToggleExplore(false)
    }
  }, [location, setToggleSocial, setToggleExplore]);

  useEffect(() => {
    if (navDisplayed === true) {
      menuDown('search')
      menuDown('comment')
    }
  }, [navDisplayed]);

  useEffect(() => {
    setTotalFollowers(followersInView?.length)
  }, [followersInView])

  useEffect(() => {
    setTotalLikes(likesInView?.length)
  }, [likesInView])

  useEffect(() => {
    setTotalComments(commentsInView?.length)
  }, [])

  const toggleFeed = () => {
    const followedIds = user.userFollows.map((each) => {
      return { songUser: each }
    })
    actions
      .getUserFollowsSongs(followedIds)
      .then((res) => {
        console.log(res.data, "please work lol")
      })
      .catch(console.error)
  }

  const showSongs = () => {
    return theFeedSongs.map((eachSong) => {
      return <DisplaySong key={eachSong.song?._id} {...eachSong} />;
    });
  };
  
  const showExploreSongs = () => {
    return exploreFeedSongs.map((eachSong, index) => {
      return <DisplaySong key={eachSong.song._id + index} {...eachSong} />
    });
  };

  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    return gifsCopy[index].url
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
     audioRef.current.play()
     playPauseRef.current.src = pause
    }
    else {
     audioRef.current.pause()
     playPauseRef.current.src = play
   }
  }

  const dateFormatHandler = (date) => {
    const getDate = new Date()
    const currentDate = Date.parse(getDate)
    const objDate = Date.parse(date)
    const timeDiff = currentDate - objDate

    const year = 31536000000
    const month = 2592000000
    const week = 604800000
    const day = 86400000
    const hour = 3600000
    const minute = 60000
    const second = 1000

    if (timeDiff >= year) {
      console.log((timeDiff / year), " years ago")
    }
    else if (timeDiff >= month && timeDiff < year) {
      if (timeDiff / month < 11.5) {
        return `${Math.round(timeDiff / month)}m`
      }
      else {
        return "1y"
      }
    }
    else if (timeDiff >= week && timeDiff < (month * 2)) {
      console.log((timeDiff / week), " weeks ago")
    }
    else if (timeDiff >= day && timeDiff < week) {
      console.log((timeDiff / day), " days ago")
    }
    else if (timeDiff >= hour && timeDiff < day) {
      console.log((timeDiff / hour), " hours ago")
    }
    else if (timeDiff >= minute && timeDiff < hour) {
      console.log((timeDiff / minute), " minutes ago")
    }
    else if (timeDiff >= second && timeDiff < minute) {
      console.log((timeDiff / second), " seconds ago")
    }
  }

  const followCheck = () => {
    if (user._id === songUserInView._id) {
      console.log(`You can't follow yourself lol`)
      return null
    }
    actions
      .getAUser({ id: songUserInView._id })
      .then((res) => {
        let deleteObj = null

        res.data.followers.forEach((each) => {
          if (each.follower === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          postFollow()
        }
        else {
          deleteFollow(deleteObj)
        }
      })
      .catch(console.error)
  };
  
  const postFollow = () => {
    actions
      .addFollow({ followedUser: songUserInView._id, 
                   followDate: new Date() })
      .then((res) => {
        console.log(`added a follow to: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error);
  };

  const deleteFollow = (deleteObj) => {
    actions
      .deleteFollow({ followedUser: songUserInView._id, deleteObj: deleteObj })
      .then((res) => {
        console.log(`deleted a follow from: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error)
  };
  
  const likeCheck = () => {
    actions
      .getSong({ id: songInView._id })
      .then((res) => {
        let deleteObj = null

        res.data.songLikes.forEach((each) => {
          if (each.likeUser === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          postLike()
        }
        else {
          deleteLike(deleteObj)
        }
      })
      .catch(console.error)
  };

  const postLike = () => {
    actions
      .addLike({ likerSong: songInView._id, likeDate: new Date(), commLike: false })
      .then((res) => {
        console.log(`added a like to: `, res.data)
        setUserLiked(true)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };

  const deleteLike = (deleteObj) => {
    actions
      .deleteLike({ likerSong: songInView._id, deleteObj: deleteObj, commLike: false })
      .then((res) => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };

  const popUpComments = () => {
    if (poppedUp === false) {
      menuDown('search')
      menuUp('comment')
    } else {
      menuDown('comment')
    }
  };

  const popUpSearch = () => {
    if (searchPoppedUp === false) {
      menuDown('comment')
      menuUp('search')
    } else {
      menuDown('search')
    }
  };

  const menuDown = (whichMenu) => {
    if (whichMenu === 'search') {
      popUpSearchRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      searchInputRef.current.style.opacity = 0;
      searchButtonRef.current.style.opacity = 0;
      searchButtonRef.current.style.transition = "opacity .5s";
      setSearchPoppedUp(false);
    }
    else if (whichMenu === 'comment') {
      commentPopUpRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      commentInputRef.current.style.opacity = 0;
      commentButtonRef.current.style.opacity = "0";
      commentButtonRef.current.style.transition = "opacity .5s";
      opacityRef1.current.style.opacity = 0;
      opacityRef2.current.style.opacity = 0;
      setPoppedUp(false);
    }
  };

  const menuUp = (whichMenu) => {
    if (whichMenu === 'search') {
      searchInputRef.current.focus()
      searchInputRef.current.style.opacity = 1;
      searchButtonRef.current.style.opacity = 1;
      searchButtonRef.current.style.transition = "opacity .5s";
      popUpSearchRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setSearchPoppedUp(true);
    }
    else if (whichMenu === 'comment') {
      commentInputRef.current.focus()
      commentInputRef.current.style.opacity = 1;
      commentButtonRef.current.style.opacity = "1";
      commentButtonRef.current.style.transition = "opacity .5s";
      opacityRef1.current.style.opacity = 1;
      opacityRef2.current.style.opacity = 1;
      commentPopUpRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setPoppedUp(true);
    }
  }

  const transClass = () => {
    if (toggleSocial === true) {
      return "fadeRight"
    }
    else {
      return "fade"
    }
  }

  return (
    <TheViewContext.Provider value={{
      songInView, setSongInView,
      songUserInView, setSongUserInView,
      commentsInView, setCommentsInView,
      likesInView, setLikesInView,
      followersInView, setFollowersInView,
      audioInView, setAudioInView,
      totalComments, setTotalComments
    }}>
      <div className="Home">
        <div className="section-1_feed">
          <div div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div className="each-feed_shadow-div-inset">
                <div className="each-feed_shadow-div-outset" onClick={toggleFeed}>
                  <div className="each-feed_shadow-div-inset-2">
                  Feed
                  </div>
                </div>
              </div>

              <div className="each-feed_shadow-div-inset" style={{borderRadius: "50px"}}>
                <div className="each-feed_shadow-div-outset" onClick={toggleFeed}>
                  <div className="each-feed_shadow-div-inset-2">
                  Trending
                  </div>
                </div>
              </div>
              
              <div className="each-feed_shadow-div-inset" style={{borderRadius: "50px 5px 5px 50px"}}>
                <div className="each-feed_shadow-div-outset" onClick={toggleFeed}>
                  <div className="each-feed_shadow-div-inset-2">
                  Following
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="video-scroll-container" ref={windowRef}>
            <ul className="video-scroll-container">
              {showSongs()}
            </ul>
              {/* <CSSTransition
                in={toggleSocial}
                key={'key2'}
                classNames={transClass()}
                timeout={800}
                mountOnEnter
                unmountOnExit
                >
                  <ul className="video-scroll-container">
                    {showSongs()}
                  </ul>
              </CSSTransition>
              <CSSTransition 
                in={toggleExplore}
                key={'key1'}
                classNames={transClass()}
                timeout={800}
                mountOnEnter
                unmountOnExit
                >
                  <ul className="video-scroll-container">
                    {showExploreSongs()}
                  </ul>
              </CSSTransition> */}
          </div>

          <Comments 
            commentPopUpRef={commentPopUpRef}
            commentInputRef={commentInputRef}
            commentButtonRef={commentButtonRef}
            poppedUp={poppedUp}
            menuUp={menuUp}
            opacityRef1={opacityRef1} 
            opacityRef2={opacityRef2}
            />
          <Search 
            popUpSearchRef={popUpSearchRef} 
            searchInputRef={searchInputRef} 
            searchButtonRef={searchButtonRef}
            />

          <div className="section-1c_song-details" style={{display: props.socialDisplay}}>
            <div className="song-details-1_actions">
              <div className="actions_shadow-div-outset">
                <div className="actions_shadow-div-inset">
                  <div className="action-btns-container">
                    <div className="action-btn_shadow-div-outset" onClick={followCheck} style={{borderRadius: "50px 5px 5px 50px"}}>
                      <div className="action-btn-icon_shadow-div-inset" ref={followBtnRef1} style={{borderRadius: "40px 4px 4px 40px"}}>
                        <img className="social-icons si-follow" src={follow} ref={followBtnRef2} alt="follow user icon" />
                      </div>
                      <div className="action-btn-text" ref={followBtnRef3}>
                        <p style={{color: "white"}}>{totalFollowers}</p>
                        <p>Follow</p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset" onClick={likeCheck}>
                      <div className="action-btn-icon_shadow-div-inset">
                        <img className="social-icons si-like" src={like} alt="like post icon" />
                      </div>
                      <div className="action-btn-text">
                        <p style={{color: "white"}}>{totalLikes}</p>
                        <p>Like</p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset" onClick={popUpComments}>
                      <div className="action-btn-icon_shadow-div-inset" ref={commentBtn}>
                        <img className="social-icons si-comment" src={comments} alt="comment on post icon" />
                      </div>
                      <div className="action-btn-text">
                        <p style={{color: "white"}}>{totalComments}</p>
                        <p>Comment</p>
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
                        to={{pathname: `/profile/${songUserInView._id}`, profileInfo: songUserInView}} 
                        className="user-pic_shadow-div-inset"
                        onClick={() => setToggleProfile(true)}
                        >
                        <img src={songUserInView.picture} alt="user in view profile" ref={props.profilePicRef} />
                      </Link>
                    </div>
                  </div>

                  <div className="song-title-container">
                    <div className="song-title_shadow-div-outset">
                      <div className="song-title_shadow-div-inset"> 
                        <p id="one">{songInView.songName} <img src={bullet} alt="bullet point" />
                        </p>
                        <p id="two">
                          {songUserInView.userName}
                        </p>
                      </div>

                      <div className="song-caption-container">
                        <p className="song-date">
                          {dateFormatHandler(songInView.songDate)} <img src={bullet} alt="bullet point" />
                        </p>
                        <p className="song-caption">
                          {songInView.songCaption ? songInView.songCaption : "no caption for this song"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="song-play-section">
                  <div className="play-bar-container">
                    <div className="play-bar_shadow-div-inset">
                    </div>
                  </div>

                  <div className="play-song-container">
                    <div className="play-btn-container">
                      <div className="play-btn_shadow-div-outset">
                        <div className="play-btn_shadow-div-inset">
                          <div className="play-btn_shadow-div-outset-2" onClick={handlePlayPause}>
                            <img className="button-icons bi-play" src={play} ref={playPauseRef} alt="play" />
                            <audio ref={audioRef} src={audioInView} id='damn'></audio>
                          </div>
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
          popUpSearch={popUpSearch}
          searchPoppedUp={searchPoppedUp}
          searchBtn={searchBtn} 
          profilePicRef={profilePicRef}
          />
      </div>
    </TheViewContext.Provider>
  )
}

export default Home;
