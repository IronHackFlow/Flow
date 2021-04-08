import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, useLocation, Redirect } from "react-router-dom";
import { useInView, InView } from "react-intersection-observer";

import TheContext from "../TheContext"
import Comments from "../components/Comments"
import SearchBackup from "../components/SearchBackup.js"
import NavBar from "../components/NavBar"
import actions from "../api";
import gradientbg from "../images/gradient-bg-2.png";
import play from "../images/play.svg";
import gifsArr from "../images/gifs.json";

// let SONG = {};

function SocialFeed(props) {
  const { user, setUser, 
          userViewed, setUserViewed, 
          navDisplayed, setNavDisplayed
    } = React.useContext(
    TheContext
  );
  const location = useLocation();
  
  let SONG = {}
  let page = 1;
  let page2 = 1
  let gifsCopy = [...gifsArr]

  const [thisFeedSongs, setThisFeedSongs] = useState([]);
  const [exploreFeedSongs, setExploreFeedSongs] = useState([])
  const [userForSong, setUserForSong] = useState({});
  const [activeSong, setActiveSong] = useState({});
  const [writer, setWriter] = useState();
  const [comment, setComment] = useState();

  const [likes, setLikes] = useState(0);
  const [toggleExplore, setToggleExplore] = useState();
  const [toggleSocial, setToggleSocial] = useState();
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);

  const popUpSearchRef = useRef();
  const commentBtn = useRef();
  const searchBtn = useRef();
  const songUserIdRef = useRef();
  const songRef = useRef(thisFeedSongs[0]);
  const audioRef = useRef();
  const windowRef = useRef();
  const profilePicRef = useRef();
  const likesRef = useRef();
  const popUpRef = useRef();
  const opacityRef1 = useRef();
  const opacityRef2 = useRef();
  const opacityRef3 = useRef();
  const dumbSearchRef = useRef();  
  const opacitySearchRef3 = useRef();  

  useEffect(() => {
    if (location.pathname === "/social-test") {
      setToggleExplore(true)
      setToggleSocial(false)
    }
    if (location.pathname === "/social-feed") {
      setToggleSocial(true)
      setToggleExplore(false)
    }
  }, [location])

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((usersSongs) => {
        setThisFeedSongs(usersSongs.data);
        console.log("inside social feed useeffect", thisFeedSongs);
      })
      .catch(console.error);
  }, [page]);

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((exploreSongs) => {
        exploreSongs.data.reverse()
        setExploreFeedSongs(exploreSongs.data)
        console.log("inside explore feed useeffect", exploreFeedSongs)
      })
      .catch(console.error);
  }, [page2]);

  useEffect(() => {
    if (navDisplayed == true) {
      menuDown('search')
      menuDown('comment')
    }
  }, [navDisplayed])

  const menuDown = (whichMenu) => {
    if (whichMenu == 'search') {
      searchBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
      popUpSearchRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      opacitySearchRef3.current.style.opacity = 0;
      dumbSearchRef.current.style.opacity = 0;
      setSearchPoppedUp(false);
    }
    else if (whichMenu == 'comment') {
      commentBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
      popUpRef.current.style.height = "0px";
      windowRef.current.style.bottom = "0";
      opacityRef1.current.style.opacity = 0;
      opacityRef2.current.style.opacity = 0;
      opacityRef3.current.style.opacity = 0;
      setPoppedUp(false);
    }
  }
  const menuUp = (whichMenu) => {
    if (whichMenu == 'search') {
      searchBtn.current.style.boxShadow = "inset 2px 2px 3px #3d3f3f, inset -2px -2px 3px #989898"
      opacitySearchRef3.current.style.opacity = 1;
      dumbSearchRef.current.style.opacity = 1;
      popUpSearchRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setSearchPoppedUp(true);
    }
    else if (whichMenu == 'comment') {
      commentBtn.current.style.boxShadow = "inset 2px 2px 3px #3d3f3f, inset -2px -2px 3px #989898"
      opacityRef1.current.style.opacity = 1;
      opacityRef2.current.style.opacity = 1;
      opacityRef3.current.style.opacity = 1;
      popUpRef.current.style.height = "50%";
      windowRef.current.style.bottom = "50%";
      setPoppedUp(true);
    }
  }

  const popUpComments = () => {
    if (poppedUp == false) {
      menuDown('search')
      menuUp('comment')
    } else {
      menuDown('comment')
    }
  };

  const popUpSearch = () => {
    if (searchPoppedUp == false) {
      menuDown('comment')
      menuUp('search')
    } else {
      menuDown('search')
    }
  };

  const transClass = () => {
    if (toggleSocial === true) {
      return "fadeRight"
    }
    else {
      return "fade"
    }
  }
  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    return gifsCopy[index].url
  }

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
     audioRef.current.play()
    }
    else {
     audioRef.current.pause()
   }
  }
  // const viewRef = useRef()
  // const [inViewRef] = useInView({
  //   threshold: .8,
  // });

  // const setRefs = useCallback(
  //   (node) => {
  //     viewRef.current = node;
  //     inViewRef(node)
  //   },
  //   [inViewRef],
  // )
  const viewRef = useRef()
  const [test, setTest] = useState()

  function DisplaySong(eachSong) {
    // if (inView) {
    //   SONG = eachSong;
    //   audioRef.current.src = eachSong.songURL
    //   profilePicRef.current.src = eachSong.songUser.picture
    //   songRef.current = eachSong.songUser
    //   songUserIdRef.current = eachSong.songUser._id
    //   likesRef.current.innerHTML= eachSong.songLikes.length
    //   console.log(eachSong.songUser)
    // }

    return (
      <InView
        as="li"
        onChange={(inView, entry) => {
          console.log('Inview:', inView, entry.target)
          SONG = eachSong
          audioRef.current.src = eachSong.songURL
          // profilePicRef.current.src = eachSong.songUser.picture
          // songRef.current = eachSong.songUser
          // songUserIdRef.current = eachSong.songUser._id
          // likesRef.current.innerHTML= eachSong.songLikes.length
          console.log(eachSong.songUser)
        }}
        key={eachSong.songUser._id}
        // ref={setRefs}
        className="video-pane"
        style={{ backgroundImage: `url('${gradientbg}'), url('${eachSong.shorts}')` }}
        >
        <div className="last-div"></div>
        <div className="text-container">
          <div className="udt-1-container">
            <p className="ud-text udt-1"> 
              <span style={{ color: "#ec6aa0" }}>
                {eachSong.songUser.userName}
              </span>
            </p>
          </div>
          <div className="udt-2-container">
            <p className="ud-text udt-2">
              {eachSong.songName}
            </p>
          </div>
          <div className="udt-3-container">
            <p className="ud-text udt-3">
              {eachSong.caption ? eachSong.caption : "no caption for this flow"}
            </p>
          </div>
        </div>
      </InView>
    );
  }
  
  const showSongs = () => {
    return thisFeedSongs.map((eachSong, i) => {
      eachSong.shorts = getRandomBackground();
      return <DisplaySong i={i} {...eachSong} />;
    });
  };
  const showExploreSongs = () => {
    return exploreFeedSongs.map((eachSong, j) => {
      eachSong.shorts = getRandomBackground();
      return <DisplaySong j={j} {...eachSong} />
    })
  }

  // const getSocialFeed = () => {
  //   page === 1 ? (page = 0) : (page = 1);
  //   console.log("GET SOCIAL FEED SONGS FUNCTION");
  // };
  return (
      <div className="SocialFeed">
        <div ref={windowRef} className="social-panel">
          <CSSTransition 
            in={toggleExplore}
            key={'key1'}
            classNames={transClass()}
            unmountOnExit
            timeout={800}
            >
            <ul className="video-scroll-container">
              {showExploreSongs()}
            </ul>
          </CSSTransition>

          <CSSTransition
            in={toggleSocial}
            key={'key2'}
            classNames={transClass()}
            unmountOnExit
            timeout={800}
            >
            <ul className="video-scroll-container">
              {showSongs()}
            </ul>
          </CSSTransition>

          <div className="video-details-container">
            <div className="transparent-test">
              <div className="user-details-container">
                <div className="user-details-inset">
                </div>
              </div>
              <div className="user-profile-image">
                <div className="user-profile-inset social-p">
                  <div className="nav-buttons-inset inset-social-p">
                    <img className="button-icons bi-play" src={play} onClick={handlePlayPause}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SearchBackup popUpSearchRef={popUpSearchRef} 
                      dumbSearchRef={dumbSearchRef} 
                      opacitySearchRef3={opacitySearchRef3} 
                      />
        <Comments popUpRef={popUpRef} 
                  opacityRef1={opacityRef1} 
                  opacityRef2={opacityRef2} 
                  opacityRef3={opacityRef3}
                  />
        <NavBar popUpSearch={popUpSearch} 
                popUpComments={popUpComments} 
                searchBtn={searchBtn} 
                commentBtn={commentBtn}

                />
        <audio ref={audioRef} id='damn'></audio>
      </div>
    )
  }

export default SocialFeed;
