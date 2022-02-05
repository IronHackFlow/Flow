import { useContext, useEffect, useState, memo } from 'react';
import TheContext from '../contexts/TheContext';
import { SongDataContext } from '../contexts/SongData';
import usePostFollow from '../utils/usePostFollow';
import { followIcon } from '../assets/images/_icons';


export default function FollowButton({songInView, btnStyle}) {
  const { user } = useContext(TheContext)
  const { isLoading } = useContext(SongDataContext)
  const songUserId = songInView?.song_user._id
  const userId = user?._id
  const followers = songInView?.song_user.followers
  
  const { deleteFollow, postFollow } = usePostFollow()
  const [totalFollowers, setTotalFollowers] = useState()
  const [isFollowed, setIsFollowed] = useState()
  const [usersFollow, setUsersFollow] = useState({})

  useEffect(() => {
    setIsFollowed(false)
    setTotalFollowers(followers?.length)

    for (let i = 0; i < followers?.length; i++) {
      if (followers[i].user === userId) {
        setIsFollowed(true)
        setUsersFollow(followers[i])
        break
      }
    }
  }, [songInView])

  if (btnStyle === "home") {
    return (
      <>
        {isFollowed
          ? (
            <button
              className="action-btn_shadow-div-outset liked-followed-commented"
              style={{ borderRadius: '50px 5px 5px 50px' }}
              onClick={() => { 
                deleteFollow(
                  songUserId,
                  usersFollow
                );
                setIsFollowed(false)
                setTotalFollowers(prev => prev - 1)
              }}
            >
              <div
                className="action-btn-icon_shadow-div-inset"
                style={{ borderRadius: '40px 4px 4px 40px' }}
              >
                <img
                  className="social-icons follow"
                  src={followIcon}
                  alt="follow user icon"
                />
              </div>
              <div className="action-btn-container">
                <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                </div>
                <div className="action-btn-text">
                  <p style={{ color: 'white' }}>{totalFollowers}</p>
                  <p>
                    {totalFollowers === 1
                      ? "Follow"
                      : "Follows"
                    }
                  </p>
                </div>
              </div>
            </button>
          )
          : (
            <button
              className="action-btn_shadow-div-outset"
              style={{ borderRadius: '50px 5px 5px 50px' }}
              onClick={() => { 
                postFollow(
                  songUserId,
                  setUsersFollow
                );
                setIsFollowed(true)
                setTotalFollowers(prev => prev + 1)
              }}
            >
              <div
                className="action-btn-icon_shadow-div-inset"
                style={{ borderRadius: '40px 4px 4px 40px' }}
              >
                <img
                  className="social-icons follow"
                  src={followIcon}
                  alt="follow user icon"
                />
              </div>
              <div className="action-btn-container">
                <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                </div>
                <div className="action-btn-text">
                  <p style={{ color: 'white' }}>{totalFollowers}</p>
                  <p>
                    {totalFollowers === 1
                      ? "Follow"
                      : "Follows"
                    }
                  </p>
                </div>
              </div>
            </button>
          )
        } 
      </>
    )
  } else {
    return (
      <>
        {isFollowed 
          ? (
            <div className="social-button-container">
              <button 
                className="social-button pushed"
                onClick={() => { 
                  deleteFollow(
                    songUserId,
                    usersFollow
                  );
                  setIsFollowed(false)
                  setTotalFollowers(prev => prev - 1)
                }}
              > 
                <img className="social-icons follow" src={followIcon} alt="follow user icon"></img>
              </button>
              <div className="button-title">
                <p style={{ color: '#ff3b8c' }}>{totalFollowers}</p>
                <p>
                  {totalFollowers === 1
                    ? "Follower"
                    : "Followers"
                  }
                </p>
              </div>
            </div>
          )
          : (
            <div className="social-button-container">
              <button 
                className="social-button"
                onClick={() => { 
                  postFollow(
                    songUserId,
                    setUsersFollow
                  );
                  setIsFollowed(true)
                  setTotalFollowers(prev => prev + 1)
                }}
              > 
                <img className="social-icons follow" src={followIcon} alt="follow user icon"></img>
              </button>
              <div className="button-title">
                <p style={{ color: '#ff3b8c' }}>{totalFollowers}</p>
                <p>
                  {totalFollowers === 1
                    ? "Follower"
                    : "Followers"
                  }
                </p>
              </div>
            </div>
          )
        }
      </>
    )
  }
}