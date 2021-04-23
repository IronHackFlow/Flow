import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from 'react-router-dom'
import TheContext from "../TheContext"
import actions from '../api'

function Comments(props) {
  const {
    songComments, songId
    } = React.useContext(
    TheContext
  );

  let commentUsers = []
  const [comment, setComment] = useState();

  useEffect(() => {
    commentUsers = []
    songComments.map((each) => {
      actions
      .getAUser({id: each.commUser})
      .then((res) => {
        commentUsers.push({ user: res.data, comment: each.comment })
      }).catch((e) => {
        console.log('failed to get name', e)
      })
    })
  }, [songComments])

  // const getCommentWriter = (num) => {
  //   actions
  //   .getAUser({id: num})
  //   .then((res) => {
  //     writerArray.push(res.data.userName)
  //   }).catch((e) => {
  //     console.log('failed to get name', e)
  //   })
  // }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(comment, songId)
    actions.addComment({comment, songId})
  }

  const renderEachComment = useCallback(() => {
    return commentUsers.map((each, index) => {
      return (
        <div key={index} className="comment-list">
          <div className="comment-list-photo">
            <div className="comment-photo-inner">
              <div className="comment-photo-outer">
                <Link to={{pathname: `/profile/other/${each.user?._id}`, profileInfo: each.user}}>
                  <img src={each.user?.picture} alt="user's profile"></img>
                </Link>
              </div>
            </div>
          </div>

          <div className="comment-list-inner">
            <div className="comment-list-outer">
              <p className="comment-username">
                {each.user.userName}
              </p>
              <p className="comment-text">
                {each.comment}
              </p>
            </div>
          </div>
        </div>
      )
    })
  }, [songComments])


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
    </div>  
  );
}

export default Comments;
