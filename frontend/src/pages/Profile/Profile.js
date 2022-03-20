import { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import { SongDataContext } from '../../contexts/SongData'
import ProfileFlowItem from './ProfileFlowItem'
import NavBar from '../../components/NavBar'
import {
  followersIcon,
  followingIcon,
  thumbsUpIcon,
  editIcon,
  logOutIcon,
} from '../../assets/images/_icons'

function Profile() {
  const { user, setUser } = useContext(TheContext)
  const { homeFeedSongs } = useContext(SongDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { propSongUser } = location.state
  const [thisUser, setThisUser] = useState()
  const [thisUserSongs, setThisUserSongs] = useState([])
  const [thisUserLikes, setThisUserLikes] = useState([])

  useEffect(() => {
    setThisUser(propSongUser)
  }, [propSongUser])

  useEffect(() => {
    let getUserSongs = homeFeedSongs?.filter(each => {
      if (each.song.song_user._id === thisUser?._id) return each.song
    })
    setThisUserSongs(getUserSongs)
  }, [thisUser, homeFeedSongs])

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

  const showProfileSongs = useCallback(() => {
    if (thisUserSongs?.length) {
      return thisUserSongs?.map((eachSong, index) => {
        return (
          <ProfileFlowItem
            key={`${eachSong.song._id}_${index}`}
            song={eachSong.song}
            songs={thisUserSongs}
            setSongs={setThisUserSongs}
            profileUser={thisUser}
          />
        )
      })
    } else {
      return (
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
      )
    }
  }, [thisUserSongs, thisUser])

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
                    <div className="btn-title">followers</div>
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
                    <div className="btn-title">following</div>
                  </div>
                </div>

                <div className="each-button-container ebc-3">
                  <div
                    className="profile-button-outset"
                    style={{ borderRadius: '4px 4px 4px 35px' }}
                  >
                    <div className="btn-title">likes</div>
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
              {thisUser?._id === user?._id && (
                <div className="edit-logout_shadow-div-inset">
                  <div className="each-button-container ebc-4">
                    <Link
                      className="profile-button-outset"
                      to="/editProfile"
                      state={{ songs: [...thisUserSongs] }}
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
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section-2_profile">
        <div className="section-2a_songs">
          <div className="section-2a_songs-container">
            <ul className="songs-1_songs-list">{showProfileSongs()}</ul>
          </div>
          {/* <div className="songs-2_slider-container">
            <div className="songs-slider-outer">
              <div className="songs-slider-bar"></div>
            </div>
          </div> */}
        </div>
      </div>
      <NavBar pageClass={'NavBarProfile'} />
    </div>
  )
}

export default Profile
