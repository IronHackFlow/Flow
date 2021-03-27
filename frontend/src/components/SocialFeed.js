import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Redirect } from "react-router-dom";
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
import Search from "../components/Search";

let SONG = {};
let SONGUSER = {}

function SocialFeed(props) {
  const { user, setUser, userViewed, setUserViewed, navDisplayed, setNavDisplayed } = React.useContext(
    TheContext
  );

  // axios.get();
  let page = 1;
  let page2 = 1
  let userUser = "";
  let songUsersArr = [];

  const [thisFeedSongs, setThisFeedSongs] = useState([]);
  const [exploreFeedSongs, setExploreFeedSongs] = useState([])
  const [userForSong, setUserForSong] = useState({});
  const [activeSong, setActiveSong] = useState({});
  const [writer, setWriter] = useState();
  const [comment, setComment] = useState();
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);
  const [likes, setLikes] = useState(0)
  const [bg, setBg] = useState('')
  const [toggleExplore, setToggleExplore] = useState(false);
  const [toggleSocial, setToggleSocial] = useState(true);

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

  // useEffect(() => {
  //     socialRim.current.style.animation = "rim .5s linear forwards"
  //     socialOut.current.style.animation = "out .5s linear forwards"
  //     socialIn.current.style.animation = "in .5s linear forwards"
  //     socialIcon.current.style.animation = "iconScale .5s linear forwards"
  // }, [])

  const menuDown = (whichMenu) => {
    if (whichMenu == 'search') {
    searchBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
    popUpSearchRef.current.style.height = "0px";
    windowRef.current.style.bottom = "20%";
    opacitySearchRef3.current.style.opacity = 0;
    dumbSearchRef.current.style.opacity = 0;
    setSearchPoppedUp(false);
    }
    else if (whichMenu == 'comment') {
      commentBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
      popUpRef.current.style.height = "0px";
      windowRef.current.style.bottom = "20%";
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
    windowRef.current.style.bottom = "70%";
    setSearchPoppedUp(true);
    }
    else if (whichMenu == 'comment') {
      commentBtn.current.style.boxShadow = "inset 2px 2px 3px #3d3f3f, inset -2px -2px 3px #989898"
      opacityRef1.current.style.opacity = 1;
      opacityRef2.current.style.opacity = 1;
      opacityRef3.current.style.opacity = 1;
      popUpRef.current.style.height = "50%";
      windowRef.current.style.bottom = "70%";
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
  useEffect(() => {
    if (navDisplayed == true) {
      menuDown('search')
      menuDown('comment')
    }
  })

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((usersSongs) => {
        setThisFeedSongs(usersSongs.data);
        console.log("inside useeffect", thisFeedSongs);
      })
      .catch(console.error);
  }, [page]);

  useEffect(() => {
    actions
      .getMostLikedSongs()
      .then((exploreSongs) => {
        exploreSongs.data.reverse()
        setExploreFeedSongs(exploreSongs.data)
        console.log("inside explore useeffect", exploreFeedSongs)
      })
      .catch(console.error);
  }, [page2]);

// const getSongUsers = (theUserId) => {
//     console.log('HEY HEY HEY HEY HEY HEY', theUserId )
//     actions
//     .getAUser(theUserId)
//     .then((useUser) => {
//         setUserForSong(useUser.data)
//     })
//     .catch(console.error)
// }git add

// useEffect(() => {
//     actions
//     .getAUser(userUser)
//     .then((useUser) => {
//         setUserForSong(useUser.data)
//     })
//     .catch(console.error)
// }, [userUser]);



  // const [userForSong, setUserForSong] = useState({});

  // const [activeSong, setActiveSong] = useState({});

  // const getUserName = (id) => {
  //   actions
  //     .getAUser(id)
  //     .then((name) => {
  //       console.log(`@${name.data.userName}`);
  //     })
  //     .catch(console.error);
  // };

  let gifsCopy = [...gifsArr]

  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    // gifsCopy.splice(index, 1)
    // while (!gifsCopy.includes(gifsCopy[index])) {
      return gifsCopy[index].url
    // }
  }

  const handlePlayPause=()=>{
    if(audioRef.current.paused){
     audioRef.current.play()
    }
    else {
     audioRef.current.pause()
   }
  }
  // const profilePicRefs = useRef()
  // useEffect(() => {

  //   profilePicRefs.current = SONG.songUser._id
  // }, [])
  // const linkToProfileRef = useRef()
  // const  [profileLink, setProfileLink] = useState({})

  function DisplaySong(eachSong) {
    // const [ref, inView] = useInView({
    //   threshold: .5,
    // });
    const ref = useRef()
    const [inViewRef, inView] = useInView({
      threshold: .8,
    });
    const setRefs = useCallback(
      (node) => {
        ref.current = node;
        inViewRef(node)
      },
      [inViewRef],
    )
    if (inView) {
      // eachSong.setActiveSong(eachSong)
      SONG = eachSong;
      audioRef.current.src = eachSong.songURL
      profilePicRef.current.src = eachSong.songUser.picture
      likesRef.current.innerHTML= eachSong.songLikes.length
      // setProfileLink(eachSong.songUser)
    } 
    else {}

    return (
      <li
        key={eachSong.songUser._id}
        ref={setRefs}
        className="video-pane"
        style={{
          backgroundImage: `url('${gradientbg}'), url('${eachSong.shorts}')`
        }}
      >
        <div className="last-div"></div>
        <div className="text-container">
          <p className="ud-text udt-1">
            <span style={{ color: "#ec6aa0" }}>
              {eachSong.songUser.userName}
            </span>
          </p>
          <p className="ud-text udt-2">
            {eachSong.songName}
          </p>
          <p className="ud-text udt-3">
            {eachSong.caption ? (
              <p>{eachSong.caption}</p>
            ) : (
              <p>no caption for this flow</p>
            )}
          </p>
        </div>
      </li>
    );
  }

  const showSongs = () => {
    return thisFeedSongs.map((eachSong, i) => {
     eachSong.shorts = getRandomBackground();

      // setUserUser(eachSong)
      // console.log(userForSong)
      return <DisplaySong i={i} {...eachSong} />;
    });
  };
 const showExploreSongs = () => {
   return exploreFeedSongs.map((eachSong, j) => {
     eachSong.shorts = getRandomBackground();
     return <DisplaySong j={j} {...eachSong} />
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
  // const profilePicRoute = (info) => {
  //   const mappedRes2 = info.data.map((elem) => {
  //     return { userName: elem.userName, picture: elem.picture, profile: elem};
  //   });
  //   return mappedRes2.map((ele) => {
  //     console.log(ele)
  //   }
  // }


  // const toggleExploreFeed = () => {
  //   if (toggleExplore === false) {
  //     setToggleExplore(true)
  //     setToggleSocial(false)

  //   }
  // }
  // const toggleFeed = () => {
  //   if (toggleSocial === false) {
  //     setToggleSocial(true)
  //     setToggleExplore(false)
  //   }
  //   else {
  //     setToggleExplore(true)
  //     setToggleSocial(false)
  //   }
  // }

  const showNavBar = () => {
    return (
      <footer>
        <div className="social-buttons">
          <div className="social-list">
            <div className="individual-btn">
              <div className="individual-profile-pic">
                <Link to={{pathname: `/profile/other/${SONG.songUser?._id}`, profInfo: SONG.songUser}}>
                  <img className="prof-pic" src={SONG.songUser?.picture} ref={profilePicRef} alt=''/>
                  {console.log()}
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
                <div className="nav-buttons-inset" ref={exploreIn} onClick={() => {setToggleExplore(true); setToggleSocial(false)}}>
                    <img className="button-icons bi-explore" ref={exploreIcon} src={explore} alt="explore"></img>
                </div>
              </div>
            </div>

            <div className="nav-buttons-rim" ref={socialRim}>
              <div className="nav-buttons-outset" ref={socialOut}>
                <div className="nav-buttons-inset" ref={socialIn}
                     onClick={() => {setToggleSocial(true); setToggleExplore(false)}}>
                  <img className="button-icons bi-social" src={social} ref={socialIcon}></img>
                </div>
              </div>
            </div>

            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={user._id ? ("/profile") : ("/auth")}>
                    <img className="button-icons bi-profile-social" src={avatar3}></img>
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
        <Search dumbSearch = {dumbSearchRef}/>

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
    actions.addComment({comment,SONG})
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
    console.log(SONG)
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

  const displayComments=()=>{
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
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder='Drop yo comment' 
                    ></input>
                  <button></button>
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
  const transClass = () => {
    if (toggleSocial === true) {
      return "fade2"
    }
    if (toggleExplore === true) {
      return "fade"
    }
  }
  return (
    <div className="SocialFeed">
      <div ref={windowRef} className="social-panel">
        <CSSTransition 
          in={toggleExplore}
          key={'key1'}
          mountOnEnter
          classNames={transClass()}
          unmountOnExit
          timeout={1000}
          onEnter={()=> {
            exploreRim.current.style.animation = "rim .5s linear forwards"
            exploreOut.current.style.animation = "out .5s linear forwards"
            exploreIn.current.style.animation = "in .5s linear forwards"
            exploreIcon.current.style.animation = "iconScale .5s linear forwards"
          }}
          onExit={()=> {
            exploreRim.current.style.animation = "none"
            exploreOut.current.style.animation = "none"
            exploreIn.current.style.animation = "none"
            exploreIcon.current.style.animation = "none"
          }}
          >
          <ul className="video-scroll-container">
            {showExploreSongs()}
            <CSSTransition
              in={toggleExplore}
              key={'key3'}
              classNames="fade3"
              timeout={400}>
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
            </CSSTransition>
          </ul>
        </CSSTransition>
        <CSSTransition
          in={toggleSocial}
          key={'key2'}
          classNames={transClass()}
          mountOnEnter
          unmountOnExit
          onEnter={()=> {
            socialRim.current.style.animation = "rim .5s linear forwards"
            socialOut.current.style.animation = "out .5s linear forwards"
            socialIn.current.style.animation = "in .5s linear forwards"
            socialIcon.current.style.animation = "iconScale .5s linear forwards"
          }}
          onExit={()=> {
            socialRim.current.style.animation = "none"
            socialOut.current.style.animation = "none"
            socialIn.current.style.animation = "none"
            socialIcon.current.style.animation = "none"
          }}
          timeout={1000}>
          <ul className="video-scroll-container">
            {showSongs()}
            <CSSTransition
              in={toggleSocial}
              key={'key4'}
              classNames="fade3"
              timeout={400}>
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
            </CSSTransition>
          </ul>
        </CSSTransition>
      </div>
      
      {displayComments()}
      {displaySearch()}
      {showNavBar()}
      <audio ref={audioRef} id='damn'></audio>
    </div>
    )
  }

export default SocialFeed;
