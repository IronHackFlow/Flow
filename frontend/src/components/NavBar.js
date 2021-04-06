import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom'
import actions from "../api"
import mic from "../images/record2.svg";
import avatar3 from "../images/avatar3.svg";
import social from "../images/social.svg";
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import search from "../images/search.svg";
import heart2 from "../images/heart2.svg";
import explore from "../images/explore.svg";
import TheContext from "../TheContext";

function NavBar(props) {
  const {
    user, userViewed,
    navDisplayed, windowRef,
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore,
    profilePicRef, likesRef, popUpSearchRef
    } = React.useContext(
    TheContext
  );
  const [poppedUp, setPoppedUp] = useState(false);
  const [searchPoppedUp, setSearchPoppedUp] = useState(false);

  const commentBtn = useRef();
  const searchBtn = useRef();
  const socialRim = useRef();
  const socialOut = useRef();
  const socialIn = useRef();
  const socialIcon = useRef();
  const exploreRim = useRef();
  const exploreOut = useRef();
  const exploreIn = useRef();
  const exploreIcon = useRef();
  const popUpRef = useRef();
  const opacityRef1 = useRef();
  const opacityRef2 = useRef();
  const opacityRef3 = useRef();
  const dumbSearchRef = useRef();  
  const opacitySearchRef3 = useRef();  

  const [refStyles, setRefStyles] = useState({})

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
    popUpSearchRef.current.style.height = "0px"
  }, [popUpSearchRef])

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

  // const likePost = () => {
  //   console.log(user, userViewed);
  //   document.getElementById("notifyLike").click();
  //   const likeData = { user1: user._id, songLiked: SONG._id };
  //   actions
  //     .addLike(likeData)
  //     .then((whatever) => {
  //       document.getElementById("notifyLike").click();
  //     })
  //     .catch(console.error);
  // }

  // onClick={likePost}
    return (
      <footer>
        <div className="social-buttons">
          <div className="social-list">

            <div className="individual-btn">
              <div className="individual-profile-pic">
                {/* <Link to={{pathname: `/profile/other/${SONG.songUser?._id}`, profInfo: SONG.songUser}} ref={songRef}>
                  <img className="prof-pic" src={SONG.songUser?.picture} ref={profilePicRef} alt=''/>
                </Link> */}
              </div>
            </div>  

            <div className="like-comment-container">
              <div className="individual-btn" onClick={followUser}>
                <img className="social-icons follow" src={follow}></img>
              </div>
              <div className="individual-btn" >
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
}

export default NavBar;