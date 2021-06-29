import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
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
    userForSong, setUserForSong,
    songId, setSongId,
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore
    } = React.useContext(
    TheContext
  );

  const socialRim = useRef();
  const socialOut = useRef();
  const socialIn = useRef();
  const socialIcon = useRef();
  const exploreRim = useRef();
  const exploreOut = useRef();
  const exploreIn = useRef();
  const exploreIcon = useRef();

  useEffect(() => {
    if (toggleExplore === true) {
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


  const followUser = () => {
    console.log(user, userViewed);
    document.getElementById("notify").click();
    const followData = { followedUser: userViewed._id, follower: user };
    console.log("profile follow user function ", followData);
    actions
      .addFollow(followData)
      .then((res) => {
        document.getElementById("notify").click();
      })
      .catch(console.error);
  };

  const likePost = () => {
    console.log(user._id, songId);
    // document.getElementById("notifyLike").click();
    // const likeData = { likeUser: user._id, LikerSong: songId };
    actions
      .addLike({likerSong: songId})
      .then((res) => {
        console.log(res, "i liked this!")
        document.getElementById("notifyLike").click();
      })
      .catch(console.error);
  }

    return (
      <footer>
        <div className="social-buttons">
          <div className="social-list">
            <div className="individual-btn">
              <div className="individual-profile-pic">
                <Link to={{pathname: `/profile/other/${props.songForUserId}`, profileInfo: props.songForUserProfile}}>
                  <img className="prof-pic" src={props.songForUserPic} alt="user in view profile" ref={props.profilePicRef} />
                </Link>
              </div>
            </div>  

            <div className="like-comment-container">
              <div className="individual-btn" onClick={followUser}>
                <img className="social-icons follow" src={follow} alt="follow user icon"></img>
              </div>
              <div className="individual-btn" onClick={likePost}>
                <img className="social-icons heart" src={heart2} alt="like post icon"></img>
                <div className="likes-number-container">
                    <p ref={props.likesRef}></p>
                </div>
              </div>
              <div className="individual-btn" ref={props.searchBtn} onClick={props.popUpSearch}>
                <img className="social-icons heart" src={search} alt="search user icon"></img>
              </div>
              <div className="individual-btn" ref={props.commentBtn} onClick={props.popUpComments}>
                <img className="social-icons comment" src={comments} alt="comment on post icon"></img>
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
                    <img className="button-icons bi-record" src={mic} alt="record song icon"></img>
                  </Link>
                </div>
              </div>
            </div>  
            {/* <div className="button-title-container">
              Record
            </div> */}
            <div className="nav-buttons-rim" ref={exploreRim}>
              <div className="nav-buttons-outset" ref={exploreOut}>
                <div className="nav-buttons-inset" ref={exploreIn} onClick={() => { 
                                                                      setToggleSocial(false)
                                                                      setToggleExplore(true)
                                                                    }}>
                    <img className="button-icons bi-explore" src={explore} alt="explore users icon" ref={exploreIcon}></img>
                </div>
              </div>
            </div>  
            {/* <div className="button-title-container">
              Explore
            </div> */}
            <div className="nav-buttons-rim" ref={socialRim}>
              <div className="nav-buttons-outset" ref={socialOut}>
                <div className="nav-buttons-inset" ref={socialIn}
                     onClick={() => {                       
                        setToggleExplore(false)
                        setToggleSocial(true)
                      }}>
                  <img className="button-icons bi-social" src={social} alt="social feed icon" ref={socialIcon}></img>
                </div>
              </div>
            </div>  
            {/* <div className="button-title-container">
              Following
            </div> */}
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={user._id ? ("/profile") : ("/auth")}>
                    <img className="button-icons bi-profile" src={avatar3} alt="user profile icon"></img>
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className="button-title-container">
              Profile
            </div> */}
          </div>
        </div>
      </footer>
    );
}

export default NavBar;