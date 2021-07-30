import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import actions from "../api"
import mic from "../images/record2.svg";
import avatar from "../images/avatar.svg";
import social from "../images/social.svg";
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import search from "../images/search.svg";
import heart2 from "../images/heart2.svg";
import explore from "../images/explore.svg";
import TheContext from "../TheContext";

function NavBar(props) {
  const {
    user, userViewed, songId, 
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore,
    songComments
    } = React.useContext(
    TheContext
  );

  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();

  const socialContainer = useRef();
  const socialRim = useRef();
  const socialOut = useRef();
  const socialIn = useRef();
  const socialIcon = useRef();
  const exploreContainer = useRef();
  const exploreRim = useRef();
  const exploreOut = useRef();
  const exploreIn = useRef();
  const exploreIcon = useRef();
  const followBtn = useRef();

  useEffect(() => {
    setTotalFollowers(props.songUserFollowers?.length)
  }, [props.songUserFollowers])

  useEffect(() => {
    setTotalLikes(props.songLikes?.length)
  }, [props.songLikes])

  // useEffect(() => {
  //   user.userFollows.map((each) => {
  //     if (each.followed === props.userForSong?._id) {
  //       console.log(each.followed)
  //       followBtn.current.style.boxShadow = "rgb(61 63 63) 2px 2px 3px inset, rgb(152 152 152) -2px -2px 3px inset"
  //     }
  //     else {
  //       followBtn.current.style.boxShadow = "3px 3px 5px #3d3f3f, -2px -2px 3px #939597"
  //     }
  //   })
  // }, [props.userForSong, user])

  useEffect(() => {
    if (toggleExplore === true) {
      exploreContainer.current.style.background = "#ec6aa0";
      exploreContainer.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
      exploreContainer.current.style.border = "1px solid #ec6aa0"
      exploreContainer.current.style.transition = "all .4s"
      exploreRim.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
      exploreRim.current.style.height = "42px"
      exploreRim.current.style.width = "42px"
      exploreRim.current.style.transition = "all .4s"
      exploreOut.current.style.boxShadow = "none"
      exploreIcon.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      socialContainer.current.style.background = "initial"
      socialContainer.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      socialContainer.current.style.border = "none"
      socialRim.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      socialRim.current.style.height = "45px"
      socialRim.current.style.width = "45px"
      socialOut.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      socialIcon.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
    }
    else {
      socialContainer.current.style.background = "#ec6aa0";
      socialContainer.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
      socialContainer.current.style.border = "1px solid #ec6aa0"
      socialContainer.current.style.transition = "all .4s"
      socialRim.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
      socialRim.current.style.height = "42px"
      socialRim.current.style.width = "42px"
      socialRim.current.style.transition = "all .4s"
      socialOut.current.style.boxShadow = "none"
      socialIcon.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
      exploreContainer.current.style.background = "initial"
      exploreContainer.current.style.boxShadow = "2px 2px 5px #888888, -3px -3px 3px #ffffff"
      exploreContainer.current.style.border = "none"
      exploreRim.current.style.boxShadow = "inset 2px 2px 3px 0px #908d8d, inset -2px -2px 3px #ffffff"
      exploreRim.current.style.height = "45px"
      exploreRim.current.style.width = "45px"
      exploreOut.current.style.boxShadow = "2px 2px 3px 0px #929292, -2px -2px 3px #ffffff"
      exploreIcon.current.style.filter = "invert(42%) sepia(65%) saturate(2055%) hue-rotate(310deg) brightness(100%) contrast(98%)"
    }
  }, [toggleExplore, toggleSocial])

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
          followUser()
        }
        else {
          deleteFollow(deleteObj)
        }
      })
      .catch(console.error)
  }
  
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
          likePost()
        }
        else {
          deleteLike(deleteObj)
        }
      })
      .catch(console.error)
  }

  const followUser = () => {
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

  const likePost = () => {
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
    <footer>
      <div className="social-buttons">
        <div className="social-list">
          <div className="individual-container-pic">
            <div className="individual-btn-prof">
              <Link to={{pathname: `/profile/other/${props.userForSong?._id}`, profileInfo: props.userForSong}} className="individual-profile-pic">
                <img className="prof-pic" src={props.userForSong?.picture} alt="user in view profile" ref={props.profilePicRef} />
              </Link>
            </div>
          </div>

          <div className="two-btn-container tbc-left">
            <div className="individual-container">
              <div className="individual-btn" onClick={followCheck} ref={followBtn}>
                <img className="social-icons follow" src={follow} alt="follow user icon"></img>
                <div className="likes-number-container">
                    <p>{totalFollowers}</p>
                </div>
              </div>
              <div className="individual-text">
                <p>Follow</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" onClick={likeCheck}>
                <img className="social-icons heart" src={heart2} alt="like post icon"></img>
                <div className="likes-number-container">
                    <p>{totalLikes}</p>
                </div>
              </div>
              <div className="individual-text">
                <p>Like</p>
              </div>
            </div>
          </div>

          <div className="two-btn-container tbc-right">
            <div className="individual-container">
              <div className="individual-btn" ref={props.searchBtn} onClick={props.popUpSearch}>
                <img className="social-icons heart" src={search} alt="search user icon"></img>
              </div>
              <div className="individual-text">
                <p>Search</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" ref={props.commentBtn} onClick={props.popUpComments}>
                <img className="social-icons comment" src={comments} alt="comment on post icon"></img>
                <div className="likes-number-container">
                    <p>{songComments.length}</p>
                </div>
              </div>
              <div className="individual-text">
                <p>Comment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <div className="nav-list">
          <div className="nav-list-inner">
          <div className="nav-buttons-containers" style={{borderRadius: "40px 10px 10px 40px"}}>
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")} className="nav-buttons-inset">
                  <img className="button-icons bi-record" src={mic} alt="record song icon"></img>
                </Link>
              </div>
            </div>  
            {/* <div className="button-title-container">
              Record
            </div> */}
          </div>

          <div className="nav-buttons-containers" ref={exploreContainer}>
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
          </div>

          <div className="nav-buttons-containers" ref={socialContainer}>
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
          </div>

          <div className="nav-buttons-containers" style={{borderRadius: "10px 40px 40px 10px"}}>
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <Link to={user._id ? ("/profile") : ("/auth")} className="nav-buttons-inset">
                  <img className="button-icons bi-profile" src={avatar} alt="user profile icon"></img>
                </Link>
              </div>
            </div>
            {/* <div className="button-title-container">
              Profile
            </div> */}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

export default NavBar;