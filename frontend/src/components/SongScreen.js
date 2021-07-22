import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import actions from "../api";
import TheContext from "../TheContext";
import follow from "../images/follow.svg";
import comments from "../images/comment.svg";
import search from "../images/search.svg";
import heart2 from "../images/heart2.svg";
import gifsArr from "../images/gifs.json";
import gradientbg from "../images/gradient-bg-2.png"

function SongScreen(props) {
  const {
    user, userViewed, songId, 
    toggleSocial, setToggleSocial,
    toggleExplore, setToggleExplore,
    songComments
    } = React.useContext(
    TheContext
  );

  let gifsCopy = [...gifsArr]
  const [totalFollowers, setTotalFollowers] = useState();
  const [totalLikes, setTotalLikes] = useState();
  const followBtn = useRef();

  useEffect(() => {
    setTotalFollowers(props.songUserFollowers?.length)
  }, [props.songUserFollowers])

  useEffect(() => {
    setTotalLikes(props.songLikes?.length)
  }, [props.songLikes])

  const getRandomBackground = () => {
    let index = Math.floor(Math.random()*gifsCopy.length)
    return gifsCopy[index].url
  }

  const followCheck = () => {
    if (user._id === userViewed._id) {
      console.log(`You can't follow yourself lol`)
      return null
    }
    actions
      .getAUser({ id: user._id })
      .then((res) => {
        let deleteObj = null

        res.data.userFollows.forEach((each) => {
          if (each.followed === userViewed._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          followUser()
        }
        else {
          deleteFollow(deleteObj)
        }
      })
      .catch(console.error)
  }

  const likeCheck = () => {
    actions
      .getSong({ id: songId })
      .then((res) => {
        let deleteObj = null

        res.data.songLikes.forEach((each) => {
          if (each.likeUser === user._id) {
            deleteObj = each
          }
        })

        if (deleteObj === null) {
          likePost()
        }
        else {
          deleteLike(deleteObj)
        }
      })
      .catch(console.error)
  }

  const followUser = () => {
    actions
      .addFollow({ followedUser: userViewed._id, 
                   followDate: new Date() })
      .then((res) => {
        console.log(`added a follow to: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error);
  };

  const deleteFollow = (deleteObj) => {
    actions
      .deleteFollow({ followedUser: userViewed._id, deleteObj: deleteObj })
      .then((res) => {
        console.log(`deleted a follow from: `, res.data)
        setTotalFollowers(res.data.followers.length)
      })
      .catch(console.error)
  };

  const likePost = () => {
    actions
      .addLike({ likerSong: songId, likeDate: new Date(), commLike: false })
      .then((res) => {
        console.log(`added a like to: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };

  const deleteLike = (deleteObj) => {
    actions
      .deleteLike({ likerSong: songId, deleteObj: deleteObj, commLike: false })
      .then((res) => {
        console.log(`deleted a like from: `, res.data)
        setTotalLikes(res.data.songLikes.length)
      })
      .catch(console.error);
  };
//style={{backgroundImage: `url('${gradientbg}'), url(${getRandomBackground()})`}}
  return (
    <div className="SongScreen" style={{backgroundImage: `url('${gradientbg}'), url(${getRandomBackground()})`}}>
      <div className="song-video-frame">
        <div className="song-video-inner">
          <div className="song-video-outer" >
            
          </div>
        </div>

        <div className="song-video-floater">
        </div>
      </div>

      <div className="song-details-container">
        <div className="song-details">
          <div className="song-details-inner">
            <div className="song-details-outer">
              
            </div>
          </div>
        </div>
        
        <div className="social-buttons">
          <div className="social-list">
            <div className="individual-container">
              <div className="individual-btn" onClick={followCheck} ref={followBtn}>
                <img className="social-icons follow" src={follow} alt="follow user icon"></img>
              </div>
              <div className="individual-text">
                <p>Follow</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" onClick={likeCheck}>
                <img className="social-icons heart" src={heart2} alt="like post icon"></img>
              </div>
              <div className="individual-text">
                <p>Like</p>
              </div>
            </div>

            <div className="individual-container">
              <div className="individual-btn" ref={props.commentBtn} onClick={props.popUpComments}>
                <img className="social-icons comment" src={comments} alt="comment on post icon"></img>
              </div>
              <div className="individual-text">
                <p>Comment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SongScreen;
