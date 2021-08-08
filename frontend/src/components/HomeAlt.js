import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TheContext from "../TheContext";
import heart from "../images/heart.svg";
import mic from "../images/record2.svg";
import avatar3 from "../images/avatar3.svg";
import backgroundFrame from "../images/bg-frame-2.png";

function Home(props) {
  const { 
    user, setUser, userViewed, 
    setUserViewed, setToggleProfile,
    setToggleSocial, setToggleExplore
  } = React.useContext(TheContext)
    


  // user ? setUserViewed(user) : setUser({})
  // setUserViewed(user)  
  //console.log("HOME - user", user)
  //console.log("HOME - userViewed", userViewed)

  return (
    <div className="Home">
      <div className="img-panel-container">
        <ul className="video-scroll-container">
          <li className="video-pane vp-home" style={{backgroundImage: `url('${backgroundFrame}'), url('https://media.giphy.com/media/3o7bu9IXcehrF9ENUY/source.gif')`}}>
            <div className="test-transparent">
              <h5 style={{color: 'pink'}}>@BlobbyDaBari</h5>
              <h5>Supermassivedopetrack</h5>
            </div>
          </li>
        </ul>
      </div>

      <div className="bottom-directories">
        <div className="bm-dir-container bdc-1">
          <div className="dir-icon di-1">
            <div className="icon-outset io-1">
              <div className="icon-inset ii-1">
                <div className="icon-double-inset idi-1">
                  <Link 
                    to="/social-feed" 
                    onClick={() => {
                        setToggleProfile(false)
                        setToggleExplore(false)
                        setToggleSocial(true)
                    }}>
                    <img className="button-icons home-heart" src={heart} alt="heart" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="dir-route dr-1">
            <div className="route-outset">
              <div className="route-inset">
                <div className="route-double-inset">
                  <Link 
                    to="/social-feed" 
                    onClick={() => {
                        setToggleProfile(false)
                        setToggleExplore(false)
                        setToggleSocial(true)
                    }}>
                    <h4>Social Feed</h4>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bm-dir-container bdc-2">
          <div className="dir-icon di-2">
            <div className="icon-outset io-2">
              <div className="icon-inset ii-2">
                <div className="icon-double-inset idi-2">
                  <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")}>
                    <img className="button-icons home-record" src={mic} alt="mic" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="dir-route dr-2">
              <div className="route-outset route-o2">
                  <div className="route-inset route-i2">
                      <div className="route-double-inset route-di2">
                          <Link to={userViewed._id ? ("/recordingBooth") : ("/auth")}>
                              <h4>Flow</h4>
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        <div className="bm-dir-container bdc-3">
          <div className="dir-icon di-3">
            <div className="icon-outset io-3">
              <div className="icon-inset ii-3">
                <div className="icon-double-inset idi-3">
                  <Link 
                    to={user._id ? {pathname: `/profile/${user._id}`, profileInfo: user } : ("/auth")}
                    onClick={setToggleProfile(true)}
                    >
                    <img className="button-icons home-avatar" src={avatar3} alt="home" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="dir-route dr-3">
            <div className="route-outset">
              <div className="route-inset">
                <div className="route-double-inset">
                  <Link 
                    to={user._id ? {pathname: `/profile/${user._id}`, profileInfo: user } : ("/auth")}
                    onClick={setToggleProfile(true)}
                    >
                    <h4>Profile</h4>                                    
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
