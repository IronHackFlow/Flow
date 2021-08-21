import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import actions from "../api";
import TheContext from "../TheContext";
import NavBar from "../components/NavBar";
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
    setUserViewed
    } = React.useContext(
    TheContext
  );

  const [thisUser, setThisUser] = useState([]);
  const [thisUserSongs, setThisUserSongs] = useState([]);

  useEffect(() => {
    console.log("profile.js line 53 ", props.location.profileInfo);
    actions
      .getUserSongs({ songUser: props.location.profileInfo._id })
      .then((res) => {
        setThisUserSongs(res.data);
        console.log(res.data, "lol")
      })
      .catch(console.error);
  }, [props.location]);

  useEffect(() => {
    if (props.location.profileInfo?._id === user._id) {
      actions
      .getOneUser()
      .then((res) => {
        setThisUser(res.data);
        console.log('shit son, this may work')
      })
      .catch(console.error);
    }
    else {
      actions
      .getAUser({ id: props.location.profileInfo._id })
      .then((res) => {
        setThisUser(res.data);
        console.log('shit son, this may work')
      })
      .catch(console.error);
    }

  }, [props.location]);

  const logout = () => {
    setUser({});
    setThisUser({});
    setUserViewed({});
    localStorage.clear();
  };

  const dateFormatHandler = (date) => {
    const getDate = new Date();
    const currentDate = Date.parse(getDate)
    const objDate = Date.parse(date)
    const timeDiff = currentDate - objDate

    const year = 31536000000
    const month = 2592000000
    const week = 604800000
    const day = 86400000
    const hour = 3600000
    const minute = 60000
    const second = 1000

    if (timeDiff >= year) {
      console.log((timeDiff / year), " years ago")
      return `${Math.round(timeDiff / year)}y`
    }
    else if (timeDiff >= month && timeDiff < year) {
      if (timeDiff / month < 11.5) {
        return `${Math.round(timeDiff / month)}m`
      }
      else {
        return "1y"
      }
    }
    else if (timeDiff >= week && timeDiff < (month * 2)) {
      console.log((timeDiff / week), " weeks ago")
      return `${Math.round(timeDiff / week)}w`
    }
    else if (timeDiff >= day && timeDiff < week) {
      console.log((timeDiff / day), " days ago")
      return `${Math.round(timeDiff / day)}d`
    }
    else if (timeDiff >= hour && timeDiff < day) {
      console.log((timeDiff / hour), " hours ago")
      return `${Math.round(timeDiff / hour)}h`
    }
    else if (timeDiff >= minute && timeDiff < hour) {
      console.log((timeDiff / minute), " minutes ago")
      return `${Math.round(timeDiff / minute)}m`
    }
    else if (timeDiff >= second && timeDiff < minute) {
      console.log((timeDiff / second), " seconds ago")
      return `${Math.round(timeDiff / second)}s`
    }
    
    // let diffSeconds = (timeDifference / 1000).toFixed(2)
    // let diffMinutes = (diffSeconds / 60).toFixed(2)
    // let diffHours = (diffMinutes / 60).toFixed(2)
    // let diffDays = (diffHours / 24).toFixed(2)
    // let diffWeeks = (diffDays / 7).toFixed(2)
    // let diffMonths = (diffDays / 30).toFixed(2)
    // let diffYears = (diffMonths / 12).toFixed(2)
    // if (diffSeconds < 60) {
    //   console.log(Math.round(diffSeconds), ' seconds ago')
    //   return `${Math.round(diffSeconds)}s`
    // }
    // else if (diffMinutes >= 1 && diffMinutes <= 55) {
    //   console.log(Math.round(diffMinutes), " minutes ago")
    //   return `${Math.round(diffMinutes)}min`
    // }
    // else if (diffHours >= 1 && diffHours < 24) {
    //   console.log(Math.round(diffHours), " hours ago")
    //   return `${Math.round(diffHours)}h`
    // }
    // else if (diffDays >= 1 && diffDays < 7) {
    //   console.log(Math.round(diffDays), " days ago")
    //   return `${Math.round(diffDays)}d`
    // }
    // else if (diffWeeks >= 1 && diffWeeks < 8) {
    //   console.log(Math.round(diffWeeks), " weeks ago")
    //   return `${Math.round(diffWeeks)}w`
    // }
    // else if (diffWeeks >= 8 || diffMonths >= 2) {
    //   console.log(Math.round(diffMonths), " months ago")
    //   return `${Math.round(diffMonths)}m`
    // }
    // else if (diffMonths >= 12) {
    //   console.log(Math.round(diffYears), " years ago")
    //   return `${Math.round(diffYears)}y`
    // }
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

    const showLyrics = () => {
      return eachSong.songLyricsStr.map((eachLine, index) => {
        return (
          <p key={`${eachLine}_${index}`}>{eachLine}</p>
        )
      })
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
                  <img className="button-icons bi-play-2" src={play} onClick={() => handlePlayPause(eachSong.songName)} alt="play" />
                </div>
              </div>
            </div>

            <div className="track-data-container">
              
              <p className="tp-1"><div className="shape-wrap"></div>This is a caption for the above song. I'm testing the length</p>
              <p className="tp-2">{dateFormatHandler(eachSong.songDate)}</p>
              <p className="tp-3">{eachSong.songLikes.length === 1 ? `${eachSong.songLikes.length} Like` : `${eachSong.songLikes.length} Likes`}</p>
              <p className="tp-4">{eachSong.songComments.length === 1 ? `${eachSong.songComments.length} Comment` : `${eachSong.songComments.length} Comments`}</p>
            </div>
          </div>
        </div>

        <div className="lyrics-container">
          <div className="lyrics-outset">
            <div className="p-container">
              {showLyrics()}
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
      <div className="section-1_profile">
        <div className="section-1a_user-title">
          <div className="user-title_shadow-div-inset">
            <div div className="user-pic-container">
              <div className="user-pic_shadow-div-outset">
                <div className="user-pic_shadow-div-inset">
                  <img className="profile-pic" src={thisUser.picture} alt="prof pic"/>
                </div>
              </div>
            </div>

            <div className="user-name-container">
              <div className="user-name_shadow-div-outset">
                <div className="user-name_shadow-div-inset">
                  <p className="username-text-me">{thisUser.userName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-1b_user-data">
          <div className="user-data-1_fields-container">
            <div className="fields_shadow-div-outset">
              <div className="users-details-each ude-1">
                <p style={{color: 'white'}}>Name: </p>
                <p style={{fontSize: "13px", marginLeft: "4%"}}>{thisUser.family_name}</p>
              </div>

              <div className="users-details-each ude-2">
                <p style={{color: 'white'}}>Email: </p>
                <p style={{fontSize: "13px", marginLeft: "4%", overflowX: "scroll"}}>{thisUser.email}</p>
              </div>

              <div className="users-details-each ude-3">
                <p style={{color: 'white'}}>About: </p>
                <p className="big-p" style={{fontSize: "13px", marginLeft: "4%"}}>{thisUser.userAbout}</p>
              </div>

              <div className="users-details-each ude-4">
                <p style={{color: 'white'}}>Twitter: </p>
                <p style={{fontSize: "13px", marginLeft: "4%"}}>{thisUser.userTwitter}</p>
              </div>

              <div className="users-details-each ude-5">
                <p style={{color: 'white'}}>Instagram: </p>
                <p style={{fontSize: "13px", marginLeft: "4%"}}>{thisUser.userInstagram}</p>
              </div>

              <div className="users-details-each ude-6">
                <p style={{color: 'white'}}>SoundCloud: </p>
                <p style={{fontSize: "13px", marginLeft: "4%", overflowX: "scroll"}}>{thisUser.userSoundCloud}</p>
              </div>
            </div>
          </div>

          <div className="user-data-2_btns-container">
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
      </div>

      <div className="section-2_profile">
        <div className="section-2a_songs">
          <ul className="songs-1_songs-list">
            {showProfileSongs()}
          </ul>
          
          <div className="songs-2_slider-container">
            <div className="songs-slider-outer">

            </div>
          </div>
        </div>

        <NavBar socialDisplay="none" />
      </div>
    </div>
  );
}

export default Profile;
