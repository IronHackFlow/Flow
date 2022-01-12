import { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../contexts/TheContext'
import actions from '../api'
import back from '../images/back.svg'

function EditProfile(props) {
  const { user, userToggle, setUserToggle } = useContext(TheContext)

  const [thisUser, setThisUser] = useState(user)
  const [thisUsersSongs, setThisUsersSongs] = useState([])

  const publicSect = useRef()
  const personalSect = useRef()
  const socialSect = useRef()
  const songsSect = useRef()
  const sectionRefsArray = [publicSect, personalSect, socialSect, songsSect]

  const handleChange = e => {
    setThisUser({
      ...thisUser,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    actions
      .getUserSongs(thisUser)
      .then(res => {
        setThisUsersSongs(res.data)
      })
      .catch(console.error)
  }, [thisUser])

  const submit = e => {
    e.preventDefault()

    actions
      .addUserProf(thisUser)
      .then(newUserUpdate => {
        console.log('new new user update!', newUserUpdate)
        setUserToggle(!userToggle)
      })
      .catch(console.error)
  }

  const expandSection = e => {
    sectionRefsArray.forEach(each => {
      if (e.current !== each.current) {
        each.current.style.height = '5%'
        each.current.style.transition = 'height .5s'
        each.current.children[1].style.animation = 'none'
        each.current.children[1].style.animation = 'editOpacityOut .5s forwards'
        each.current.children[1].style.display = 'none'
      } else {
        e.current.children[1].style.animation = 'none'
        e.current.children[1].style.animation = 'editOpacityIn .5s forwards'
        e.current.children[1].style.display = 'flex'
        e.current.style.height = '70%'
        e.current.style.transition = 'height .5s'
      }
    })
  }

  const songsToEdit = () => {
    return thisUsersSongs.map((each, index) => {
      return (
        <div key={each._id} className="input-sections">
          <p>Song {index + 1}</p>
          <div className="user-input profile-user-i">
            <input
              className="user-text profile-user-t"
              type="text"
              autoComplete="off"
              onChange={handleChange}
              name="songName"
              placeholder={each.songName}
            ></input>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="mid-inset profile-mi">
      <form className="login-container profile-lc" onSubmit={submit}>
        <div className="input-sections-container">
          <div
            className="public-section-container"
            onClick={e => expandSection(publicSect)}
            ref={publicSect}
          >
            <div className="section-header">
              <div className="section-header-inner">Public</div>
            </div>
            <div className="public-input-container hide-public">
              <div className="edit-photo-section">
                <div className="edit-photo-inner">
                  <div className="edit-photo-outer">
                    <img src={thisUser?.picture} alt="profile"></img>
                  </div>
                </div>
              </div>

              <div className="public-sections">
                <div className="input-sections">
                  <p>Username</p>
                  <div className="user-input profile-user-i">
                    <input
                      className="user-text profile-user-t"
                      type="text"
                      autoComplete="off"
                      onChange={handleChange}
                      name="userName"
                      placeholder={thisUser?.userName}
                    ></input>
                  </div>
                </div>
                <div className="input-sections">
                  <p>About</p>
                  <div className="user-input profile-user-i">
                    <input
                      className="user-text profile-user-t"
                      type="text"
                      autoComplete="off"
                      onChange={handleChange}
                      name="userAbout"
                      placeholder={thisUser?.userAbout}
                    ></input>
                  </div>
                </div>
                <div className="input-sections">
                  <p>Location</p>
                  <div className="user-input profile-user-i">
                    <input
                      className="user-text profile-user-t"
                      type="text"
                      autoComplete="off"
                      onChange={handleChange}
                      name="userLocation"
                      placeholder={thisUser?.userLocation}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="personal-section-container"
            onClick={e => expandSection(personalSect)}
            ref={personalSect}
          >
            <div className="section-header">
              <div className="section-header-inner">Personal</div>
              {/* <div className="expand-toggle" onClick={(e) => toggleExpand(personalSect)}>
                        x
                      </div> */}
            </div>
            <div className="public-input-container hide-personal">
              <div className="input-sections">
                <p>First Name</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="nope"
                    onChange={handleChange}
                    name="given_name"
                    placeholder={thisUser?.given_name}
                  ></input>
                </div>
              </div>
              <div className="input-sections">
                <p>Last Name</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="nope"
                    onChange={handleChange}
                    name="family_name"
                    placeholder={thisUser?.family_name}
                  ></input>
                </div>
              </div>
              <div className="input-sections">
                <p>Email</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="nope"
                    onChange={handleChange}
                    name="email"
                    placeholder={thisUser?.email}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <div
            className="social-section-container"
            onClick={e => expandSection(socialSect)}
            ref={socialSect}
          >
            <div className="section-header">
              <div className="section-header-inner">Social</div>
            </div>
            <div className="public-input-container hide-social">
              <div className="input-sections">
                <p>Twitter</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    name="userTwitter"
                    placeholder={thisUser?.userTwitter}
                  ></input>
                </div>
              </div>
              <div className="input-sections">
                <p>Instagram</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    name="userInstagram"
                    placeholder={thisUser?.userInstagram}
                  ></input>
                </div>
              </div>
              <div className="input-sections">
                <p>Soundcloud</p>
                <div className="user-input profile-user-i">
                  <input
                    className="user-text profile-user-t"
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    name="userSoundCloud"
                    placeholder={thisUser?.userSoundCloud}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <div
            className="songs-section-container"
            onClick={e => expandSection(songsSect)}
            ref={songsSect}
          >
            <div className="section-header">
              <div className="section-header-inner">Songs</div>
            </div>
            <div className="public-input-container hide-songs" style={{ overflow: 'scroll' }}>
              {songsToEdit()}
            </div>
          </div>
        </div>

        <div className="save-back-container">
          <div className="back-container">
            <div className="back-inner">
              <Link
                to={`/profile/${user?._id}`}
                state={{ propSongUser: user }}
                style={{ height: '100%' }}
              >
                <img className="button-icons bi-back" src={back} alt="back button icon"></img>
              </Link>
            </div>
          </div>
          <button type="submit" className="submit-button-edit">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
