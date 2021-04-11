import React, { useEffect, useState, useRef } from "react";
import TheContext from "../TheContext"
import actions from '../api'

function Comments(props) {
  const {
    writer, setWriter,
    getSongComments, setGetSongComments,
    getSongName, setGetSongName
    } = React.useContext(
    TheContext
  );
  const [comment, setComment] = useState();

  const handleSubmit =(e)=>{
    e.preventDefault()
    actions.addComment({comment, getSongName})
  }

  const getCommentWriter=(num)=>{
    actions
    .getAUser({id: num})
    .then((res)=>{
      setWriter( `@${res.data.userName}`)
      
    }).catch((e)=>{
      console.log('failed to get name')
    })
  }

  const renderEachComment = ()=>{
    if(!getSongComments){
    }
    else {
      return getSongComments.map((each)=>{
        getCommentWriter(each.commUser)
        return (
          <div className="comment-list">
            <div className="comment-list-inner">
              <p className="comment-username">
                  {writer}
              </p>
              <p className="comment-text">
                {each.comment}
              </p>
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
                    placeholder='Drop yo comment' 
                    ></input>
              </form>
            </div>
          </div>
        </div>

        <div ref={props.opacityRef2} style={{opacity: '0'}} className="com-cont-2">
          <div className="comments-container">
            <div className="comment-list-container">
               {renderEachComment()}
            </div>
          </div>
        </div>
      </div>

      <div ref={props.opacityRef3} style={{ opacity: "0" }} className="bottom-bar">
        <div className="inner-bar"></div>
      </div>
    </div>  
  );
}

export default Comments;
