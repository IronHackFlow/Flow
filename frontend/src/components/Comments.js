import React, { useEffect, useState, useRef } from "react";
import TheContext from "../TheContext"
import actions from '../api'

function Comments(props) {
  const {
    writer, setWriter
    } = React.useContext(
    TheContext
  );

  // const handleSubmit =(e)=>{
  //   e.preventDefault()
  //   actions.addComment({comment, SONG})
  // }

  const getCommentWriter=(num)=>{
    actions
    .getAUser({id: num})
    .then((res)=>{
      setWriter( `@${res.data.userName}`)
      
    }).catch((e)=>{
      console.log('failed to get name')
    })
  }

  // const renderEachComment = ()=>{
  //   if(!SONG.songComments){
  //   }
  //   else {
  //     return SONG.songComments.map((each)=>{
  //       getCommentWriter(each.commUser)
  //       return (
  //         <div className="comment-list">
  //           <div className="comment-list-inner">
  //             <p className="comment-username">
  //                 {writer}
  //             </p>
  //             <p className="comment-text">
  //               {each.comment}
  //             </p>
  //           </div>
  //         </div>
  //       )
  //     })
  //   }
  // }

  // onSubmit={handleSubmit}
  return (
    <div ref={props.popUpRef} className="comment-pop-out">
      <div className="inner-com">

        <div ref={props.opacityRef1} style={{opacity: '0'}} className="com-cont-1">
          <div className="input-container">
            <div className="input-inset">
              <form className="social-comment-form" >
                <input
                    className="social-comment-input" 
                    type='text' 
                    // onChange={(e) => setComment(e.target.value)}
                    placeholder='Drop yo comment' 
                    ></input>
              </form>
            </div>
          </div>
        </div>

        <div ref={props.opacityRef2} style={{opacity: '0'}} className="com-cont-2">
          <div className="comments-container">
            <div className="comment-list-container">
               {/* {renderEachComment()} */}
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
