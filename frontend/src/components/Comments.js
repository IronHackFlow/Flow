import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from 'react-router-dom'
import TheContext from "../TheContext"
import actions from '../api'
import heart2 from "../images/heart2.svg";
import comments from "../images/comment.svg";
import edit from "../images/edit.svg";
import trash from "../images/trashbin.svg";
import moment from 'moment'



function Comments(props) {
  const {
    user, songId
    } = React.useContext(
    TheContext
  );

  const [comment, setComment] = useState();
  const [commState, setCommState] = useState([])
  const inputRef = useRef();

  useEffect(() => {
    actions
      .getComments({ id: songId })
      .then((res) => {
        console.log('Returned these comments from DB: ', res.data.songComments)
        setCommState(res.data.songComments)
      })
      .catch(console.error)
  }, [songId])

  const handleSubmit = (e) => {
    e.preventDefault()
    actions
      .addComment({ comment: comment, 
                    commSong: songId,
                    commDate: new Date() })
      .then((res) => {
        console.log(res, "comment data ")
      })
      .catch(console.error);

    setTimeout(()=> {
      inputRef.current.value =  ""
    }, [200])
  }
  
  const deleteComment = (each) => {
    if (user._id === each.commUser._id) {
      actions
      .deleteComment({ deleteObj: each, songId: songId })
      .then((res) => {
        console.log(`deleted a comment from song ${res.data.songName}'s songComments:`, res.data.songComments)

      })
      .catch(console.error)
    } 
    else {
      console.log("You can't delete others' comments jerk!")
    }
  }

  function GetComments(each) {
    const commentListRef = useRef();
    const commentTextRef = useRef();
    const commentListOuterRef = useRef();  

    const setCommentListRefs = useCallback(
      (node) => {
        commentListRef.current = node;

        if (commentTextRef.current !== null && commentListRef.current !== null) {
          if (commentTextRef.current.scrollHeight > 20) {
            let commentText = commentTextRef.current.scrollHeight
            let commentListOuter = commentText + 47
            let commentList = commentListOuter + 60
            commentTextRef.current.style.height = `${commentText}px`
            commentListOuterRef.current.style.height = `${commentListOuter}px`
            commentListRef.current.style.minHeight = `${commentList}px`
          }
        }
      },
      [props.popUpComments]
    )
    const likeTextRef = useRef()
    const replyTextRef = useRef()
    const listBtnsRef = useRef()
    const clcThree = useRef()
    const clcFour = useRef()
    const dotMenuRef  = useRef()
    const slideOutRef = useRef()

    const buttonAnims = (e) => {
      likeTextRef.current.style.animation = 'fadeOutText .5s forwards'
      replyTextRef.current.style.animation = 'fadeOutText .5s forwards'
      listBtnsRef.current.style.animation = 'moveBtnsLeft .5s forwards'
      clcThree.current.style.animation = 'showDelAndEdit .5s forwards'
      clcFour.current.style.animation = 'showDelAndEdit .5s forwards'
      slideOutRef.current.style.animation = 'popOutBtns .5s forwards'
    
    }
    return (
      <div className="comment-list" ref={setCommentListRefs}>
        <div className="comment-list-photo">
          <div className="comment-photo-inner">
            <div className="comment-photo-outer">
              <Link to={{pathname: `/profile/other/${each.commUser._id}`, profileInfo: each.commUser}}>
                <img src={each.commUser.picture} alt="user's profile"></img>
              </Link>
            </div>
          </div>
        </div>

        <div className="comment-list-inner">
          <div className="comment-list-outer" ref={commentListOuterRef}>
            <p className="comment-username">
              {each.commUser.userName}
            </p>
            <p className="comment-date">
              {each.commDate ? moment(each.commDate).fromNow() : '5 months ago'}
            </p>
            <p className="comment-text" ref={commentTextRef}>
              {each.comment}
            </p>
          </div>
          <div className="comment-list-buttons" ref={listBtnsRef}>
            <div className="comment-likereply-container clc-1">
              <div className="comm-likereply-btn clb-1">
                <img className="social-icons heart" src={heart2} alt="like" />
              </div>
              <div className="comm-likereply-text" ref={likeTextRef}>
                Like
              </div>
            </div>
            <div className="comment-likereply-container clc-2">
              <div className="comm-likereply-btn clb-2">
                <img className="social-icons comment" src={comments} alt="reply" />
              </div>
              <div className="comm-likereply-text" ref={replyTextRef}>
                Reply
              </div>
            </div>
            <div className="comment-popout-container" ref={slideOutRef}>
              <div className="comment-likereply-container clc-3" ref={clcThree}>
                <div className="comm-likereply-btn clb-3" onClick={() => deleteComment(each)}>
                  <img className="social-icons comment" src={trash} alt="reply" />
                </div>
                <div className="comm-likereply-text">
                  Delete
                </div>
              </div>

              <div className="comment-likereply-container clc-4" ref={clcFour}>
                <div className="comm-likereply-btn clb-4">
                  <img className="social-icons comment" src={edit} alt="reply" />
                </div>
                <div className="comm-likereply-text">
                  Edit
                </div>
              </div>
              <div className="dot-menu" onClick={(e) => buttonAnims(e)} ref={dotMenuRef}>
                <div className="dots"></div>
                <div className="dots"></div>
                <div className="dots"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderEachComment = useCallback(() => {
    if (props.poppedUp === true) {
      console.log('rendered some comments')
      return commState.map((each, index) => {
        return <GetComments key={each._id + index} {...each} />
      })
    }
    else {
      return null
    }
  }, [props.poppedUp, commState])

  return (
    <div ref={props.popUpRef} className="comment-pop-out">
      <div className="inner-com">
      {/* {console.log(`checking renders, ${renderRef.current++}`)} */}
        <div ref={props.opacityRef1} style={{opacity: '0'}} className="com-cont-1">
          <div className="input-container">
            <div className="input-inset">
              <form className="social-comment-form" onSubmit={handleSubmit}>
                <input
                    className="social-comment-input"
                    ref={inputRef}
                    type='text' 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Make a comment...' 
                    ></input>
              </form>
            </div>
          </div>
        </div>

        <div className="com-cont-2" ref={props.opacityRef2} style={{opacity: '0'}}>
          <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{color: 'red'}}>{commState.length}</span>
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
