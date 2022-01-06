import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import actions from '../api'
import TheContext from '../TheContext'
import FormatDate from './FormatDate'
import NavBar from '../components/NavBar'
import social from '../images/social.svg'
import followers from '../images/followers.svg'
import heart from '../images/heart2.svg'
import editicon from '../images/edit.svg'
import logouticon from '../images/logout2.svg'
import xExit from "../images/exit-x-2.svg"
import play from '../images/play.svg'
import pause from '../images/pause.svg'

function Profile(props) {
  const { user, setUser, userToggle, setUserToggle } = React.useContext(TheContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongUser } = location.state
  const [thisUser, setThisUser] = useState(propSongUser ? propSongUser : user)
  const [thisUserSongs, setThisUserSongs] = useState([])
  const [thisUserLikes, setThisUserLikes] = useState([])
  const songListRef = useRef()
  
  // useEffect(() => {
  //   if (propSongUser) {
  //     setThisUser(propSongUser)
  //   } else {
  //     setThisUser(user)
  //   }
  // }, [])

  useEffect(() => {
    console.log(location, "what is this giving me?")
    actions
      .getUserSongs({ songUser: propSongUser ? propSongUser?._id : user._id })
      .then(res => {
        setThisUserSongs(res.data)
      })
      .catch(console.error)
  }, [propSongUser])

  
  useEffect(() => {
    actions
      .getUsersLikes({ likeUser: thisUser?._id })
      .then((res) => {
        setThisUserLikes(res.data)
      })
      .catch(console.error)
  }, [thisUser])

  const logout = () => {
    setUser({})
    localStorage.removeItem('token')
    setUserToggle(!userToggle)
    navigate('/auth')
  }


  function ProfileSongs(eachSong, id) {
    const [deleteCheck, setDeleteCheck] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const audioRef = useRef();

    useEffect(() => {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }, [isPlaying])

    const handlePlayPause = () => {
      if (isPlaying) {
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
      }
    }

    const setFocus = () => {
      // console.log(songListRef.current)
      if (document.activeElement === songListRef.current) {
        console.log('yo wtf')
        songListRef.current.blur()
      } else {
        songListRef.current.focus()
      }
    }
    
    const deleteCheckHandler = (bool) => {
      if (bool === false) {
        setDeleteCheck(false)
      } else {
        setDeleteCheck(true)
      }
    }
  
    const deleteSong = (eachSong) => {
      actions 
        .deleteSong({ song: eachSong })
        .then((res) => {
          console.log(res.data)
          setThisUserSongs(oldArr => oldArr.filter(item => item._id !== eachSong._id))
        })
        .catch(console.error)
    }

    const setSongRefs = useCallback(node => {
      songListRef.current = node
    }, [])

    const setAudioRefs = useCallback(node => {
      audioRef.current = node
    }, [])

    const showLyrics = () => {
      return eachSong?.songLyricsStr?.map((eachLine, index) => {
        return (
          <div className="each-line-container" key={`${eachLine}lyrics${index}`}>
            <p className="each-line-no">{index + 1}</p>
            <p className="each-line-lyric" key={`${eachLine}_${index}`}>{eachLine}</p>
          </div>
        )
      })
    }

    return (
      <li className="each-track-container" ref={setSongRefs} onClick={() => setFocus}>
        {deleteCheck
          ? (
            <>
              <div className="track-details-container">
                <div className="song-name-container">
                  <Link
                    to={`/songScreen/${eachSong._id}`}
                    state={{ propCurrentSong: eachSong }}
                    className="song-name-outset"
                  >
                    <div className="track-title-container">
                      <p>{eachSong.songName}</p>
                    </div>
                    <div className="track-data-container">
                      <div className="track-caption-container">
                        <p>
                          This is a caption for the above song. I'm testing the length
                        </p>
                      </div>
                      <div className="track-social-container">
                        <FormatDate date={eachSong.songDate} />
                        <p>
                          {eachSong.songLikes.length === 1
                            ? `${eachSong.songLikes.length} Like`
                            : `${eachSong.songLikes.length} Likes`}
                        </p>
                        <p>
                          {eachSong.songComments.length === 1
                            ? `${eachSong.songComments.length} Comment`
                            : `${eachSong.songComments.length} Comments`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="lyrics-container">
                  <div className="lyrics-outset">
                    <div className="p-container">{showLyrics()}</div>
                  </div>
                </div>
              </div>
              
              <div className="buttons-container">
                <div className="buttons-inner">
                  {propSongUser?._id === user._id
                    ? (
                      <>
                        <div className="delete-btn-container">
                          <div className="play-container">
                            <div className="play-outset">
                              <div className="play-inset">
                                <img
                                  className="button-icons"
                                  src={xExit}
                                  onClick={() => deleteCheckHandler(false)}
                                  alt="exit"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="delete-btn-container">
                          <div className="play-container">
                            <div className="play-outset">
                              <Link 
                                to={`/profile/${user._id}/editLyrics`}
                                state={{ propSongTakes: null, propCurrentSong: eachSong }}
                                className="play-inset"
                              >
                                <img
                                  className="button-icons"
                                  src={editicon}
                                  alt="edit"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : ""
                  }
                  <div className="delete-btn-container">
                    <audio src={eachSong.songURL} ref={setAudioRefs}></audio>
                    <div className="play-container">
                      <div className="play-outset">
                        <button className="play-inset">
                          <img
                            className="button-icons bi-play-2"
                            src={isPlaying ? pause : play}
                            onClick={() => handlePlayPause()}
                            alt="play"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="delete-container">
              <div className="delete-question-container">
               <p>Are you sure you want to delete <span style={{color: '#e24f8c'}}>{eachSong.songName}</span>?</p>
              </div>
              <div className="delete-btn-container">
                <div className="delete-btn_shadow-div-inset">
                  <div className="space-container"></div>
                  <div className="cancel-btn-container">
                    <div className="cancel-btn_shadow-div-outset" onClick={() => deleteCheckHandler(true)}>
                      Cancel
                    </div>
                  </div>
                  <div className="confirm-btn-container">
                    <div className="confirm-btn_shadow-div-outset" onClick={() => deleteSong(eachSong)}>
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </li>
    )
  }

  const showProfileSongs = useCallback(() => {
    return thisUserSongs.map((eachSong, index) => {
      return <ProfileSongs key={`${uuidv4()}song${eachSong._id}_${index}`} {...eachSong} />
    })
  }, [thisUserSongs])

  return (
    <div className="Profile">
      <div className="section-1_profile">
        <div className="section-1a_user-title">
          <div className="user-title_shadow-div-inset">
            <div div className="user-pic-container">
              <div className="user-pic_shadow-div-outset">
                <div className="user-pic_shadow-div-inset">
                  <img className="profile-pic" src={thisUser?.picture} alt="prof pic" />
                </div>
              </div>
            </div>

            <div className="user-name-container">
              <div className="user-name_shadow-div-outset">
                <div className="user-name_shadow-div-inset">
                  <p className="username-text-me">{thisUser?.userName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-1b_user-data">
          <div className="user-data-1_fields-container">
            <div className="fields_shadow-div-inset">
              <div className="fields_shadow-div-outset">
                <div className="users-details-each ude-1">
                  <div className="p-1">
                    <p>Name: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.given_name} {thisUser?.family_name}</p>
                  </div>
                </div>

                <div className="users-details-each ude-2">
                  <div className="p-1">
                    <p>Email: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.email}</p>
                  </div>
                </div>

                <div className="users-details-each ude-3">
                  <div className="p-1">
                    <p>Town: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.userLocation}</p>
                  </div>
                </div>

                <div className="users-details-each ude-4">
                  <div className="p-1">
                    <p>Bio: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.userAbout}</p>
                  </div>
                </div>

                <div className="users-details-each ude-5">
                  <div className="p-1">
                    <p>Twttr: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.userTwitter}</p>
                  </div>
                </div>

                <div className="users-details-each ude-6">
                  <div className="p-1">
                    <p>Insta: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.userInstagram}</p>
                  </div>
                </div>

                <div className="users-details-each ude-7">
                  <div className="p-1">
                    <p>Sound Cloud: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.userSoundCloud}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="user-data-2_btns-container">
            <div className="follows-likes-container">
              <div className="follows-likes_shadow-div-inset">
                <div div className="each-button-container ebc-1">
                  <div className="profile-button-outset" style={{borderRadius: "35px 4px 4px 4px"}}>
                    <div className="profile-button-inset pbe-1">
                      <p className="number-container">
                        {/* eventually create logic to deal with 4 digit number here */}
                        {thisUser?.followers?.length ? thisUser?.followers?.length : "0"}
                      </p>
                      <div className="icon-container">
                        <img className="button-icons logout" src={followers} style={{margin: "12% 0% 0% 8%"}} alt="followers" />
                      </div>
                    </div>
                    <div className="btn-title">
                      Followers
                    </div>
                  </div>
                </div>

                <div className="each-button-container ebc-2">
                  <div className="profile-button-outset" style={{borderRadius: "4px"}}>
                    <div className="profile-button-inset pbe-2">
                      <p className="number-container">
                        {thisUser?.userFollows?.length ? thisUser?.userFollows?.length : "0"}
                      </p>
                      <div className="icon-container">
                        <img className="button-icons logout" src={social} alt="following" />
                      </div>
                    </div>
                    <div className="btn-title">
                      Following
                    </div>
                  </div>
                </div>
                
                <div className="each-button-container ebc-3">
                  <div className="profile-button-outset" style={{borderRadius: "4px 4px 4px 35px"}}>
                    <div className="btn-title">
                      Likes
                    </div>
                    <div className="profile-button-inset pbe-3">
                      <p className="number-container">
                        {thisUserLikes ? thisUserLikes.length : "0"}
                      </p>
                      <div className="icon-container">
                        <img className="button-icons logout" src={heart} style={{margin: "0% 0% 20% 5%"}} alt="likes" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-logout-container">
              {thisUser?._id === user?._id ? (
                <div className="edit-logout_shadow-div-inset">
                  <div className="each-button-container ebc-4">
                    <div className="profile-button-outset" style={{borderRadius: "35px 4px 4px 4px"}}>
                      <Link to="/editprofile-screen" className="profile-button-inset pbe-4">
                        <img className="button-icons edit" src={editicon} style={{margin: "12% 0% 0% 11%"}} alt="edit" />
                      </Link>
                      <div className="btn-title">
                        Edit
                      </div>
                    </div>
                  </div>

                  <div className="each-button-container ebc-5">
                    <div className="profile-button-outset" style={{borderRadius: "4px 4px 4px 35px"}}>
                      <div className="btn-title">
                        Log Out
                      </div>
                      <div className="profile-button-inset pbe-5" onClick={() => logout()}>
                        <img className="button-icons logout" src={logouticon} style={{margin: "0% 0% 18% 9%"}} alt="log out" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="section-2_profile">
        <div className="section-2a_songs">
          <ul className="songs-1_songs-list">
            {thisUserSongs?.length ? (
              showProfileSongs()
            ) : (
              <li className="each-track-container">
                <div className="track-details-container">
                  <div className="song-name-container">
                    <div className="song-name-outset">
                      <div className="track-title-container">
                        <p style={{fontWeight: "bold", fontSize: "14px"}}>User hasn't saved any Flows</p>
                      </div>
                    </div>
                  </div>
                  <div className="lyrics-container"> 
                    <div className="lyrics-outset">
                      <div className="p-container">
                        <p>{thisUser?._id === user?._id ? "Go to the Recording Booth to start your budding new rap career!" : ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buttons-container">
                  <div className="buttons-inner">
                  </div>
                </div>
              </li>
            )}
          </ul>
          <div className="songs-2_slider-container">
            <div className="songs-slider-outer">
              <div className="songs-slider-bar"></div>
            </div>
          </div>
        </div>

      </div>
      <NavBar locationClass={'NavBarProfile'} />
    </div>
  )
}

export default Profile
