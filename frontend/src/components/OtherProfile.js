import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import actions from "../api";
import TheContext from "../TheContext";
import mic from '../images/record2.svg'
import play from '../images/play.svg'
import avatar3 from '../images/avatar3.svg'
import social from '../images/social.svg'
import follow from '../images/follow.svg'
import heart2 from '../images/heart2.svg'
import explore from '../images/explore.svg'


function OtherProfile(props) {
  const { user, userViewed } = React.useContext(
    TheContext
  );

  const [thisUserSongs, setThisUserSongs] = useState([]);
  const [thisUser, setThisUser] = useState([userViewed]);

  const profileRim = useRef();
  const profileOut = useRef();
  const profileIn = useRef();
  const profileIcon = useRef();

  useEffect(() => {
    setThisUser(props.location.profileInfo)
  }, [props.location]);
  
  useEffect(() => {
    profileRim.current.style.animation = "rim .5s linear forwards"
    profileOut.current.style.animation = "out .5s linear forwards"
    profileIn.current.style.animation = "in .5s linear forwards"
    profileIcon.current.style.animation = "iconScale .5s linear forwards"
  }, [])

  useEffect(() => {
    console.log("profile.js line 53 ", user);
    actions
      .getUserSongs(props.location.profileInfo)
      .then((usersSongs) => {
        setThisUserSongs(usersSongs.data);
      })
      .catch(console.error);
  }, []);

  const followUser = () => {
    console.log(user, userViewed);
    document.getElementById('notify').click()
    const followData = { user1: thisUser };
    console.log("profile follow user function ", followData);
    actions
      .addFollow(followData)
      .then((somethingreturnedfromapi) => {
        console.log(somethingreturnedfromapi)
        document.getElementById("notify").click();
      })
      .catch(console.error);
  };
  
  const showLyrics = (lyrics) => {
    return lyrics.map((eachLine) => {
      return (
        <p>{eachLine}</p>
      )
    })
  }

  const showSongs = () => {
    return thisUserSongs.map((eachSong, index) => {
      return (
      <li key={index} className="your-track-container">
        <div className="lyrics-play">
          <div className="lyrics-songname-cont">
            <h4>{eachSong.songName}</h4>
          </div>

          <div className="lyrics-outter-container">
            <div className="nav-buttons-inset play-ur-song">
              <img className="button-icons bi-play-2" src={play} alt="play" />
            </div>
          </div>
        </div>

        <div className="lyrics-container">
          <div className="para-container">
            {showLyrics(eachSong.songLyricsStr)}
          </div>
        </div>
      </li>
      )
    })
  }

  return (
    <div className="Profile">
      <header className="profile-header">

        <div className="upper-filler">
          <div className="inner-filler"></div>
        </div>

        <div className="username-pic-container">

          <div className="username-pic-outset">
            <div className="profile-pic-container">
              <div className="profile-pic-outset">
                <div className="profile-pic-inset">
                  <img className="profile-pic" src={thisUser?.picture} alt="user's profile" />
                </div>
              </div>
            </div>

            <div className="username-container">
              <div className="username-outset">
                <div className="username-inset">
                  <h3 className="username-text-me">{thisUser?.userName}</h3>
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
                  <p className="little-p"><span style={{color: 'white', fontWeight: 'bold'}}>About: </span></p>
                  <p className="big-p">{thisUser?.userAbout}</p>
                </div>

                <div className="users-details-each ude-2">
                  <p><span style={{color: 'white', fontWeight: 'bold'}}>Instagram: </span> {thisUser?.userInstagram}</p>
                </div>

                <div className="users-details-each ude-3">
                  <p><span style={{color: 'white', fontWeight: 'bold'}}>Twitter: </span> {thisUser?.userTwitter}</p>
                </div>

                <div className="users-details-each ude-4">
                  <p><span style={{color: 'white', fontWeight: 'bold'}}>SoundCloud: </span> {thisUser?.userSoundCloud}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="edit-logout-container">
            
            <div className="edit-profile-container">
              <div className="edit-profile-outset">
                <div className="edit-profile-inset">
                  <div className="edit-profile-button" onClick={followUser}>                  
                      <img className="button-icons follow-social" src={follow} alt="follow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="log-profile-container">
              <div className="log-profile-outset">
                <div className="log-profile-inset">
                  <div className="edit-profile-button" >
                    <img className="button-icons hearts" src={heart2} alt="like" />
                    <h4 style={{color: 'pink'}}>{thisUser?.userFollows?.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </header>

      <div className="profile-post-feed">
        <div className="profile-post-inner">
          <div className="profile-post-inner-inner">
            <ul className="profile-post-innerest">
              {showSongs()}
            </ul>
          </div>
        </div>
      </div>

      <div className="nav-buttons nb-profile" style={{boxShadow: `${props.shadowDisplay}`}}>
        <div className="nav-list">
          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")}>
                    <img className="button-icons bi-record" src={mic} alt="mic" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="button-title-container">
              Record
            </div>
          </div>

          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to="/explore-feed">
                    <img className="button-icons bi-explore-p" src={explore} alt="explore" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="button-title-container">
              Explore
            </div>
          </div>

          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim">
              <div className="nav-buttons-outset">
                <div className="nav-buttons-inset">
                  <Link to={user._id ? ("/social-feed") : ("/auth")}>
                    <img className="button-icons bi-social-p" src={social} alt="social" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="button-title-container">
              Following
            </div>
          </div>

          <div className="nav-buttons-containers">
            <div className="nav-buttons-rim" ref={profileRim}>
              <div className="nav-buttons-outset" ref={profileOut}>
                <div className="nav-buttons-inset" ref={profileIn}>
                  <Link to="/profile">
                    <img className="button-icons bi-profile-o" ref={profileIcon} src={avatar3} alt="profile" />
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
    </div>
  );
}

export default OtherProfile;
