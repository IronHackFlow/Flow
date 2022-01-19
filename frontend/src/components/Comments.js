import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import TheContext from '../contexts/TheContext'
import TheViewContext from '../contexts/TheViewContext'
import { songData } from '../contexts/SongData'
import useFormatDate from '../utils/useFormatDate'
import usePostLike from "../utils/usePostLike"
import usePostComment from "../utils/usePostComment"
import useDebugInformation from "../utils/useDebugInformation"
import actions from '../api'
import likesvg from '../images/like-thumb-up.svg'
import commentsvg from '../images/comment.svg'
import edit from '../images/edit.svg'
import deletesvg from '../images/delete-bin-filled.svg'
import send from '../images/send.svg'
import share from '../images/share.svg'
import flag from '../images/flag.svg'

function Comments(props) {
  const { user } = useContext(TheContext)
  // const { totalComments, setTotalComments } = useContext(TheViewContext)
  const { allSongComments } = useContext(songData)
  const { comments, setComments, handlePostComment, handleDeleteComment } = usePostComment()
  const { formatDate } = useFormatDate()

  const [comment, setComment] = useState()
  const [commState, setCommState] = useState([])

  useEffect(() => {
    const songId = props.songInView?._id
    let filtered = allSongComments.filter(each => each.songId === songId)
  
    setComments(prevComments => ({
      ...prevComments,
      TOTAL_COMMENTS: filtered[0]?.comments
    }))
  }, [props.songInView])

  useEffect(() => {
    const setTotalComments = props.setTotalComments
    setTotalComments(comments?.TOTAL_COMMENTS?.length)
    renderComments()
  }, [comments])

  const renderComments = () => {
    let commentDisplay = comments?.TOTAL_COMMENTS?.map((each, index) => {
      return <GetComments key={`${uuidv4()}comm${each._id}ent${index}`}  {...each} />
    }).reverse()
    setCommState(commentDisplay)
  }

  const getCommentClass = () => {
    if (props.whichMenu === "Home") {
      if (props.poppedUp === true) {
        return "comment-pop-out comment-popped"
      } else {
        return "comment-pop-out comment-menu-down"
      }
    } else {
      if (props.poppedUp === true) {
        return "comment-pop-out songScreen-pop-out songScreen-popped"
      } else {
        return "comment-pop-out songScreen-pop-out"
      }
    }
  }

  const handleSubmit = (e, commentString, songId) => {
    e.preventDefault()
    if (commentString == null) {
      return console.log('please type out your comment')
    }
    handlePostComment(songId, commentString)
    props.commentInputRef.current.value = ''
  }

  function GetComments(each) {
    const { 
      handlePostLike, 
      handleInViewCommentLikes,
      commentLikes, 
    } = usePostLike()
    const [commentValue, setCommentValue] = useState()
    const [isCommenterAuthor, setIsCommenterAuthor] = useState(false)
    const [isCommenterUser, setIsCommenterUser] = useState(false)
    const [menuBool, setMenuBool] = useState(false)
    const [editCommentText, setEditCommentText] = useState(false)

    const likeTextRef = useRef()
    const replyTextRef = useRef()
    const listBtnsRef = useRef()
    const clcThree = useRef()
    const clcFour = useRef()
    const dotMenuRef = useRef()
    const slideOutRef = useRef()

    useEffect(() => {
      const songId = props.songInView?._id
      const songUserId = props.songInView?.song_user?._id
      const commentId = each._id
      const commentUserId = each.user._id

      handleInViewCommentLikes(commentId, songId)

      if (commentUserId === user?._id) {
        setIsCommenterUser(true)
      }

      if (songUserId === commentUserId) {
        setIsCommenterAuthor(true)
      }
    }, [])

    useEffect(() => {
      if (editCommentText) {
        document.querySelector(".comment-text-input").focus()
      }
    }, [editCommentText])

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

    const editCommentTextHandler = (e) => {
      e.preventDefault()
      setCommentValue(e.target.value)
      console.log(commentValue, "what in herre?")
    }

    return (
      <div className="comment-list">
        <div className="comment-list-inner">
          <div className="comment-list-photo">
            <div className="comment-photo-inner">
              <div className="comment-photo-outer">
                <Link
                  to={`/profile/${each.user?._id}`}
                  state={{propSongUser: each.user}}
                >
                  <img src={each.user?.picture} alt="user's profile"></img>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="comment-text-container">
            <div className="comment-list-outer">
              <p className="comment-username">
                {each.user?.user_name}
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>
                  {isCommenterAuthor ? ' 𑁦 song author' : null}
                </span>
              </p>
              <div className="comment-date">
                {formatDate(each.date, 'm')}
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
          </div>
        </div>
        
        <div className="comment-list-buttons" ref={listBtnsRef}>
          <div className="space-filler">
          </div>

          <div className="comment-btns-container">
            <div className="comment-btns_shadow-div-inset">
              {isCommenterUser ? (
                <>
                  <div className="action-buttons-container">
                    <button 
                      className="action-btn_shadow-div-outset"
                      style={{borderRadius: "40px 4px 4px 40px"}}
                      onClick={() => { handleDeleteComment(props.songInView._id, each) }}
                    >
                      <div className="action-btn-icon-container edit-delete">
                        <img
                          className="social-icons delete"
                          src={deletesvg}
                          alt="delete"
                        />
                      </div>
                      <div className="action-btn-text-container edit-delete" ref={likeTextRef}>
                        <p className="edit-delete-text">Delete</p>
                      </div>
                    </button>
                  </div>

                  <div className="action-buttons-container">
                    <button 
                      className="action-btn_shadow-div-outset" 
                      onClick={() => setEditCommentBoolean()}
                    >
                      <div className="action-btn-icon-container edit-delete">
                        <img
                          className="social-icons edit"
                          src={edit}
                          alt="edit"
                        />
                      </div>
                      <div className="action-btn-text-container edit-delete" ref={replyTextRef}>
                        <p className="edit-delete-text">Edit</p>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="action-buttons-container">
                    <button 
                      className={`action-btn_shadow-div-outset ${commentLikes.IS_LIKED ? "comment-like-btn-pressed" : ""}`}
                      style={{borderRadius: "40px 4px 4px 40px"}}
                      onClick={() => { 
                        handlePostLike(
                          commentLikes,
                          each._id, 
                          props.songInView._id,
                          null
                        )
                      }}
                    >
                      <div className="action-btn-icon-container">
                        <img
                          className="social-icons heart"
                          src={likesvg}
                          alt="like"
                        />
                      </div>
                      <div className="action-btn-text-container" ref={likeTextRef}>
                        <p className="like-text">Like</p>
                        <p className="like-number">{commentLikes?.TOTAL_COMMENT_LIKES}</p>
                      </div>
                    </button>
                  </div>

                  <div className="action-buttons-container">
                    <button className="action-btn_shadow-div-outset">
                      <div className="action-btn-icon-container">
                        <img
                          className="social-icons comment"
                          src={commentsvg}
                          alt="reply"
                        />
                      </div>
                      <div className="action-btn-text-container" ref={replyTextRef}>
                        <p className="reply-text" >Reply</p>
                        <p className="reply-number">{isCommenterUser ? '' : '0'}</p>
                      </div>
                    </button>
                  </div>
                </>
              )}

              <div className="comment-popout-container" ref={slideOutRef}>
                {/* <div className="comment-likereply-container clc-3" ref={clcThree}>
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
                </div> */}

                {/* <div className="dot-menu" onClick={() => menuAnimations()} ref={dotMenuRef}>
                  <div className="dots"></div>
                  <div className="dots"></div>
                  <div className="dots"></div>
                </div> */}
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
          <form className="social-comment-form" onSubmit={(e) => handleSubmit(e, comment, props.songInView._id)}>
            <div className="social-input-container">
              <input
                className="social-comment-input"
                ref={props.commentInputRef}
                onChange={e => setComment(e.target.value)}
                type="text"
                placeholder="Make a comment..."
              ></input>
            </div>
            <div className="comment-btn-container">
              <button className="comment-button">
                <img className="social-icons si-send" src={send} alt="send" />
              </button>
            </div>
          </form>
        </div>

        <div className="com-cont-2">
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
