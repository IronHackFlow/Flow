import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, useLocation, Redirect } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import TheContext from "../TheContext";
import actions from "../api";
import gradientbg from "../images/gradient-bg-2.png";
import play from "../images/play.svg";
import mic from "../images/record2.svg";
import avatar3 from "../images/avatar3.svg";
import social from "../images/social.svg";
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import search from "../images/search.svg";
import heart2 from "../images/heart2.svg";
import explore from "../images/explore.svg";
import gifsArr from "../images/gifs.json";
import OriginalSearch from "./OriginalSearch";

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
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);
  const [likes, setLikes] = useState(0);
  const [toggleExplore, setToggleExplore] = useState();
  const [toggleSocial, setToggleSocial] = useState();

  const songUserIdRef = useRef();
  const songRef = useRef(thisFeedSongs[0]);
  const audioRef = useRef();
  const windowRef = useRef();
  const popUpRef = useRef();
  const commentBtn = useRef();
  const opacityRef1 = useRef();
  const opacityRef2 = useRef();
  const opacityRef3 = useRef();
  const popUpSearchRef = useRef();
  const searchBtn = useRef();
  const opacitySearchRef3 = useRef();
  const dumbSearchRef = useRef();
  const socialRim = useRef();
  const socialOut = useRef();
  const socialIn = useRef();
  const socialIcon = useRef();
  const exploreRim = useRef();
  const exploreOut = useRef();
  const exploreIn = useRef();
  const exploreIcon = useRef();
  const profilePicRef = useRef();
  const likesRef = useRef();


  // setTimeout(() => {
  //   let pOne = document.querySelector('.udt-1')
  //   let pTwo = document.querySelector('.udt-2')
  //   let pThree = document.querySelector('.udt-3')
  //   let pOneWidth = document.querySelector('.udt-1').offsetWidth
  //   let pTwoWidth = document.querySelector('.udt-2').offsetWidth
  //   let pThreeWidth = document.querySelector('.udt-3').offsetWidth
  //   const pArray = [pOneWidth, pTwoWidth, pThreeWidth]
  //   pArray.sort((a, b) => a - b)
  //   let durationSet = (pArray[2] / 25)
  //   let durationSetMs = durationSet * 1000
  //   let middleDuration = (pArray[1] / 25)
  //   let smallDuration = (pArray[0] / 25)
  //   let pxPerSec = ((pArray[2] + 100) / durationSet)
  //   let introAnimDur = (100 / pxPerSec)
  //   let smallpOutroDur = (pArray[0] / pxPerSec)
  //   let midpOutroDur = (pArray[1] / pxPerSec)
  //   let smallpOutroDel = durationSet - smallpOutroDur
  //   let midpOutroDel = durationSet - midpOutroDur
  //   setInterval(() => {
  //     pOne.style.animation = "none"
  //     pTwo.style.animation = "none"
  //     pThree.style.animation = `floatText ${durationSet}s linear infinite`
  //     pOne.style.animation = `floatStop ${introAnimDur}s linear forwards`
  //     pTwo.style.animation = `floatStop ${introAnimDur}s linear forwards`
  //     setTimeout(pOne.style.animation = `stopFloat ${smallpOutroDur}s linear`, smallpOutroDel)
  //     setTimeout(pTwo.style.animation = `stopFloat ${midpOutroDur}s linear`, midpOutroDel)
  //   }, durationSetMs)
  // }, 1000)

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
    if (toggleExplore === true){
      exploreRim.current.style.animation = "rim .5s linear forwards"
      exploreOut.current.style.animation = "out .5s linear forwards"
      exploreIn.current.style.animation = "in .5s linear forwards"
      exploreIcon.current.style.animation = "iconScale .5s linear forwards"
      socialRim.current.style.animation = "none"
      socialOut.current.style.animation = "none"
      socialIn.current.style.animation = "none"
      socialIcon.current.style.animation = "none"
    }
    else {
      socialRim.current.style.animation = "rim .5s linear forwards"
      socialOut.current.style.animation = "out .5s linear forwards"
      socialIn.current.style.animation = "in .5s linear forwards"
      socialIcon.current.style.animation = "iconScale .5s linear forwards"
      exploreRim.current.style.animation = "none"
      exploreOut.current.style.animation = "none"
      exploreIn.current.style.animation = "none"
      exploreIcon.current.style.animation = "none"
    }
  }, [toggleExplore, toggleSocial])

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
    // const [ref, inView] = useInView({
    //   threshold: .5,
    // });

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
      // viewRef.current.songUser = eachSong.songUser
    }

    return (
      <li
        id={eachSong.songUser._id}
        ref={setRefs}
        className="video-pane"
        style={{ backgroundImage: `url('${gradientbg}'), url('${eachSong.shorts}')` }}
      >
        <div className="last-div"></div>
        <div className="text-container" style={{position: 'relative', bottom: '-10.5%', left: '-10%', color: 'white', textAlign: 'left'}}>
          <div className="udt-1-container" style={{height: '20px'}}>
            <p className="ud-text udt-1"> 
              <span style={{ color: "#ec6aa0" }}>
                {eachSong.songUser.userName}
              </span>
            </p>
          </div>
          <div className="udt-2-container" style={{height: '20px'}}>
            <p className="ud-text udt-2">
              {eachSong.songName}
            </p>
          </div>
          <div className="udt-3-container" style={{height: '20px'}}>
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
      return <DisplaySong key={i} {...eachSong} />;
    });
  };
  const showExploreSongs = () => {
    return exploreFeedSongs.map((eachSong, j) => {
      eachSong.shorts = getRandomBackground();
      return <DisplaySong key={j} {...eachSong} />
    })
  }

  const getSocialFeed = () => {
    page === 1 ? (page = 0) : (page = 1);
    console.log("GET SOCIAL FEED SONGS FUNCTION");
  };

  const followUser = () => {
    console.log(user, userViewed);
    document.getElementById("notify").click();
    const followData = { user1: user._id, user2: userViewed._id };
    console.log("profile follow user function ", followData);
    actions
      .addFollow(followData)
      .then((somethingreturnedfromapi) => {
        document.getElementById("notify").click();
      })
      .catch(console.error);
  };

  const likePost = () => {
    console.log(user, userViewed);
    document.getElementById("notifyLike").click();
    const likeData = { user1: user._id, songLiked: SONG._id };
    actions
      .addLike(likeData)
      .then((whatever) => {
        document.getElementById("notifyLike").click();
      })
      .catch(console.error);
  }

  const showNavBar = () => {
    return (
      <footer>
        <div className="social-buttons">
          <div className="social-list">
            <div className="individual-btn">
              <div className="individual-profile-pic">
                <Link to={{pathname: `/profile/other/${SONG.songUser?._id}`, profInfo: SONG.songUser}} ref={songRef}>
                  <img className="prof-pic" src={SONG.songUser?.picture} ref={profilePicRef} alt=''/>
                </Link>
              </div>
            </div>

            <div className="like-comment-container">
              <div className="individual-btn" onClick={followUser}>
                <img className="social-icons follow" src={follow}></img>
              </div>
              <div className="individual-btn" onClick={likePost}>
                <img className="social-icons heart" src={heart2}></img>
                <div className="likes-number-container">
                    <p ref={likesRef}></p>
                </div>
              </div>
              <div className="individual-btn" ref={searchBtn} onClick={popUpSearch}>
                <img className="social-icons heart" src={search}></img>
              </div>
              <div className="individual-btn" ref={commentBtn} onClick={popUpComments}>
                <img className="social-icons comment" src={comments}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="nav-buttons">
          <div className="nav-list">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")}>
                    <img className="button-icons bi-record" src={mic}></img>
                  </Link>
                </div>
              </div>
            </div>

            <div className="nav-buttons-rim" ref={exploreRim}>
              <div className="nav-buttons-outset" ref={exploreOut}>
                <div className="nav-buttons-inset" ref={exploreIn} onClick={() => { 
                                                                      setToggleExplore(true)
                                                                      setToggleSocial(false)
                                                                    }}>
                    <img className="button-icons bi-explore" ref={exploreIcon} src={explore} alt="explore"></img>
                </div>
              </div>
            </div>

            <div className="nav-buttons-rim" ref={socialRim}>
              <div className="nav-buttons-outset" ref={socialOut}>
                <div className="nav-buttons-inset" ref={socialIn}
                     onClick={() => {                       
                        setToggleExplore(false)
                        setToggleSocial(true)
                      }}>
                  <img className="button-icons bi-social" src={social} ref={socialIcon}></img>
                </div>
              </div>
            </div>

            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={user._id ? ("/profile") : ("/auth")}>
                    <img className="button-icons bi-profile" src={avatar3}></img>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  const displaySearch = () => {
    return (
      <div ref={popUpSearchRef} className="comment-pop-out">
        <OriginalSearch dumbSearch = {dumbSearchRef}/>

        <div
          ref={opacitySearchRef3}
          style={{ opacity: "0" }}
          className="bottom-bar"
        >
          <div className="inner-bar"></div>
        </div>
      </div>
    );
  };

  const handleSubmit =(e)=>{
    e.preventDefault()
    actions.addComment({comment, SONG})
  }

  const getCommentWriter=(num)=>{
    actions
    .getAUser({id: num})
    .then((res)=>{
      setWriter( `@${res.data.userName}`)
      
    }).catch((e)=>{
      console.log('failed to get name')
    })
  }

  const renderEachComment = ()=>{
    if(!SONG.songComments){
    }
    else {
      return SONG.songComments.map((each)=>{

        getCommentWriter(each.commUser)
        return (
          <div className="comment-list">
            <div className="comment-list-inner">
              <p className="comment-username">
                  {writer}
              </p>
              <p className="comment-text">
                {each.comment}
              </p>
            </div>
          </div>
        )
      })
    }
  }

  const displayComments = () => {
    return(
    <div ref={popUpRef} className="comment-pop-out">
      <div className="inner-com">

        <div ref={opacityRef1} style={{opacity: '0'}} className="com-cont-1">
          <div className="input-container">
            <div className="input-inset">
              <form className="social-comment-form" onSubmit={handleSubmit}>
                <input
                    className="social-comment-input" 
                    type='text' 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Drop yo comment' 
                    ></input>
              </form>
            </div>
          </div>
        </div>

        <div ref={opacityRef2} style={{opacity: '0'}} className="com-cont-2">
          <div className="comments-container">
            <div className="comment-list-container">
               {renderEachComment()}
            </div>
          </div>
        </div>
      </div>

      <div ref={opacityRef3} style={{ opacity: "0" }} className="bottom-bar">
        <div className="inner-bar"></div>
      </div>
    </div>
    )
  }

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
      
      {displayComments()}
      {displaySearch()}
      {showNavBar()}
      <audio ref={audioRef} id='damn'></audio>
    </div>
    )
  }

export default SocialFeed;
