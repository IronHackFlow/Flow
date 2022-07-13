import { useContext, useState, useEffect, useRef, useCallback, PropsWithChildren } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import actions from '../../api'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import ProfileFlowItem from './ProfileFlowItem'
import Navbar from '../../components/_Navbar/Navbar'
import { ISong, IUser } from '../../interfaces/IModels'
import { editIcon, logOutIcon } from '../../assets/images/_icons'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { DataField, SocialProofItem, NoSongsDisplay } from './Displays/ProfileDisplays'
import { useUserSongs } from '../../hooks/useQueries_REFACTOR/useSongs'

interface propStateType {
  propSongUser: IUser
}

function Profile() {
  const { user, setUser } = useAuth()
  const { id } = useParams()
  const songs = useUserSongs(id ? id : user ? user._id : '')
  // const { songs } = useContext(SongDataContext)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as propStateType
  const { propSongUser } = state
  const [thisUser, setThisUser] = useState<IUser>(user ? user : propSongUser)
  const [userSongs, setUserSongs] = useState<ISong[]>([])
  const [thisUserLikes, setThisUserLikes] = useState([])

  useEffect(() => {
    console.log(user, propSongUser, 'OMFG ITS ALWAYS SOMETHING')
    if (propSongUser) {
      setThisUser(propSongUser)
    } else {
      if (!user) return
      setThisUser(user)
    }
  }, [user, propSongUser])

  useEffect(() => {
    if (!songs.data) return
    setUserSongs(songs.data)
  }, [thisUser, songs])

  // useEffect(() => {
  //   if (!thisUser || (songs && !songs.length)) return
  //   let getUserSongs = songs?.filter(each => {
  //     if (each?.user?._id === thisUser?._id) return each
  //   })
  //   setThisUserSongs(getUserSongs)
  // }, [thisUser, songs])

  // useEffect(() => {}, [thisUser])

  const logout = () => {
    // setUser(null)
    localStorage.removeItem('token')
    navigate('/auth')
  }

  if (!user) {
    console.log('token expired')
    return null
  }
  return (
    <div className="Profile">
      <div className="section-1_profile">
        <LayoutTwo classes={['section-1a_user-title', 'user-title_shadow-div-inset']}>
          <LayoutThree
            classes={[
              'user-pic-container',
              'user-pic_shadow-div-outset',
              'user-pic_shadow-div-inset',
            ]}
          >
            <img className="profile-pic" src={thisUser?.picture} alt="prof pic" />
          </LayoutThree>
          <LayoutThree
            classes={[
              'user-name-container',
              'user-name_shadow-div-outset',
              'user-name_shadow-div-inset',
            ]}
          >
            <p className="username-text-me">{thisUser?.username}</p>
          </LayoutThree>
        </LayoutTwo>

        <div className="section-1b_user-data">
          <LayoutThree
            classes={[
              'user-data-1_fields-container',
              'fields_shadow-div-inset',
              'fields_shadow-div-outset',
            ]}
          >
            <DataField title="Name" addClass="ude-1">
              <p>
                {thisUser?.firstName}
                {thisUser?.lastName}
              </p>
            </DataField>
            <DataField title="Email" addClass="ude-2">
              <p>{thisUser?.email}</p>
            </DataField>
            <DataField title="Town" addClass="ude-3">
              <p>{thisUser?.location}</p>
            </DataField>
            <DataField title="Bio" addClass="ude-4">
              <p>{thisUser?.about}</p>
            </DataField>
            <DataField title="Twtr" addClass="ude-5">
              <p>{thisUser?.socials?.twitter}</p>
            </DataField>
            <DataField title="Insta" addClass="ude-6">
              <p>{thisUser?.socials?.instagram}</p>
            </DataField>
            <DataField title="Sound Cloud" addClass="ude-7">
              <p>{thisUser?.socials?.soundCloud}</p>
            </DataField>
          </LayoutThree>

          <div className="user-data-2_btns-container">
            <LayoutTwo classes={['follows-likes-container', 'follows-likes_shadow-div-inset']}>
              <SocialProofItem title="followers" addClass="1">
                {thisUser?.followers?.length ? thisUser?.followers?.length : '0'}
              </SocialProofItem>
              <SocialProofItem title="following" addClass="2">
                {thisUser?.following?.length ? thisUser?.following?.length : '0'}
              </SocialProofItem>
              <SocialProofItem title="likes" addClass="3">
                {thisUserLikes ? thisUserLikes.length : '0'}
              </SocialProofItem>
            </LayoutTwo>

            <div className="edit-logout-container">
              {thisUser?._id === user?._id && (
                <div className="edit-logout_shadow-div-inset">
                  <div className="each-button-container ebc-4">
                    <Link
                      className="profile-button-outset"
                      to="/editProfile"
                      state={{ allSongs: [...userSongs] }}
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

      <LayoutThree
        classes={['section-2_profile', 'section-2a_songs', 'section-2a_songs-container']}
      >
        <ProfileUserSongsWrapper user={thisUser} />
      </LayoutThree>

      <Navbar pageClass={'NavBarProfile'} />
    </div>
  )
}

export default Profile

const ProfileUserSongsWrapper = ({ user }: { user: IUser }) => {
  const songs = useUserSongs(user?._id)
  const [userSongs, setUserSongs] = useState<ISong[]>([])

  useEffect(() => {
    console.log(songs, 'USEQUERYRESULT IN UI')
    if (songs.data) {
      setUserSongs(songs.data)
    }
  }, [songs])

  if (userSongs && userSongs.length === 0) return <NoSongsDisplay />
  return (
    <ul className="songs-1_songs-list">
      {userSongs?.map((song, index) => {
        return (
          <ProfileFlowItem
            key={`${song._id}_${index}`}
            song={song}
            songs={userSongs}
            // setSongs={setThisUserSongs}
            profileUser={user}
          />
        )
      })}
    </ul>
  )
}
