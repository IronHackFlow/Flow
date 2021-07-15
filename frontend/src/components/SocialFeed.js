import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group"
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import actions from "../api";
import TheContext from "../TheContext";
import Comments from "./Comments.js";
import Search from "./Search.js";
import NavBar from "./NavBar.js";
import gradientbg from "../images/gradient-bg-2.png";
import play from "../images/play.svg";
import pause from "../images/pause.svg"
import gifsArr from "../images/gifs.json";

function SocialFeed(props) {
  const { user, setUser, 
          userViewed, setUserViewed, 
          navDisplayed, setNavDisplayed,
          toggleSocial, setToggleSocial,
          toggleExplore, setToggleExplore,
          getSongName, setGetSongName,
          songId, setSongId,
          songComments, setSongComments
    } = React.useContext(
    TheContext
  );
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

  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    return gifsCopy[index].url
  }

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
      searchBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
      popUpSearchRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      dumbSearchRef.current.style.opacity = 0;
      setSearchPoppedUp(false);
    }
    else if (whichMenu === 'comment') {
      commentBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
      popUpRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      opacityRef1.current.style.opacity = 0;
      opacityRef2.current.style.opacity = 0;
      setPoppedUp(false);
    }
  }
  const menuUp = (whichMenu) => {
    if (whichMenu === 'search') {
      searchBtn.current.style.boxShadow = "inset 2px 2px 3px #3d3f3f, inset -2px -2px 3px #989898"
      dumbSearchRef.current.style.opacity = 1;
      popUpSearchRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setSearchPoppedUp(true);
    }
    else if (whichMenu === 'comment') {
      commentBtn.current.style.boxShadow = "inset 2px 2px 3px #3d3f3f, inset -2px -2px 3px #989898"
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
      threshold: 1,
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
      setUserForSong(eachSong.song.songUser)
      setSongId(eachSong.song._id)
      setGetSongName(eachSong.song.songName)
      setGetSongCaption(eachSong.song.songCaption)
      setUserViewed(eachSong.song.songUser)
      setSongComments(eachSong.song.songComments)
      setSongLikes(eachSong.song.songLikes)
      setSongUserFollowers(eachSong.song.songUser.followers)
      console.log(eachSong.song)
      audioRef.current.src = eachSong.song.songURL
    }
  
    return (
      <li
        ref={setRefs}
        className="video-pane"
        style={{ backgroundImage: `url('${gradientbg}'), url('${eachSong.songVideo}')` }}
        >
        <div className="last-div"></div>
      </li>
    );
  }

  const showSongs = () => {
    return thisFeedSongs.map((eachSong) => {
      // eachSong.shorts = getRandomBackground();
      return <DisplaySong key={eachSong.song?._id} {...eachSong} />;
    });
  }
  const showExploreSongs = () => {
    return exploreFeedSongs.map((eachSong, index) => {
      // eachSong.shorts = getRandomBackground();
      return <DisplaySong key={eachSong.song._id + index} {...eachSong} />
    })
  }

  return (
      <div className="SocialFeed">
        <div ref={windowRef} className="social-panel">
          <div className="video-scroll-container" style={{width: '99%'}}>
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

          <div className="video-details-container">
            <div className="transparent-test">
              <div className="user-details-container">
                <div className="user-details-inset">
                  <div className="text-container">
                    <div className="udt-1-container">
                      <p className="ud-text udt-1"> 
                        <span style={{ color: "#ec6aa0" }}>
                          {userForSong?.userName}
                        </span>
                      </p>
                    </div>
                    <div className="udt-2-container">
                      <p className="ud-text udt-2">
                        {getSongName}
                      </p>
                    </div>
                    <div className="udt-3-container">
                      <p className="ud-text udt-3">
                        {getSongCaption ? getSongCaption : "no caption for this flow"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-profile-image">
                <div className="user-profile-inset social-p">
                  <div className="nav-buttons-inset inset-social-p">
                    <img className="button-icons bi-play" src={play} onClick={handlePlayPause} alt="play button icon" ref={playPauseRef}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Search popUpSearchRef={popUpSearchRef} 
                dumbSearchRef={dumbSearchRef} 
                />
        <Comments popUpRef={popUpRef}
                  popUpComments={popUpComments}
                  poppedUp={poppedUp}
                  menuUp={menuUp}
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
