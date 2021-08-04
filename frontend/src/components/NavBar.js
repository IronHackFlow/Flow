import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import actions from "../api";
import TheContext from "../TheContext";
import mic from "../images/modern-mic.svg";
import avatar from "../images/avatar.svg";
import social from "../images/social.svg";
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import play from "../images/play.svg";
import search from "../images/search.svg";
import like from "../images/heart2.svg";
import explore from "../images/explore.svg";


function NavBar(props) {
  const {
    user, userViewed, songId, 
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore,
    toggleProfile, setToggleProfile,
    songComments
    } = React.useContext(
    TheContext
  );

  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  const socialBtnRef1= useRef();
  const socialBtnRef2 = useRef();
  const socialBtnRef3 = useRef();
  const socialBtnRef4 = useRef();
  const socialBtnRef5 = useRef();
  const exploreBtnRef1 = useRef();
  const exploreBtnRef2 = useRef();
  const exploreBtnRef3 = useRef();
  const exploreBtnRef4 = useRef();
  const exploreBtnRef5 = useRef();
  const profileBtnRef1 = useRef();
  const profileBtnRef2 = useRef();
  const profileBtnRef3 = useRef();
  const profileBtnRef4 = useRef();
  const profileBtnRef5 = useRef();
  const followBtnRef1 = useRef();
  const followBtnRef2 = useRef();
  const followBtnRef3 = useRef();

  useEffect(() => {
    if (toggleProfile === true) {
      profileBtnRef1.current.style.background = "#ec6aa0";
      profileBtnRef1.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
      profileBtnRef1.current.style.border = "1px solid #ec6aa0"
      profileBtnRef1.current.style.transition = "all .4s"
      profileBtnRef2.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
      profileBtnRef2.current.style.height = "38px"
      profileBtnRef2.current.style.width = "38px"
      profileBtnRef2.current.style.transition = "all .4s"
      profileBtnRef3.current.style.boxShadow = "none"
      profileBtnRef4.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      profileBtnRef5.current.style.color = "white"
    }
    else if (toggleExplore === true) {
      exploreBtnRef1.current.style.background = "#ec6aa0";
      exploreBtnRef1.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
      exploreBtnRef1.current.style.border = "1px solid #ec6aa0"
      exploreBtnRef1.current.style.transition = "all .4s"
      exploreBtnRef2.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
      exploreBtnRef2.current.style.height = "38px"
      exploreBtnRef2.current.style.width = "38px"
      exploreBtnRef2.current.style.transition = "all .4s"
      exploreBtnRef3.current.style.boxShadow = "none"
      exploreBtnRef4.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      exploreBtnRef5.current.style.color = "white"

      socialBtnRef1.current.style.background = "initial"
      socialBtnRef1.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      socialBtnRef1.current.style.border = "none"
      socialBtnRef1.current.style.transition = "all .4s"
      socialBtnRef2.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      socialBtnRef2.current.style.height = "40px"
      socialBtnRef2.current.style.width = "40px"
      socialBtnRef2.current.style.transition = "all .4s"
      socialBtnRef3.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      socialBtnRef4.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
      socialBtnRef5.current.style.color = "#ff8ebd"

      profileBtnRef1.current.style.background = "initial"
      profileBtnRef1.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      profileBtnRef1.current.style.border = "none"
      profileBtnRef1.current.style.transition = "all .4s"
      profileBtnRef2.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      profileBtnRef2.current.style.height = "40px"
      profileBtnRef2.current.style.width = "40px"
      profileBtnRef2.current.style.transition = "all .4s"
      profileBtnRef3.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      profileBtnRef4.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
      profileBtnRef5.current.style.color = "#ff8ebd"
    }
    else {
      socialBtnRef1.current.style.background = "#ec6aa0";
      socialBtnRef1.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
      socialBtnRef1.current.style.border = "1px solid #ec6aa0"
      socialBtnRef1.current.style.transition = "all .4s"
      socialBtnRef2.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
      socialBtnRef2.current.style.height = "38px"
      socialBtnRef2.current.style.width = "38px"
      socialBtnRef2.current.style.transition = "all .4s"
      socialBtnRef3.current.style.boxShadow = "none"
      socialBtnRef4.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      socialBtnRef5.current.style.color = "white" 

      exploreBtnRef1.current.style.background = "initial"
      exploreBtnRef1.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      exploreBtnRef1.current.style.border = "none"
      exploreBtnRef1.current.style.transition = "all .4s"
      exploreBtnRef2.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      exploreBtnRef2.current.style.height = "40px"
      exploreBtnRef2.current.style.width = "40px"
      exploreBtnRef2.current.style.transition = "all .4s"
      exploreBtnRef3.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      exploreBtnRef4.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
      exploreBtnRef5.current.style.color = "#ff8ebd"

      profileBtnRef1.current.style.background = "initial"
      profileBtnRef1.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      profileBtnRef1.current.style.border = "none"
      profileBtnRef1.current.style.transition = "all .4s"
      profileBtnRef2.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      profileBtnRef2.current.style.height = "40px"
      profileBtnRef2.current.style.width = "40px"
      profileBtnRef2.current.style.transition = "all .4s"
      profileBtnRef3.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      profileBtnRef4.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
      profileBtnRef5.current.style.color = "#ff8ebd"
    }
  }, [toggleExplore, toggleSocial, toggleProfile])

  useEffect(() => {
    setTotalFollowers(props.songUserFollowers?.length)
    // props.songUserFollowers?.forEach((each) => {
    //   user.userFollows.forEach((eachUser) => {
    //     if(eachUser._id === each) {
    //       console.log('lol')
    //       followBtnRef1.current.style.boxShadow = "inset 2px 2px 3px #3e3e3e, inset -2px -2px 3px #b7b6b6"
    //       followBtnRef1.current.style.background = "#ec6aa0"
    //       followBtnRef2.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
    //       followBtnRef3.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
    //     }
    //     else {
    //       followBtnRef1.current.style.boxShadow = "2px 2px 3px #3e3e3e, -2px -2px 3px #b7b6b6"
    //       followBtnRef1.current.style.background = "initial"
    //       followBtnRef2.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
    //       followBtnRef3.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
    //     }
    //   })
    // })
  }, [props.songUserFollowers])

  useEffect(() => {
    setTotalLikes(props.songLikes?.length)
  }, [props.songLikes])

  const followCheck = () => {
    if (user._id === userViewed._id) {
      console.log(`You can't follow yourself lol`)
      return null
    }
    actions
      .getAUser({ id: user._id })
      .then((res) => {
        let deleteObj = null

        res.data.userFollows.forEach((each) => {
          if (each.followed === userViewed._id) {
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

  return (
    <div className="NavBar">
      <div className="social-buttons" style={{display: props.socialDisplay}}>
        <div className="social-list">
          <div className="social-list-inner">
          {/* <div className="two-btn-container">
            <div className="individual-container">
              <div className="individual-btn" onClick={followCheck} ref={followBtnRef1}>
                <img className="social-icons si-follow" src={follow} ref={followBtnRef2} alt="follow user icon" />
              </div>

              <div className="individual-text" ref={followBtnRef3}>
                <p style={{color: "white"}}>{totalFollowers}</p>
                <p>Follow</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" onClick={likeCheck}>
                <img className="social-icons si-like" src={like} alt="like post icon" />
              </div>

              <div className="individual-text">
                <p style={{color: "white"}}>{totalLikes}</p>
                <p>Like</p>
              </div>
            </div>
          </div> */}
          <div className="two-btn-container">
          <div className="two-btn-container2">
            {/* <div className="individual-container">
              <div className="individual-btn" ref={props.searchBtn} onClick={props.popUpSearch}>
                <img className="social-icons si-search" src={search} alt="search user icon" />
              </div>
              <div className="individual-text" style={{marginTop: "15px"}}>
                <p>Search</p>
              </div>
            </div> */}
            <div className="individual-container">
              <div className="individual-btn" onClick={followCheck} ref={followBtnRef1}>
                <img className="social-icons si-follow" src={follow} ref={followBtnRef2} alt="follow user icon" />
              </div>

              <div className="individual-text" ref={followBtnRef3}>
                <p style={{color: "white"}}>{totalFollowers}</p>
                <p>Follow</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" onClick={likeCheck}>
                <img className="social-icons si-like" src={like} alt="like post icon" />
              </div>

              <div className="individual-text">
                <p style={{color: "white"}}>{totalLikes}</p>
                <p>Like</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" ref={props.commentBtn} onClick={props.popUpComments}>
                <img className="social-icons si-comment" src={comments} alt="comment on post icon" />
              </div>

              <div className="individual-text">
                <p style={{color: "white"}}>{songComments.length}</p>
                <p>Comment</p>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
          <div className="user-details-inset">
              <div className="text-container">
                <div className="udt-1-container">
                  <div className="individual-container-pic">
                    <div className="individual-btn-prof">
                      <Link 
                        to={{pathname: `/profile/${props.userForSong?._id}`, profileInfo: props.userForSong}} 
                        className="individual-profile-pic"
                        onClick={() => setToggleProfile(true)}>
                        <img className="prof-pic" src={props.userForSong?.picture} alt="user in view profile" ref={props.profilePicRef} />
                      </Link>
                    </div>
                  </div>
                  <div className="song-title">
                    <div className="song-title-inner">
                    <p className="ud-text udt-1" style={{ color: "#ec6aa0"}}> 
                      song name - <span style={{color: "white", fontSize: "13px", fontWeight: "normal"}}></span>
                    </p>
                    <div className="udt-2-container">
                    <p className="ud-text udt-2">
                      no caption for this flow
                    </p>
                  </div>
                  <div className="udt-3-container">
                    <p className="ud-text udt-3">

                      5 months ago
                    </p>
                  </div>
                  </div>
                  </div>
                </div>

                <div className="playbutton">
                <div className="playbar">
                    <div className="playbarinner">
                      
                    </div>
                  </div>
                  <div className="playinner">
                    <div className="playbuttonactual">
                      <div className="playinnerest1">
                        <div className="playinnerest2">
                          <div className="playinnerest3">
                            <img className="button-icons bi-play" src={play} alt="play" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


          </div>
          {/* <div className="play-container">
          <div className="play-outset">
            
          </div>
        </div> */}
      </div>

      <div className="navbar_section">
        <div className="navbar_shadow-div-outset">
          <div className="navbar_shadow-div-inset">
            <Link
              to={userViewed._id ? ("/recordingBooth") : ("/auth")}
              className="navbar-btn-container" 
              style={{borderRadius: "40px 8px 8px 40px"}}
              >
              <div className="navbar-btn_shadow-div-inset">
                <div className="navbar-btn_shadow-div-outset">
                  <img className="button-icons bi-record" src={mic} alt="record song icon" />
                </div>
              </div>  
              <div className="navbar-btn-text">
                Record
              </div>
            </Link>

            <Link 
              to="/explore-feed"
              className="navbar-btn-container" 
              ref={exploreBtnRef1}
              onClick={() => { 
                setToggleSocial(false)
                setToggleProfile(false)
                setToggleExplore(true)
              }}>
              <div className="navbar-btn_shadow-div-inset" ref={exploreBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={exploreBtnRef3}>
                  <img className="button-icons bi-explore" src={explore} ref={exploreBtnRef4} alt="explore users icon" />
                </div>
              </div>  
              <div className="navbar-btn-text" ref={exploreBtnRef5}>
                Explore
              </div>
            </Link>

            <Link 
              to={user._id ? ("/social-feed") : ("/auth")}
              className="navbar-btn-container" 
              ref={socialBtnRef1}
              onClick={() => {                       
                setToggleExplore(false)
                setToggleProfile(false)
                setToggleSocial(true)
              }}>
              <div className="navbar-btn_shadow-div-inset" ref={socialBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={socialBtnRef3}>
                  <img className="button-icons bi-social" src={social} ref={socialBtnRef4} alt="social feed icon" />
                </div>
              </div>  
              <div className="navbar-btn-text" ref={socialBtnRef5}>
                Following
              </div>
            </Link>

            <Link
              to={user._id ? {pathname: `/profile/${user._id}`, profileInfo: user} : ("/auth")} 
              className="navbar-btn-container" 
              ref={profileBtnRef1} 
              style={{borderRadius: "8px 40px 40px 8px"}}
              onClick={() => setToggleProfile(true)}
              >
              <div className="navbar-btn_shadow-div-inset" ref={profileBtnRef2}>
                <div className="navbar-btn_shadow-div-outset" ref={profileBtnRef3}>
                  <img className="button-icons bi-profile" src={avatar} ref={profileBtnRef4} alt="user profile icon" />
                </div>
              </div>
              <div className="navbar-btn-text" ref={profileBtnRef5}>
                Profile
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;