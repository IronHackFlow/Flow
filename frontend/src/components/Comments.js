import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import TheContext from '../TheContext'
import FormatDate from './FormatDate'
import actions from '../api'
import heart2 from '../images/heart2.svg'
import comments from '../images/comment.svg'
import edit from '../images/edit.svg'
import trash from '../images/trashbin.svg'
import send from '../images/send.svg'
import share from '../images/share.svg'
import flag from '../images/flag.svg'

function Comments(props) {
  const { user } = React.useContext(TheContext)

  const [comment, setComment] = useState()
  const [commState, setCommState] = useState([])

  useEffect(() => {
    let commentInView = props.commentsArray.filter((each) => {
      if (each.songId === props.songInView._id) {
        props.setTotalComments(each.comments?.length)
        return each
      }
    })
    let commentDisplay = commentInView[0]?.comments?.map((each, index) => {
      return <GetComments key={`${uuidv4()}comm${each._id}ent${index}`}  {...each} />
    })
    setCommState(commentDisplay)
    
  }, [props.songInView, props.commentsArray])

  
  const resetCommentsArray = (arr) => {
    props.setCommentsArray((prevArr) => {
      return prevArr.map((each) => {
        if (each.songId === props.songInView._id) {
          each.comments = arr
          return each
        } else {
          return each
        }
      })
    })
  }

  const getCommentClass = () => {
    if (props.whichMenu === "Home") {
      if (props.poppedUp === true) {
        return "comment-pop-out comment-popped"
      } else {
        return "comment-pop-out"
      }
    } else {
      if (props.poppedUp === true) {
        return "comment-pop-out songScreen-pop-out songScreen-popped"
      } else {
        return "comment-pop-out songScreen-pop-out"
      }
    }
  }
  
  const handleSubmit = e => {
    e.preventDefault()
    if (comment === undefined) {
      console.log('please type out your comment')
      return null
    }
    actions
      .addComment({
        comment: comment,
        commSong: props.songInView._id,
        commDate: new Date(),
      })
      .then(res => {
        if (res.data.songComments.length) {
          let comments = res.data.songComments
          resetCommentsArray(comments)
          props.setTotalComments(res.data.songComments.length)
        }
      })
      .catch(console.error)
    props.commentInputRef.current.value = ''
  }

  function GetComments(each) {
    const [totalCommentLikes, setTotalCommentLikes] = useState()
    const [checkCommUser, setCheckCommUser] = useState()
    const [menuBool, setMenuBool] = useState(false)
    const [editCommentText, setEditCommentText] = useState(false);

    const likeTextRef = useRef()
    const replyTextRef = useRef()
    const listBtnsRef = useRef()
    const clcThree = useRef()
    const clcFour = useRef()
    const dotMenuRef = useRef()
    const slideOutRef = useRef()

    useEffect(() => {
      setTotalCommentLikes(each.commLikes.length)
    }, [])

    useEffect(() => {
      if (each.commUser?._id === user?._id) {
        setCheckCommUser(true)
      } else {
        setCheckCommUser(false)
      }
    }, [commState])

    useEffect(() => {
      if (editCommentText) {
        document.querySelector(".comment-text-input").focus()
      }
    }, [editCommentText])

    const deleteComment = each => {
      if (user._id === each.commUser._id) {
        actions
          .deleteComment({ deleteObj: each, songId: props.songInView._id })
          .then(res => {
            let comments = res.data.songComments
            resetCommentsArray(comments)
            props.setTotalComments(res.data.songComments.length)
          })
          .catch(console.error)
      } else {
        console.log("You can't delete your friend's comments jerk!")
      }
    }

    const likeCheck = () => {
      console.log(each, "what am I getting here in comment like check")
      actions
        .getAComment({ id: each._id })
        .then(res => {
          let deleteObj = null

          res.data.commLikes.forEach(each => {
            if (each.likeUser === user._id) {
              deleteObj = each
            }
          })

          if (deleteObj === null) {
            likeComment()
          } else {
            unlikeComment(deleteObj)
          }
        })
        .catch(console.error)
    }

    const likeComment = () => {
      actions
        .addLike({ likedComment: each, likeDate: new Date(), commLike: true })
        .then(res => {
          console.log(`added a like to: `, res.data)
          setTotalCommentLikes(res.data.commLikes.length)
        })
        .catch(console.error)
    }

    const unlikeComment = deleteObj => {
      actions
        .deleteLike({ deleteObj: deleteObj, commLike: true })
        .then(res => {
          console.log(`deleted a like from: `, res.data)
          setTotalCommentLikes(res.data.commLikes.length)
        })
        .catch(console.error)
    }

    const menuAnimations = () => {
      if (menuBool === false) {
        likeTextRef.current.style.animation = 'fadeOutText .3s forwards'
        replyTextRef.current.style.animation = 'fadeOutText .3s forwards'
        listBtnsRef.current.style.animation = 'moveBtnsLeft .5s forwards'
        clcThree.current.style.animation = 'opacityToOne .5s forwards'
        clcFour.current.style.animation = 'opacityToOne .5s forwards'
        slideOutRef.current.style.animation = 'popOutBtns .5s forwards'
        setMenuBool(true)
      } else {
        likeTextRef.current.style.animation = 'fadeOutText .3s forwards reverse'
        replyTextRef.current.style.animation = 'fadeOutText .3s forwards reverse'
        listBtnsRef.current.style.animation = 'moveBtnsLeft .5s forwards reverse'
        clcThree.current.style.animation = 'opacityToOne .5s forwards reverse'
        clcFour.current.style.animation = 'opacityToOne .5s forwards reverse'
        slideOutRef.current.style.animation = 'popOutBtns .5s forwards reverse'
        setMenuBool(false)
      }
    }
  
    const setEditCommentBoolean = () => {
      if (editCommentText) {
        setEditCommentText(false)
      } else {
        setEditCommentText(true)
      }
    }
    const [commentValue, setCommentValue] = useState();

    const editCommentTextHandler = (e) => {
      e.preventDefault()
      setCommentValue(e.target.value)
      console.log(commentValue, "what in herre?")
    }

    return (
      <div className="comment-list">
        <div className="comment-list-photo">
          <div className="comment-photo-inner">
            <div className="comment-photo-outer">
              <Link
                to={{
                  pathname: `/profile/${each.commUser?._id}`,
                  profileInfo: each.commUser,
                }}
              >{console.log(each, "lets see")}
                <img src={each.commUser?.picture} alt="user's profile"></img>
              </Link>
            </div>
          </div>
        </div>

        <div className="comment-list-inner">
          <div className="comment-list-outer">
            <p className="comment-username">
              {each.commUser?.userName}
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                {props.songInView?.songUser?._id === each.commUser?._id ? ' 𑁦 song author' : null}
              </span>
            </p>
            <div className="comment-date">
              <FormatDate date={each.commDate} />
            </div>
            {editCommentText ? (
              <textarea 
                className="comment-text-input" 
                defaultValue={each.comment}
                placeholder={each.comment}
                onChange={(e) => editCommentTextHandler(e)}>
              </textarea>
            ) : (
              <p className="comment-text">
                {each.comment}
              </p>
            )}
          </div>

          <div className="comment-list-buttons" ref={listBtnsRef}>
            <div className="comment-likereply-container clc-1">
              <div
                className="comm-likereply-btn clb-1"
                onClick={checkCommUser ? () => deleteComment(each) : likeCheck}
              >
                <img
                  className="social-icons heart"
                  src={checkCommUser ? trash : heart2}
                  alt="delete or like"
                />
                <div className="likes-number-container">
                  <p>{checkCommUser ? '' : totalCommentLikes}</p>
                </div>
              </div>

              <div className="comm-likereply-text" ref={likeTextRef}>
                {checkCommUser ? 'Delete' : 'Like'}
              </div>
            </div>

            {checkCommUser ? (
              <div className="comment-likereply-container clc-2">
                <div className="comm-likereply-btn clb-2" onClick={() => setEditCommentBoolean()}>
                  <img
                    className="social-icons comment"
                    src={edit}
                    alt="edit"
                  />
                </div>
                <div className="comm-likereply-text" ref={replyTextRef}>
                  Edit
                </div>
              </div>
            ) : (
              <div className="comment-likereply-container clc-2">
                <div className="comm-likereply-btn clb-2">
                  <img
                    className="social-icons comment"
                    src={comments}
                    alt="reply"
                  />
                </div>
                <div className="comm-likereply-text" ref={replyTextRef}>
                  Reply
                </div>
              </div>
            )}

            <div className="comment-popout-container" ref={slideOutRef}>
              <div className="comment-likereply-container clc-3" ref={clcThree}>
                <div className="comm-likereply-btn clb-3">
                  <img className="social-icons comment" src={share} alt="share" />
                </div>
                <div className="comm-likereply-text">Share</div>
              </div>

              <div className="comment-likereply-container clc-4" ref={clcFour}>
                <div className="comm-likereply-btn clb-4">
                  <img className="social-icons comment" src={flag} alt="report flag" />
                </div>
                <div className="comm-likereply-text">Report</div>
              </div>

              <div className="dot-menu" onClick={() => menuAnimations()} ref={dotMenuRef}>
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

  return (
    <div className={getCommentClass()}>
      <div className="inner-com">
        <div className="com-cont-1">
          <form className="social-comment-form" onSubmit={(e) => handleSubmit(e)}>
            <input
              className="social-comment-input"
              ref={props.commentInputRef}
              onChange={e => setComment(e.target.value)}
              type="text"
              placeholder="Make a comment..."
            ></input>
            <button className="comment-button">
              <img className="social-icons si-send" src={send} alt="send" />
            </button>
          </form>
        </div>

        <div className="com-cont-2">
          <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{ color: '#e5bdcd' }}>{props.totalComments}</span>
              </p>
            </div>
          </div>

          <div className="comments-container">
            <div className="comment-list-container">
              <div className="comment-list-cont">
                {commState}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comments
