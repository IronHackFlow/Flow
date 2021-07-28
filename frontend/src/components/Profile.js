import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import actions from "../api";
import TheContext from "../TheContext";
import mic from "../images/record2.svg";
import avatar from "../images/avatar.svg";
import social from "../images/social.svg";
import followers from "../images/followers.svg";
import heart from "../images/heart2.svg";
import editicon from "../images/edit.svg";
import logouticon from "../images/logout2.svg";
import songs from "../images/music.svg";
import explore from "../images/explore.svg";
import play from "../images/play.svg";

function Profile(props) {
  const { 
    user, setUser, 
    userViewed, setUserViewed
    } = React.useContext(
    TheContext
  );

  const [thisUser, setThisUser] = useState([userViewed]);
  const [thisUserSongs, setThisUserSongs] = useState([]);

  const profileContainer = useRef();
  const profileRim = useRef();
  const profileOut = useRef();
  const profileIcon = useRef();

  useEffect(() => {
  //   profileRim.current.style.animation = "rim .5s linear forwards"
  //   profileOut.current.style.animation = "out .5s linear forwards"
  //   profileIn.current.style.animation = "in .5s linear forwards"
  //   profileIcon.current.style.animation = "iconScale .5s linear forwards"
    profileContainer.current.style.background = "#ec6aa0";
    profileContainer.current.style.boxShadow = "inset 2px 2px 3px #855d6e, inset -2px -2px 3px #f4c4d8"
    profileContainer.current.style.border = "1px solid #ec6aa0"
    profileContainer.current.style.transition = "all .4s"
    profileRim.current.style.boxShadow = "rgb(164 65 106) 3px 3px 5px 0px inset, rgb(244 196 216) -3px -3px 5px inset"
    profileRim.current.style.height = "42px"
    profileRim.current.style.width = "42px"
    profileRim.current.style.transition = "all .4s"
    profileOut.current.style.boxShadow = "none"
    profileIcon.current.style.filter = "invert(100%) sepia(3%) saturate(0%) hue-rotate(293deg) brightness(107%) contrast(103%)"
  }, [])

  useEffect(() => {
    actions
      .getOneUser()
      .then((res) => {
        setThisUser(res.data);
      })
      .catch(console.error);
  }, []);

  const logout = () => {
    setUser({});
    setThisUser({});
    setUserViewed({});
    localStorage.clear();
  };

  useEffect(() => {
    console.log("profile.js line 53 ", user);
    actions
      .getUserSongs(user)
      .then((usersSongs) => {
        setThisUserSongs(usersSongs.data);
      })
      .catch(console.error);
  }, []);
  
  const showLyrics = (lyrics) => {
    return lyrics.map((eachLine, index) => {
      return (
        <p key={`${eachLine}_${index}`}>{eachLine}</p>
      )
    })
  }
  
  const handlePlayPause=(x)=>{
    const currentPlayer = document.getElementById(`${x}`)
    if(currentPlayer.paused) {
      currentPlayer.play()
    }
    else {
      currentPlayer.pause()
   }
  }

  function ProfileSongs(eachSong) {
    const songListRef = useRef();
  
    const setFocus = () => {
      console.log(songListRef.current)
      songListRef.current.focus()
    }

    const setSongRefs = useCallback(
      (node) => {
        songListRef.current = node;
      }, 
      []
    )
    const dateGenerator = () => {
      const songDate = moment(eachSong.songDate).fromNow()
      let hasNumber = /\d/
      let oneMonth = "1m"
      let splitDate = songDate.split(' ')
      let firstLetter = splitDate[1].slice(0, 1)
      let combineDate = splitDate[0] + firstLetter
      if (!hasNumber.test(splitDate)) {
        return oneMonth
      }
      else {
        return combineDate
      }
    }

    return (
      <li className="each-track-container" ref={setSongRefs} onClick={setFocus}>
        <div className="track-details-container">
          <div className="song-name-container">
            <Link to={{pathname: `/SongScreen/${eachSong._id}`, songInfo: {...eachSong}}} className="song-name-outset">
              <p>{eachSong.songName}</p>
            </Link>
          </div>

          <div className="track-play-container">
            <audio id={eachSong.songName} src={eachSong.songURL}></audio>
            <div className="play-container">
              <div className="play-outset">
                <div className="play-inset">
                  <img className="button-icons bi-play-2" src={play} onClick={()=>handlePlayPause(eachSong.songName)} alt="play" />
                </div>
              </div>
            </div>

            <div className="song-date-container">
              {/* <p>{eachSong.songDate ? moment(eachSong.songDate).fromNow() : '5 months ago'}</p> */}
              {/* <p>{moment(eachSong.songDate).format('YYYY M D, h:mm a')}</p> */}
              <p>{dateGenerator()}</p>
              <p>{eachSong.songLikes.length} Likes</p>
            </div>
          </div>
        </div>

        <div className="lyrics-container">
          <div className="lyrics-outset">
            <div className="p-container">
              {showLyrics(eachSong.songLyricsStr)}
            </div>
          </div>
        </div>
      </li>
    )
  }

  const showProfileSongs = () => {
    return thisUserSongs.map((eachSong, index) => {
      return (
        <ProfileSongs key={`${eachSong._id}_${index}`} {...eachSong} />
      )
    })
  }

  return (
    <div className="Profile">
      <header className="profile-header">
        <div className="username-pic-container">
          <div className="username-pic-outset">
            <div div className="profile-pic-container">
              <div className="profile-pic-outset">
                <div className="profile-pic-inset">
                  <img className="profile-pic" src={thisUser.picture} alt="prof pic"/>
                </div>
              </div>
            </div>

            <div className="username-container">
              <div className="username-outset">
                <div className="username-inset">
                  <p className="username-text-me">{thisUser.userName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bio">
          <div className="users-details-container">
            <div className="users-details-outset">
              <div className="users-details-inset">
                <div className="users-details-each ude-1">
                  <p style={{color: 'white'}}>Name: </p>
                  <p style={{marginLeft: "4%"}}>{thisUser.family_name}</p>
                </div>

                <div className="users-details-each ude-2">
                  <p style={{color: 'white'}}>Email: </p>
                  <p style={{marginLeft: "4%", overflowX: "scroll"}}>{thisUser.email}</p>
                </div>

                <div className="users-details-each ude-3">
                  <p style={{color: 'white'}}>About: </p>
                  <p className="big-p" style={{marginLeft: "4%"}}>{thisUser.userAbout}</p>
                </div>

                <div className="users-details-each ude-4">
                  <p style={{color: 'white'}}>Twitter: </p>
                  <p style={{marginLeft: "4%"}}>{thisUser.userTwitter}</p>
                </div>

                <div className="users-details-each ude-5">
                  <p style={{color: 'white'}}>Instagram: </p>
                  <p style={{marginLeft: "4%"}}>{thisUser.userInstagram}</p>
                </div>

                <div className="users-details-each ude-6">
                  <p style={{color: 'white'}}>SoundCloud: </p>
                  <p style={{marginLeft: "4%", overflowX: "scroll"}}>{thisUser.userSoundCloud}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-buttons-container">
            <div div className="each-button-container ebc-1">
              <div className="profile-button-outset">
                <div className="profile-button-inset">
                  <img className="button-icons logout" src={followers} alt="followers" />
                </div>
              </div>
              <div className="btn-title" style={{flexDirection: "column"}}>
                <p>Followers</p>
                <p style={{color: "pink"}}>{thisUser.followers?.length}</p>
              </div>
            </div>

            <div className="each-button-container ebc-2">
              <div className="profile-button-outset">
                <div className="profile-button-inset">
                  <img className="button-icons logout" src={social} alt="following" />
                </div>
              </div>
              <div className="btn-title" style={{flexDirection: "column"}}>
                <p>Follows</p>
                <p style={{color: "pink"}}>{thisUser.userFollows?.length}</p>
              </div>
            </div>

            <div className="each-button-container ebc-3">
              <div className="profile-button-outset">
                <Link to="/editprofile-screen" className="profile-button-inset">
                  <img className="button-icons edit" src={editicon} alt="edit" />
                </Link>
              </div>
              <div className="btn-title">
                <p>Edit</p>
              </div>
            </div>

            <div className="each-button-container ebc-4">
              <div className="profile-button-outset">
                <div className="profile-button-inset">
                  <img className="button-icons logout" src={heart} alt="likes" />
                </div>
              </div>
              <div className="btn-title" style={{flexDirection: "column"}}>
                <p>Likes</p>
                <p style={{color: "pink"}}>#</p>
              </div>
            </div>
          
            <div className="each-button-container ebc-5">
              <div className="profile-button-outset">
                <div className="profile-button-inset" onClick={logout}>
                  <img className="button-icons logout" src={logouticon} alt="log out" />
                </div>
              </div>
              <div className="btn-title">
                Log Out
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-post-feed">
        <div className="feed-title-container">
          <div className="feed-title">
            <p>{`${thisUser.userName}'s Songs: `} <span style={{color: "#e24f8c"}}>{thisUserSongs.length}</span></p>
          </div>
        </div>

        <div className="profile-songs-container">
          <ul className="songs-list-container">
            {showProfileSongs()}
          </ul>
          <div className="songs-slider-container">
            <div className="songs-slider-outer">

            </div>
          </div>
        </div>
      
      <div className="nav-buttons nb-profile" style={{boxShadow: `${props.shadowDisplay}`}}>
        <div className="nav-list">
          <div className="nav-list-inner">
          <div className="nav-buttons-containers" style={{borderRadius: "40px 10px 10px 40px"}}>
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")} className="nav-buttons-inset">
                  <img className="button-icons bi-record" src={mic} alt="mic icon"></img>
                </Link>
              </div>
            </div>
            {/* <div className="button-title-container">
              Record
            </div> */}
          </div>

          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <Link to="/explore-feed" className="nav-buttons-inset">
                  <img className="button-icons bi-explore-p" src={explore} alt="explore icon"></img>
                </Link>
              </div>
            </div>
            {/* <div className="button-title-container">
              Explore
            </div> */}
          </div>
          
          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <Link to={user._id ? ("/social-feed") : ("/auth")} className="nav-buttons-inset">
                  <img className="button-icons bi-social-p" src={social} alt="social icon"></img>
                </Link>
              </div>
            </div>
            {/* <div className="button-title-container">
              Following
            </div> */}
          </div>

          <div className="nav-buttons-containers" style={{borderRadius: "10px 40px 40px 10px"}} ref={profileContainer}>
            <div className="nav-buttons-rim" ref={profileRim}>
              <div className="nav-buttons-outset" ref={profileOut}>
                <div className="nav-buttons-inset">
                  <img className="button-icons bi-profile-p" src={avatar} ref={profileIcon} alt="avatar icon"></img>
                </div>
              </div>
            </div>
            {/* <div className="button-title-container">
              Profile
            </div> */}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default Profile;