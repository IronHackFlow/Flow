import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom'
import TheContext from "../TheContext"
import actions from '../api'

function Comments(props) {
  const {
    songComments, setSongComments,
    songLikeId, setSongLikeId,
    getSongName, setGetSongName,
    } = React.useContext(
    TheContext
  );

  const [writer, setWriter] = useState();
  const [comment, setComment] = useState();
  const [commenterData, setCommenterData] = useState({})
  const [photo, setPhoto] = useState();

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(comment, songLikeId)
    actions.addComment({comment, songLikeId})
  }

  const getCommentWriter = (num) => {
    actions
    .getAUser({id: num})
    .then((res) => {
      setWriter( `@${res.data.userName}`)
      setPhoto(res.data.picture)
    }).catch((e) => {
      console.log('failed to get name')
    })
  }

  function renderEachComment() {
    if(!songComments){
    }
    else {
      return songComments.map((each, i) => {
        getCommentWriter(each.commUser)
        return (
          <div key={i} className="comment-list">
            <div className="comment-list-photo">
              <div className="comment-photo-inner">
                <div className="comment-photo-outer">
                  <Link to="">
                    <img src={photo} alt="user's profile"></img>
                  </Link>
                </div>
              </div>
            </div>
            <div className="comment-list-inner">
              <div className="comment-list-outer">
                <p className="comment-username">
                  {/* <Link to={{pathname:`/profile/other/${ele.profile._id}`, profileInfo: each.commUser}}> */}
                    {writer}
                  {/* </Link> */}
                </p>
                <p className="comment-text">
                  {each.comment}
                </p>
              </div>
            </div>
          </div>
        )
      })
    }
  }


  return (
    <div ref={props.popUpRef} className="comment-pop-out">
      <div className="inner-com">

        <div ref={props.opacityRef1} style={{opacity: '0'}} className="com-cont-1">
          <div className="input-container">
            <div className="input-inset">
              <form className="social-comment-form" onSubmit={handleSubmit}>
                <input
                    className="social-comment-input" 
                    type='text' 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Add a public comment...' 
                    ></input>
              </form>
            </div>
          </div>
        </div>

        <div className="com-cont-2" ref={props.opacityRef2} style={{opacity: '0'}}>
          <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{color: 'red'}}>{songComments.length}</span>
              </p>
            </div>
          </div>
          <div className="comments-container">
            <div className="comment-list-container">
               {renderEachComment()}
            </div>
          </div>
        </div>
      </div>
{/* 
      <div ref={props.opacityRef3} style={{ opacity: "0" }} className="bottom-bar">
        <div className="inner-bar"></div>
      </div> */}
    </div>  
  );
}

export default Comments;
