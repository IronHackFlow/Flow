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
  const [totalComments, setTotalComments] = useState([])
  const inputRef = useRef();
  const renderRef = useRef(0)

  useEffect(() => {
    actions
      .getComments({ id: songId })
      .then((res) => {
        console.log('Returned these comments from DB: ', res.data.songComments)
        setCommState(res.data.songComments)
        setTotalComments(res.data.songComments.length)
      })
      .catch(console.error)
  }, [songId, totalComments])

  const handleSubmit = (e) => {
    e.preventDefault()
    actions
      .addComment({ comment: comment, 
                    commSong: songId,
                    commDate: new Date() })
      .then((res) => {
        console.log(res.data, "comment data")
        setTotalComments(res.data.songComments.length)
      })
      .catch(console.error);
    setTimeout(()=> {
      inputRef.current.value =  ""
    }, [200])
  }

  function GetComments(each) {
    const [totalCommentLikes, setTotalCommentLikes] = useState();
    const commentListRef = useRef();
    const commentTextRef = useRef();
    const commentListOuterRef = useRef();

    useEffect(() => {
      setTotalCommentLikes(each.commLikes.length)
    }, [totalCommentLikes])

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
      [commState]
    )

    const deleteComment = (each) => {
      if (user._id === each.commUser._id) {
        actions
        .deleteComment({ deleteObj: each, songId: songId })
        .then((res) => {
          console.log(`deleted a comment from song ${res.data.songName}'s songComments:`, res.data.songComments)
          setTotalComments(res.data.songComments.length)
        })
        .catch(console.error)
      } 
      else {
        console.log("You can't delete your friend's comments jerk!")
      }
    }

    const likeCheck = () => {
      actions
        .getAComment({ id: each._id })
        .then((res) => {
          let deleteObj = null
  
          res.data.commLikes.forEach((each) => {
            if (each.likeUser === user._id) {
              deleteObj = each
            }
          })
  
          if (deleteObj === null) {
            likeComment()
          }
          else {
            unlikeComment(deleteObj)
          }
        })
        .catch(console.error)
    }

    const likeComment = () => {
      actions
        .addLike({ likedComment: each, likeDate: new Date(), commLike: true })
        .then((res) => {
          console.log(`added a like to: `, res.data)
          setTotalCommentLikes(res.data.commLikes.length)
        })
        .catch(console.error);
    }

    const unlikeComment = (deleteObj) => {
      actions
        .deleteLike({ deleteObj: deleteObj, commLike: true })
        .then((res) => {
          console.log(`deleted a like from: `, res.data)
          setTotalCommentLikes(res.data.commLikes.length)
        })
        .catch(console.error);
    }

    const likeTextRef = useRef()
    const replyTextRef = useRef()
    const listBtnsRef = useRef()
    const clcThree = useRef()
    const clcFour = useRef()
    const dotMenuRef  = useRef()
    const slideOutRef = useRef()
    const [menuBool, setMenuBool] = useState(false)
 
    const menuAnimations = (e) => {
      if (menuBool === false) {
        likeTextRef.current.style.animation = 'fadeOutText .3s forwards'
        replyTextRef.current.style.animation = 'fadeOutText .3s forwards'
        listBtnsRef.current.style.animation = 'moveBtnsLeft .5s forwards'
        clcThree.current.style.animation = 'opacityToOne .5s forwards'
        clcFour.current.style.animation = 'opacityToOne .5s forwards'
        slideOutRef.current.style.animation = 'popOutBtns .5s forwards'
        setMenuBool(true)
      }
      else {
        likeTextRef.current.style.animation = 'fadeOutText .3s forwards reverse'
        replyTextRef.current.style.animation = 'fadeOutText .3s forwards reverse'
        listBtnsRef.current.style.animation = 'moveBtnsLeft .5s forwards reverse'
        clcThree.current.style.animation = 'opacityToOne .5s forwards reverse'
        clcFour.current.style.animation = 'opacityToOne .5s forwards reverse'
        slideOutRef.current.style.animation = 'popOutBtns .5s forwards reverse'
        setMenuBool(false)
      }
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
              <div className="comm-likereply-btn clb-1" onClick={likeCheck}>
                <img className="social-icons heart" src={heart2} alt="like" />
                <div className="likes-number-container">
                  <p>{totalCommentLikes}</p>
                </div>
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
              <div className="dot-menu" onClick={(e) => menuAnimations(e)} ref={dotMenuRef}>
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
 
        <div className="com-cont-2" ref={props.opacityRef2} style={{opacity: '0'}}>
          <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{color: 'red'}}>{totalComments}</span>
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
