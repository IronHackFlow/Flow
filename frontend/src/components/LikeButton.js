import { useContext, useEffect, useState} from 'react';
import TheContext from "../contexts/TheContext"
import { SongDataContext } from "../contexts/SongData"
import usePostLike from "../utils/usePostLike"
import { thumbsUpIcon } from "../assets/images/_icons"

export default function LikeButton({ songInView, btnStyle }) {
  const { user } = useContext(TheContext)
  const { isLoading } = useContext(SongDataContext)
  const songId = songInView?._id
  const userId = user?._id
  const likes = songInView?.song_likes
  
  const { addSongLike, deleteSongLike } = usePostLike()
  const [isLiked, setIsLiked] = useState()
  const [totalLikes, setTotalLikes] = useState()
  const [usersLike, setUsersLike] = useState()

  useEffect(() => {
    setIsLiked(false)
    setTotalLikes(likes?.length)

    for (let i = 0; i < likes?.length; i++) {
      if (likes[i].user === userId) {
        setIsLiked(true)
        setUsersLike(likes[i])
        break
      }
    }
  }, [songInView])

  if (btnStyle === "home") {
    return (
        <>
        {isLiked
          ? (
            <button 
              className="action-btn_shadow-div-outset liked-followed-commented"
              onClick={() => { 
                deleteSongLike(
                  songId,
                  usersLike
                );
                setIsLiked(false)
                setTotalLikes(prev => prev - 1)
              }}
            >
              <div className="action-btn-icon_shadow-div-inset">
                <img className="social-icons like" src={thumbsUpIcon} alt="like post icon" />
              </div>
              <div className="action-btn-container">
                <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                </div>
                <div className="action-btn-text">
                  <p style={{ color: 'white' }}>{totalLikes}</p>
                  <p>
                    {totalLikes === 1
                      ? "Like"
                      : "Likes"
                    }
                  </p>
                </div>
              </div>
            </button>
          )
          : (
            <button 
              className="action-btn_shadow-div-outset"
              onClick={() => { 
                addSongLike(
                  songId,
                  setUsersLike 
                )
                setIsLiked(true)
                setTotalLikes(prev => prev + 1)
              }}
            >
              <div className="action-btn-icon_shadow-div-inset">
                <img className="social-icons like" src={thumbsUpIcon} alt="like post icon" />
              </div>
              <div className="action-btn-container">
                <div className="loading loading-btn" style={isLoading ? {opacity: "1"} : {opacity: "0"}}>
                </div>
                <div className="action-btn-text">
                  <p style={{ color: 'white' }}>{totalLikes}</p>
                  <p>
                    {totalLikes === 1
                      ? "Like"
                      : "Likes"
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
      {isLiked 
        ? (
          <div className="social-button-container">
          <button 
            className="social-button pushed"
            onClick={(e) => { 
              e.target.style.transition = "all .2s ease-in"
              deleteSongLike(
                songId,
                usersLike
              );
              setIsLiked(false)
              setTotalLikes(prev => prev - 1)
            }}
          >
            <img className="social-icons heart" src={thumbsUpIcon} alt="like post icon"></img>
          </button>
          <div className="button-title">
            <p style={{color: '#ff3b8c'}}>{totalLikes}</p>
            <p>
              {totalLikes === 1
                ? "Like"
                : "Likes"
              }
            </p>
          </div>
        </div>
        )
        : (
          <div className="social-button-container">
            <button 
              className="social-button"
              onClick={(e) => { 
                e.target.style.transition = "all .2s ease-in"
                addSongLike(
                  songId,
                  setUsersLike 
                )
                setIsLiked(true)
                setTotalLikes(prev => prev + 1)
              }}
            >
              <img className="social-icons heart" src={thumbsUpIcon} alt="like post icon"></img>
            </button>
            <div className="button-title">
              <p style={{color: '#ff3b8c'}}>{totalLikes}</p>
              <p>
                {totalLikes === 1
                  ? "Like"
                  : "Likes"
                }
              </p>
            </div>
          </div>
        )}
      </>
    )
  }
}
