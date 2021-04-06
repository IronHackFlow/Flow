import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, useLocation, Redirect } from "react-router-dom";
import { useInView } from "react-intersection-observer";

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
          navDisplayed, setNavDisplayed,
          searchBtn, commentBtn
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

  const songUserIdRef = useRef();
  const songRef = useRef(thisFeedSongs[0]);
  const audioRef = useRef();
  const windowRef = useRef();
  const profilePicRef = useRef();
  const likesRef = useRef();


  useEffect(() => {
    if (location.pathname === "/explore-feed") {
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
  const viewRef = useRef()


  function DisplaySong(eachSong) {
    const [inViewRef, inView, entry] = useInView({
      threshold: .8,
      initialInView: true,
    });

    const setRefs = useCallback(
      (node) => {
        viewRef.current = { node: node, songUser: eachSong.songUser };
        inViewRef(node)
      },
      [inViewRef],
    )
    if (inView) {
      SONG = eachSong;
      audioRef.current.src = eachSong.songURL
      profilePicRef.current.src = eachSong.songUser.picture
      songRef.current = eachSong.songUser
      songUserIdRef.current = eachSong.songUser._id
      likesRef.current.innerHTML= eachSong.songLikes.length
    }

    return (
      <li
        key={eachSong.songUser._id}
        id={eachSong.songUser._id}
        ref={setRefs}
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
      </li>
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
        
        <SearchBackup />
        <Comments />
        <NavBar />
        <audio ref={audioRef} id='damn'></audio>
      </div>
    )
  }

export default SocialFeed;
