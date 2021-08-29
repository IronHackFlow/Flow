import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import TheContext from "../TheContext";
import TheViewContext from "../TheViewContext";
import actions from "../api";
import heart2 from "../images/heart2.svg";
import comments from "../images/comment.svg";
import edit from "../images/edit.svg";
import trash from "../images/trashbin.svg";
import send from "../images/send.svg";
import share from "../images/share.svg";
import flag from "../images/flag.svg";
import moment from "moment";

function Comments(props) {
  const {
    songInView, totalComments, setTotalComments
  } = React.useContext(TheViewContext);

  const {
    user
  } = React.useContext(TheContext);
  
  const [comment, setComment] = useState();
  const [commState, setCommState] = useState([]);
  const [songCommUser, setSongCommUser] = useState();
  // const [totalComments, setTotalComments] = useState([]);

  const renderRef = useRef(0);

  useEffect(() => {
    actions
      .getComments({ id: songInView._id })
      .then((res) => {
        console.log('Returned these comments from DB: ', res.data)
        setCommState(res.data.songComments);
        setTotalComments(res.data.songComments.length);
        setSongCommUser(res.data.songUser);
      })
      .catch(console.error)
  }, [songInView, totalComments])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (comment === undefined) {
      console.log("please type out your comment")
      return null
    }
    actions
      .addComment({ comment: comment, 
                    commSong: songInView._id,
                    commDate: new Date() })
      .then((res) => {
        console.log(res.data, "comment data")
        setTotalComments(res.data.songComments.length)
      })
      .catch(console.error);

    setTimeout(()=> {
      props.commentInputRef.current.value =  ""
    }, [200])
  }

  function GetComments(each) {
    const [totalCommentLikes, setTotalCommentLikes] = useState();
    const [checkCommUser, setCheckCommUser] = useState();
    const [menuBool, setMenuBool] = useState(false);

    const commentListRef = useRef();
    const commentTextRef = useRef();
    const commentListOuterRef = useRef();    
    const likeTextRef = useRef();
    const replyTextRef = useRef();
    const listBtnsRef = useRef();
    const clcThree = useRef();
    const clcFour = useRef();
    const dotMenuRef  = useRef();
    const slideOutRef = useRef();

    useEffect(() => {
      setTotalCommentLikes(each.commLikes.length)
    }, [])

    useEffect(() => {
      if (each.commUser._id === user._id) {
        setCheckCommUser(true)
      }
      else {
        setCheckCommUser(false)
      }
    }, [commState])

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
        .deleteComment({ deleteObj: each, songId: songInView._id })
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
              <span style={{color: "white", fontWeight: "bold", fontSize: "12px"}}>{songCommUser === each.commUser._id ? " 𑁦 song author" : null}</span>
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
              <div className="comm-likereply-btn clb-1" onClick={checkCommUser ? () => deleteComment(each) : likeCheck}>
                <img className="social-icons heart" src={checkCommUser ? trash : heart2 } alt="delete or like" />
                <div className="likes-number-container">
                  <p>{checkCommUser ? "" : totalCommentLikes}</p>
                </div>
              </div>
              <div className="comm-likereply-text" ref={likeTextRef}>
                {checkCommUser ? "Delete" : "Like"}
              </div>
            </div>

            <div className="comment-likereply-container clc-2">
              <div className="comm-likereply-btn clb-2">
                <img className="social-icons comment" src={checkCommUser ? edit : comments} alt="edit or reply" />
              </div>
              <div className="comm-likereply-text" ref={replyTextRef}>
                {checkCommUser ? "Edit" : "Reply"}
              </div>
            </div>

            <div className="comment-popout-container" ref={slideOutRef}>
              <div className="comment-likereply-container clc-3" ref={clcThree}>
                <div className="comm-likereply-btn clb-3">
                  <img className="social-icons comment" src={share} alt="share" />
                </div>
                <div className="comm-likereply-text">
                  Share
                </div>
              </div>

              <div className="comment-likereply-container clc-4" ref={clcFour}>
                <div className="comm-likereply-btn clb-4">
                  <img className="social-icons comment" src={flag} alt="report flag" />
                </div>
                <div className="comm-likereply-text">
                  Report
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
    <div ref={props.commentPopUpRef} className="comment-pop-out">
      <div className="inner-com">
      {/* {console.log(`checking renders, ${renderRef.current++}`)} */}
        <div ref={props.opacityRef1} style={{opacity: '0'}} className="com-cont-1">
          <form className="social-comment-form" onSubmit={handleSubmit}>
            <input
              className="social-comment-input"
              ref={props.commentInputRef}
              onChange={(e) => setComment(e.target.value)}
              type='text' 
              placeholder='Make a comment...' 
              ></input>
            <button className="comment-button" ref={props.commentButtonRef}>
              <img className="social-icons si-send" src={send} alt="send" />
            </button>
          </form>
        </div>
 
        <div className="com-cont-2" ref={props.opacityRef2} style={{opacity: '0'}}>
          <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{color: '#ec6aa0'}}>{totalComments}</span>
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
