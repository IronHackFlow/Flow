import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group"
import { useLocation } from "react-router-dom";
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



function SocialFeed(props) {
  const { user, setUser,
          setUserViewed, navDisplayed,
          toggleSocial, setToggleSocial,
          toggleExplore, setToggleExplore,
          getSongName, setGetSongName,
          setSongId, setSongComments
  } = React.useContext(TheContext);

  const location = useLocation();

  let gifsCopy = [...gifsArr]

  const [thisFeedSongs, setThisFeedSongs] = useState([]);
  const [exploreFeedSongs, setExploreFeedSongs] = useState([])
  const [userForSong, setUserForSong] = useState();
  const [getSongCaption, setGetSongCaption] = useState()
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);
  const [songLikes, setSongLikes] = useState();
  const [songUserFollowers, setSongUserFollowers] = useState();
  const [songDate, setSongDate] = useState();
  const [songUserId, setSongUserId] = useState();

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
      threshold: .9,
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
              </CSSTransition>
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
