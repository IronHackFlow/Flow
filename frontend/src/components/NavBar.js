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
    user, userViewed, songId, 
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore
    } = React.useContext(
    TheContext
  );

  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();

  const socialRim = useRef();
  const socialOut = useRef();
  const socialIn = useRef();
  const socialIcon = useRef();
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
    followBtn.current.style.animation = "followInset .5s linear forwards"
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
    followBtn.current.style.animation = "followInset .5s linear reverse forwards"
    actions
      .deleteFollow({ followedUser: userViewed._id, deleteObj: deleteObj })
      .then((res) => {
        console.log(`deleted a follow from: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error)
  }

  const likePost = () => {
    actions
      .addLike({ likerSong: songId, likeDate: new Date(), commLike: false })
      .then((res) => {
        console.log(`added a like to: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  }

  const deleteLike = (deleteObj) => {
    actions
      .deleteLike({ likerSong: songId, deleteObj: deleteObj })
      .then((res) => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  }

  return (
    <footer>
      <div className="social-buttons">
        <div className="social-list">
          <div className="individual-btn">
            <div className="individual-profile-pic">
              <Link to={{pathname: `/profile/other/${props.userForSong?._id}`, profileInfo: props.userForSong}}>
                <img className="prof-pic" src={props.userForSong?.picture} alt="user in view profile" ref={props.profilePicRef} />
              </Link>
            </div>
          </div>  
          <div className="like-comment-container">
            <div className="individual-btn" onClick={followCheck} ref={followBtn}>
              <img className="social-icons follow" src={follow} alt="follow user icon"></img>
              <div className="likes-number-container">
                  <p>{totalFollowers}</p>
              </div>
            </div>
            <div className="individual-btn" onClick={likeCheck}>
              <img className="social-icons heart" src={heart2} alt="like post icon"></img>
              <div className="likes-number-container">
                  <p>{totalLikes}</p>
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
          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")}>
                    <img className="button-icons bi-record" src={mic} alt="record song icon"></img>
                  </Link>
                </div>
              </div>
            </div>  
            <div className="button-title-container">
              Record
            </div>
          </div>

          <div className="nav-buttons-containers">
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
            <div className="button-title-container">
              Explore
            </div>
          </div>

          <div className="nav-buttons-containers">
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
            <div className="button-title-container">
              Following
            </div>
          </div>

          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={user._id ? ("/profile") : ("/auth")}>
                    <img className="button-icons bi-profile" src={avatar3} alt="user profile icon"></img>
                  </Link>
                </div>
              </div>
            </div>
            <div className="button-title-container">
              Profile
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default NavBar;