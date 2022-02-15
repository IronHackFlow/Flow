import { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import actions from '../api'
import TheContext from '../contexts/TheContext'
import useFormatDate from '../utils/useFormatDate'
import NavBar from '../components/NavBar'
import {
  followersIcon,
  followingIcon,
  thumbsUpIcon,
  editIcon,
  logOutIcon,
  closeIcon,
  playIcon,
  pauseIcon,
} from '../assets/images/_icons'

function Profile() {
  const { user, setUser } = useContext(TheContext)
  const { formatDate } = useFormatDate()
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongUser } = location.state
  const [thisUser, setThisUser] = useState()
  const [thisUserSongs, setThisUserSongs] = useState([])
  const [thisUserLikes, setThisUserLikes] = useState([])
  const songListRef = useRef()

  useEffect(() => {
    setThisUser(propSongUser)
  }, [propSongUser])

  useEffect(() => {
    actions
      .getUserSongs({ song_user: thisUser?._id })
      .then(res => {
        setThisUserSongs(res.data)
      })
      .catch(console.error)
  }, [thisUser, user])

  useEffect(() => {
    actions
      .getUsersLikes({ user: thisUser?._id })
      .then(res => {
        setThisUserLikes(res.data)
      })
      .catch(console.error)
  }, [thisUser])

  const logout = () => {
    setUser({})
    localStorage.removeItem('token')
    navigate('/auth')
  }

  function ProfileSongs(eachSong) {
    const [deleteCheck, setDeleteCheck] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)

    const audioRef = useRef()

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

    const setFocus = e => {
      if (document.activeElement === e.currentTarget) {
        e.currentTarget.blur()
      } else {
        e.currentTarget.focus()
      }
    }

    const deleteCheckHandler = bool => {
      if (bool === false) {
        setDeleteCheck(false)
      } else {
        setDeleteCheck(true)
      }
    }

    const deleteSong = eachSong => {
      actions
        .deleteSong({ song: eachSong })
        .then(res => {
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
      return eachSong?.lyrics?.map((eachLine, index) => {
        return (
          <div className="profile-songs__lyrics-line" key={`${eachLine}lyrics${index}`}>
            <p className="profile-songs__lyrics-line-text no">{index + 1}</p>
            <p className="profile-songs__lyrics-line-text line" key={`${eachLine}_${index}`}>
              {eachLine}
            </p>
          </div>
        )
      })
    }

    return (
      <li className="profile-songs__item" ref={setSongRefs} onClick={e => setFocus(e)}>
        {deleteCheck ? (
          <>
            <div className="profile-songs__body">
              <div className="profile-songs__header">
                <Link
                  to={`/songScreen/${eachSong._id}`}
                  state={{ currentSong: eachSong }}
                  type="button"
                  className="profile-songs__header--shadow-outset"
                >
                  <div className="profile-songs__title">
                    <p className="profile-songs__title-text">{eachSong.name}</p>
                  </div>
                  <div className="profile-songs__song-info">
                    <div className="profile-songs__text--container">
                      <p className="profile-songs__text caption">
                        {eachSong.caption ? eachSong.caption : 'no caption for this flow'}
                      </p>
                    </div>
                    <div className="profile-songs__text--container">
                      <p className="profile-songs__text">
                        {formatDate(eachSong.date, 'm')}
                        <span className="profile-songs__text-bullet">
                          {String.fromCodePoint(8226)}
                        </span>
                        {eachSong.song_likes.length === 1
                          ? `${eachSong.song_likes.length} like`
                          : `${eachSong.song_likes.length} likes`}
                        <span className="profile-songs__text-bullet">
                          {String.fromCodePoint(8226)}
                        </span>
                        {eachSong.song_comments.length === 1
                          ? `${eachSong.song_comments.length} comment`
                          : `${eachSong.song_comments.length} comments`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="profile-songs__lyrics">
                <div className="profile-songs__lyrics--shadow-outset">
                  <div className="profile-songs__lyrics-text">{showLyrics()}</div>
                </div>
              </div>
            </div>

            <div className="profile-songs__action-btns--container">
              <div className="buttons-inner">
                {propSongUser?._id === user?._id && (
                  <>
                    <div className="delete-btn-container">
                      <div className="play-container">
                        <div className="play-outset">
                          <button className="play-inset">
                            <img
                              className="button-icons"
                              src={closeIcon}
                              onClick={() => deleteCheckHandler(false)}
                              alt="exit"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="delete-btn-container">
                      <div className="play-container">
                        <div className="play-outset">
                          <Link
                            to={`/editLyrics`}
                            state={{ propSongs: thisUserSongs, propCurrentSong: eachSong }}
                            className="play-inset"
                          >
                            <img className="button-icons" src={editIcon} alt="edit" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="delete-btn-container">
                  <audio src={eachSong.songURL} ref={setAudioRefs}></audio>
                  <div className="play-container">
                    <div className="play-outset">
                      <button className="play-inset">
                        <img
                          className="button-icons bi-play-2"
                          src={isPlaying ? pauseIcon : playIcon}
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
              <p>
                Are you sure you want to delete <span>{eachSong.name}</span>?
              </p>
            </div>
            <div className="delete-btn-container">
              <div className="delete-btn_shadow-div-inset">
                <div className="space-container"></div>
                <div className="cancel-btn-container">
                  <button
                    className="cancel-btn_shadow-div-outset"
                    onClick={() => deleteCheckHandler(true)}
                  >
                    Cancel
                  </button>
                </div>
                <div className="confirm-btn-container">
                  <button
                    className="confirm-btn_shadow-div-outset"
                    onClick={() => deleteSong(eachSong)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    )
  }

  const showProfileSongs = useCallback(() => {
    return thisUserSongs?.map((eachSong, index) => {
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
                  <p className="username-text-me">{thisUser?.user_name}</p>
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
                    <p>
                      {thisUser?.given_name} {thisUser?.family_name}
                    </p>
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
                    <p>{thisUser?.location}</p>
                  </div>
                </div>

                <div className="users-details-each ude-4">
                  <div className="p-1">
                    <p>Bio: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.about}</p>
                  </div>
                </div>

                <div className="users-details-each ude-5">
                  <div className="p-1">
                    <p>Twttr: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.user_Twitter}</p>
                  </div>
                </div>

                <div className="users-details-each ude-6">
                  <div className="p-1">
                    <p>Insta: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.user_Instagram}</p>
                  </div>
                </div>

                <div className="users-details-each ude-7">
                  <div className="p-1">
                    <p>Sound Cloud: </p>
                  </div>
                  <div className="p-2">
                    <p>{thisUser?.user_SoundCloud}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="user-data-2_btns-container">
            <div className="follows-likes-container">
              <div className="follows-likes_shadow-div-inset">
                <div div className="each-button-container ebc-1">
                  <div
                    className="profile-button-outset"
                    style={{ borderRadius: '35px 4px 4px 4px' }}
                  >
                    <div className="profile-button-inset pbe-1">
                      <p className="number-container">
                        {/* eventually create logic to deal with 4 digit number here */}
                        {thisUser?.followers?.length ? thisUser?.followers?.length : '0'}
                      </p>
                      <div className="icon-container">
                        <img
                          className="button-icons logout"
                          src={followersIcon}
                          style={{ margin: '12% 0% 0% 8%' }}
                          alt="followers"
                        />
                      </div>
                    </div>
                    <div className="btn-title">Followers</div>
                  </div>
                </div>

                <div className="each-button-container ebc-2">
                  <div className="profile-button-outset" style={{ borderRadius: '4px' }}>
                    <div className="profile-button-inset pbe-2">
                      <p className="number-container">
                        {thisUser?.user_follows?.length ? thisUser?.user_follows?.length : '0'}
                      </p>
                      <div className="icon-container">
                        <img className="button-icons logout" src={followingIcon} alt="following" />
                      </div>
                    </div>
                    <div className="btn-title">Following</div>
                  </div>
                </div>

                <div className="each-button-container ebc-3">
                  <div
                    className="profile-button-outset"
                    style={{ borderRadius: '4px 4px 4px 35px' }}
                  >
                    <div className="btn-title">Likes</div>
                    <div className="profile-button-inset pbe-3">
                      <p className="number-container">
                        {thisUserLikes ? thisUserLikes.length : '0'}
                      </p>
                      <div className="icon-container">
                        <img
                          className="button-icons logout"
                          src={thumbsUpIcon}
                          style={{ margin: '0% 0% 20% 5%' }}
                          alt="likes"
                        />
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
                    <Link
                      className="profile-button-outset"
                      to="/editProfile"
                      style={{ borderRadius: '35px 4px 4px 4px' }}
                    >
                      <div className="profile-button-inset pbe-4">
                        <img
                          className="button-icons edit"
                          src={editIcon}
                          style={{ margin: '12% 0% 0% 11%' }}
                          alt="edit"
                        />
                      </div>
                      <div className="btn-title">Edit</div>
                    </Link>
                  </div>

                  <div className="each-button-container ebc-5">
                    <button
                      className="profile-button-outset"
                      style={{ borderRadius: '4px 4px 4px 35px' }}
                      onClick={() => logout()}
                    >
                      <div className="btn-title">Log Out</div>
                      <div className="profile-button-inset pbe-5">
                        <img
                          className="button-icons logout"
                          src={logOutIcon}
                          style={{ margin: '0% 0% 18% 9%' }}
                          alt="log out"
                        />
                      </div>
                    </button>
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
              <li className="profile-songs__item">
                <div className="profile-songs__body">
                  <div className="profile-songs__header">
                    <div className="profile-songs__header--shadow-outset">
                      <div className="profile-songs__title">
                        <p
                          className="profile-songs__title-text"
                          style={{ fontWeight: 'bold', fontSize: '14px' }}
                        >
                          User hasn't saved any Flows
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="profile-songs__lyrics">
                    <div className="profile-songs__lyrics--shadow-outset">
                      <div className="profile-songs__lyrics-text">
                        <p>
                          {thisUser?._id === user?._id
                            ? 'Go to the Recording Booth to start your budding new rap career!'
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-songs__action-btns--container">
                  <div className="buttons-inner"></div>
                </div>
              </li>
            )}
          </ul>
          {/* <div className="songs-2_slider-container">
            <div className="songs-slider-outer">
              <div className="songs-slider-bar"></div>
            </div>
          </div> */}
        </div>
      </div>
      <NavBar locationClass={'NavBarProfile'} />
    </div>
  )
}

export default Profile
