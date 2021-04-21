import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { Redirect, useHistory } from "react-router";
import TheContext from "../TheContext";
import actions from "../api";

function EditProfile(props) {
  const { user } = React.useContext(TheContext);

  const [thisUser, setThisUser] = useState([user]);
  let redirectRef = useRef()

  const publicSect = useRef('70%');
  const personalSect = useRef('10%');
  const socialSect = useRef('10%');
  const songsSect = useRef('10%');
  const sectionArray = [publicSect, personalSect, socialSect, songsSect];

  const handleChange = (e) => {
    setThisUser({
      ...thisUser,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    actions
      .getOneUser()
      .then((thisUserDbData) => {
        setThisUser(thisUserDbData.data);
      })
      .catch(console.error);
  }, []);

  const submit = (e) => {
    e.preventDefault();

    actions
      .addUserProf(thisUser)
      .then((newUserUpdate) => {
        // console.log('new new user update!', newUserUpdate)
        //Redirect to all-posts page
       redirectRef.current.click()

      })
      .catch(console.error);
  };

  const expandSection = (e) => {
    console.log(e.current.children[1])
    sectionArray.map((each) => {
      if (e.current === each.current) {
        e.current.style.height = '70%'
        e.current.children[1].style.display = 'flex'
      }
      else {
        each.current.style.height = '5%'
        each.current.children[1].style.display = 'none'
      }
    })
  }

  return (
      <div className="mid-inset profile-mi">

          <div className="login-container profile-lc">
              <div className="input-sections-container">
                {/* <form onSubmit={submit} style={{height: '100%', width: '80%'}}> */}

                  <div className="public-section-container" onClick={(e) => expandSection(publicSect)} ref={publicSect}>
                    <div className="section-header">
                      <div className="section-header-inner">
                        Public
                      </div>
                    </div>
                    <div className="public-input-container hide-public">
                      <div className="edit-photo-section">
                        <div className="edit-photo-inner">
                          <div className="edit-photo-outer">
                            <img src={thisUser.picture} alt="profile photo"></img>
                          </div>
                        </div>
                      </div>

                      <div className="public-sections">
                        <div className="input-sections">
                          <p>Username</p>
                          <div className="user-input profile-user-i">
                            <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="userName" placeholder={thisUser.userName}></input>
                          </div>
                        </div>
                        <div className="input-sections">
                          <p>About</p>
                          <div className="user-input profile-user-i">
                            <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="userAbout" placeholder={thisUser.userAbout}></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="personal-section-container" onClick={(e) => expandSection(personalSect)} ref={personalSect}>
                    <div className="section-header">
                      <div className="section-header-inner">
                        Personal
                      </div>
                    </div>
                    <div className="public-input-container hide-personal">
                      <div className="input-sections">
                        <p>First Name</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="given_name" placeholder={thisUser.given_name}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Last Name</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="family_name" placeholder={thisUser.family_name}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Email</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="email" placeholder={thisUser.email}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="social-section-container" onClick={(e) => expandSection(socialSect)} ref={socialSect}>
                    <div className="section-header">
                      <div className="section-header-inner">
                        Social
                      </div>
                    </div>
                    <div className="public-input-container hide-social">
                      <div className="input-sections">
                        <p>Twitter</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="userTwitter" placeholder={thisUser.userTwitter}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Instagram</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="userInstagram" placeholder={thisUser.userInstagram}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Soundcloud</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="userSoundCloud" placeholder={thisUser.userSoundCloud}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="songs-section-container" onClick={(e) => expandSection(songsSect)} ref={songsSect}>
                    <div className="section-header">
                      <div className="section-header-inner">
                        Songs
                      </div>
                    </div>
                    <div className="public-input-container hide-songs">
                      <div className="input-sections">
                        <p>First Name</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="given_name" placeholder={thisUser.given_name}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Last Name</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="family_name" placeholder={thisUser.family_name}></input>
                        </div>
                      </div>
                      <div className="input-sections">
                        <p>Email</p>
                        <div className="user-input profile-user-i">
                          <input className="user-text profile-user-t" type="text" autoComplete='off' onChange={handleChange} name="email" placeholder={thisUser.email}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* </form> */}
              </div>
              <button type="submit" className="submit-button-edit">
                        Submit
                    </button>
                    <Link to={`/profile/${user._id}`}>
                      <p style={{display: 'none'}} ref={redirectRef}></p>
                    </Link>
          </div>
      </div>
  );
}

export default EditProfile;
