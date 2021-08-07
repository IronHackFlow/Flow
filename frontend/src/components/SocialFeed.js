import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group"
import { useLocation, Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import moment from "moment";
import actions from "../api";
import TheContext from "../TheContext";
import gifsArr from "../images/gifs.json";
import Comments from "./Comments.js";
import Search from "./Search.js";
import NavBar from "./NavBar.js";
import gradientbg from "../images/gradient-bg-2.png";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import bullet from "../images/bullet-point.svg";
import home from "../images/home.svg";
import like from "../images/heart2.svg";
import explore from "../images/explore.svg";
import e from "cors";


function SocialFeed(props) {
  const { user, setUser, userViewed, songId, 
          setUserViewed, navDisplayed,
          toggleSocial, setToggleSocial,
          toggleExplore, setToggleExplore,
          getSongName, setGetSongName,
          toggleProfile, setToggleProfile,
          setSongId, songComments, setSongComments
  } = React.useContext(TheContext);

  const location = useLocation();

  let gifsCopy = [...gifsArr]

  const [thisFeedSongs, setThisFeedSongs] = useState([]);
  const [exploreFeedSongs, setExploreFeedSongs] = useState([])
  const [userForSong, setUserForSong] = useState({});
  const [getSongCaption, setGetSongCaption] = useState()
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);
  const [songLikes, setSongLikes] = useState();
  const [songUserFollowers, setSongUserFollowers] = useState();
  const [songDate, setSongDate] = useState();
  const [songUserId, setSongUserId] = useState();
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  const popUpSearchRef = useRef();
  const popUpRef = useRef();
  const commentBtn = useRef();
  const searchBtn = useRef();
  const audioRef = useRef();
  const windowRef = useRef();
  const profilePicRef = useRef();
  const opacityRef1 = useRef();
  const opacityRef2 = useRef();
  const dumbSearchRef = useRef();
  const searchButtonRef = useRef();
  const playPauseRef = useRef();
  const followBtnRef1 = useRef();
  const followBtnRef2 = useRef();
  const followBtnRef3 = useRef();


  const followCheck = () => {
    if (user._id === userViewed._id) {
      console.log(`You can't follow yourself lol`)
      return null
    }
    actions
      .getAUser({ id: userViewed._id })
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
  }
  
  const postFollow = () => {
    actions
      .addFollow({ followedUser: userViewed._id, 
                   followDate: new Date() })
      .then((res) => {
        console.log(`added a follow to: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error);
  };

  const deleteFollow = (deleteObj) => {
    actions
      .deleteFollow({ followedUser: userViewed._id, deleteObj: deleteObj })
      .then((res) => {
        console.log(`deleted a follow from: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error)
  };

  const likeCheck = () => {
    actions
      .getSong({ id: songId })
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
  }

  const postLike = () => {
    actions
      .addLike({ likerSong: songId, likeDate: new Date(), commLike: false })
      .then((res) => {
        console.log(`added a like to: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };

  const deleteLike = (deleteObj) => {
    actions
      .deleteLike({ likerSong: songId, deleteObj: deleteObj, commLike: false })
      .then((res) => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };

  const dateFormatHandler = (date) => {
    const getDate = new Date();
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

  useEffect(() => {
    if (location.pathname === "/explore-feed") {
      setToggleExplore(true)
      setToggleSocial(false)
    }
    if (location.pathname === "/social-feed") {
      setToggleSocial(true)
      setToggleExplore(false)
    }
  }, [location, setToggleSocial, setToggleExplore])

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((usersSongs) => {
        const songsArray = usersSongs.data.map((each) => {
          return {song: each, songVideo: getRandomBackground()}
        })
        setThisFeedSongs(songsArray);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((exploreSongs) => {
        exploreSongs.data.reverse()
        const exploreSongsArray = exploreSongs.data.map((each) => {
          return {song: each, songVideo: getRandomBackground()}
        })
        setExploreFeedSongs(exploreSongsArray)
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (navDisplayed === true) {
      menuDown('search')
      menuDown('comment')
    }
  }, [navDisplayed])
  
  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    return gifsCopy[index].url
  }

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
      // searchBtn.current.style.boxShadow = "3px 3px 5px #404040, -2px -2px 3px #c7c7c7"
      popUpSearchRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      dumbSearchRef.current.style.opacity = 0;
      searchButtonRef.current.style.opacity = 0;
      setSearchPoppedUp(false);
    }
    else if (whichMenu === 'comment') {
      commentBtn.current.style.boxShadow = "3px 3px 5px #404040, -2px -2px 3px #c7c7c7"
      popUpRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      opacityRef1.current.style.opacity = 0;
      opacityRef2.current.style.opacity = 0;
      setPoppedUp(false);
    }
  }
  const menuUp = (whichMenu) => {
    if (whichMenu === 'search') {
      // searchBtn.current.style.boxShadow = "inset 2px 2px 5px #3d3f3f, inset -2px -2px 3px #989898"
      dumbSearchRef.current.style.opacity = 1;
      searchButtonRef.current.style.opacity = 1;
      popUpSearchRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setSearchPoppedUp(true);
    }
    else if (whichMenu === 'comment') {
      commentBtn.current.style.boxShadow = "inset 2px 2px 5px #3d3f3f, inset -2px -2px 3px #989898"
      opacityRef1.current.style.opacity = 1;
      opacityRef2.current.style.opacity = 1;
      popUpRef.current.style.height = "50%";
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

  function DisplaySong(eachSong) {
    const viewRef = useRef();

    const [inViewRef, inView] = useInView({
      threshold: .99,
      root: document.querySelector('.video-scroll-container'),
    });
  
    const setRefs = useCallback(
      (node) => {
        viewRef.current = node;
        inViewRef(node)
      },
      [inViewRef],
    )

    if (inView) {
      setUserForSong(eachSong.song)
      setSongId(eachSong.song._id)
      setSongUserId(eachSong.song._id)
      setGetSongName(eachSong.song.songName)
      setGetSongCaption(eachSong.song.songCaption)
      setUserViewed(eachSong.song.songUser)
      setSongComments(eachSong.song.songComments)
      setSongLikes(eachSong.song.songLikes)
      setSongUserFollowers(eachSong.song.songUser.followers)
      setSongDate(eachSong.song.songDate)
      setTotalLikes(eachSong.song.songLikes.length)
      setTotalFollowers(eachSong.song.songUser.followers.length)
      console.log(eachSong.song)
      audioRef.current.src = eachSong.song.songURL
    }
  
    return (
      <li
        ref={setRefs}
        className="video-pane"
        style={{ backgroundImage: `url('${gradientbg}'), url('${eachSong.songVideo}')` }}
        >
          {/* <div className="last-div"></div> */}
      </li>
    );
  }

  const showSongs = () => {
    return thisFeedSongs.map((eachSong) => {
      return <DisplaySong key={eachSong.song?._id} {...eachSong} />;
    });
  }
  
  const showExploreSongs = () => {
    return exploreFeedSongs.map((eachSong, index) => {
      return <DisplaySong key={eachSong.song._id + index} {...eachSong} />
    })
  }

  return (
      <div className="SocialFeed">
        <div ref={windowRef} className="section-1_feed">
          <div className="video-scroll-container">
              <CSSTransition
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
              {/* <CSSTransition 
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

          <div className="section-1a_toggle-feed">
            <div className="toggle-feed-container">
              <div className="each-feed_shadow-div-inset">
                <div className="each-feed_shadow-div-outset">
                  <div className="each-feed_shadow-div-inset-2">
                  Feed
                  </div>
                </div>
              </div>

              <div className="each-feed_shadow-div-inset" style={{borderRadius: "50px"}}>
                <div className="each-feed_shadow-div-outset">
                  <div className="each-feed_shadow-div-inset-2">
                  Trending
                  </div>
                </div>
              </div>
              
              <div className="each-feed_shadow-div-inset" style={{borderRadius: "50px 5px 5px 50px"}}>
                <div className="each-feed_shadow-div-outset">
                  <div className="each-feed_shadow-div-inset-2">
                  Following
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-1c_song-details" style={{display: props.socialDisplay}}>
            <div className="song-details-1_actions">
              <div className="actions_shadow-div-outset">
                <div className="actions_shadow-div-inset">
                  <div className="action-btns-container">
                    <div className="action-btn_shadow-div-outset" style={{borderRadius: "50px 5px 5px 50px"}}>
                      <div className="action-btn-icon_shadow-div-inset" onClick={followCheck} ref={followBtnRef1} style={{borderRadius: "40px 4px 4px 40px"}}>
                        <img className="social-icons si-follow" src={follow} ref={followBtnRef2} alt="follow user icon" />
                      </div>
                      <div className="action-btn-text" ref={followBtnRef3}>
                        <p style={{color: "white"}}>{totalFollowers}</p>
                        <p>Follow</p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset">
                      <div className="action-btn-icon_shadow-div-inset" onClick={likeCheck}>
                        <img className="social-icons si-like" src={like} alt="like post icon" />
                      </div>
                      <div className="action-btn-text">
                        <p style={{color: "white"}}>{totalLikes}</p>
                        <p>Like</p>
                      </div>
                    </div>

                    <div className="action-btn_shadow-div-outset">
                      <div className="action-btn-icon_shadow-div-inset" ref={props.commentBtn} onClick={props.popUpComments}>
                        <img className="social-icons si-comment" src={comments} alt="comment on post icon" />
                      </div>
                      <div className="action-btn-text">
                        <p style={{color: "white"}}>{songComments.length}</p>
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
                        to={{pathname: `/profile/${userForSong.songUser?._id}`, profileInfo: userForSong.songUser}} 
                        className="user-pic_shadow-div-inset"
                        onClick={() => setToggleProfile(true)}
                        >
                        <img src={userForSong.songUser?.picture} alt="user in view profile" ref={props.profilePicRef} />
                      </Link>
                    </div>
                  </div>

                  <div className="song-title-container">
                    <div className="song-title_shadow-div-outset">
                      <div className="song-title_shadow-div-inset"> 
                        <p id="one">{userForSong.songName} <img src={bullet} alt="bullet point" />
                        </p>
                        <p id="two">
                          {userForSong.songUser?.userName}
                        </p>
                      </div>

                      <div className="song-caption-container">
                        <p className="song-date">
                          {dateFormatHandler(userForSong?.songDate)} <img src={bullet} alt="bullet point" />
                        </p>
                        <p className="song-caption">
                          {userForSong.songCaption ? userForSong.songCaption : "no caption for this song"}
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
                          <div className="play-btn_shadow-div-outset-2">
                            <img className="button-icons bi-play" src={play} alt="play" />
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
        
        <Search popUpSearchRef={popUpSearchRef} 
                dumbSearchRef={dumbSearchRef} 
                searchButtonRef={searchButtonRef}
                />
        <Comments popUpRef={popUpRef}
                  poppedUp={poppedUp}
                  menuUp={menuUp}
                  songUserId={songUserId}
                  opacityRef1={opacityRef1} 
                  opacityRef2={opacityRef2}
                  />
        <NavBar popUpSearch={popUpSearch} 
                popUpComments={popUpComments} 
                searchBtn={searchBtn} 
                commentBtn={commentBtn}
                profilePicRef={profilePicRef}
                userForSong={userForSong}
                songLikes={songLikes}
                setSongLikes={setSongLikes}
                songUserFollowers={songUserFollowers}
                setSongUserFollowers={setSongUserFollowers}

                />
        <audio ref={audioRef} id='damn'></audio>
      </div>
    )
  }

export default SocialFeed;
