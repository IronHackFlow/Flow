import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import TheContext from '../TheContext'
import TheViewContext from '../TheViewContext'
import { songData } from './songFeedComponents/SongData'
import FormatDate from './FormatDate'
import usePostLike from "./utils/usePostLike"
import usePostComment from "./utils/usePostComment"
import useDebugInformation from "./utils/useDebugInformation"
import actions from '../api'
import heart2 from '../images/heart2.svg'
import commentsvg from '../images/comment.svg'
import edit from '../images/edit.svg'
import trash from '../images/trashbin.svg'
import send from '../images/send.svg'
import share from '../images/share.svg'
import flag from '../images/flag.svg'

function Comments(props) {
  const { user } = useContext(TheContext)
  // const { totalComments, setTotalComments } = useContext(TheViewContext)
  const { commentsArrTest, setCommentsArrTest } = useContext(songData)
  const { comments, setComments, postComment, deleteComment } = usePostComment()

  const initialComments = {
    'ADD_COMMENT': false,
    'DELETE_COMMENT': false,
    'USER_COMMENT_TO_DELETE': null,
    'TOTAL_COMMENTS': null
  }

  const [comment, setComment] = useState()
  const [commState, setCommState] = useState([])
  const [commLikesArr, setCommLikesArr] = useState([])


  useEffect(() => {
    let songId = props.songInView?._id
    setComments(initialComments)

    let commentInView = commentsArrTest.filter(each => {
      console.log(each.comments, "LOLOLOLOL")
      if (each.songId === songId) {
        setComments(prevComments => ({
          ...prevComments,
          'TOTAL_COMMENTS': each.comments.length
        }))
        return each
      }
    })

    let commentDisplay = commentInView[0]?.comments?.map((each, index) => {
      return <GetComments key={`${uuidv4()}comm${each._id}ent${index}`}  {...each} />
    })
    setCommState(commentDisplay)
  }, [props.songInView])

  useEffect(() => {
    const setTotalComments = props.setTotalComments
    setTotalComments(comments?.TOTAL_COMMENTS)
  }, [comments])

  const resetCommentsArray = (arr) => {
    props.setCommentsArray((prevArr) => {
      return prevArr.map((each) => {
        if (each.songId === props.songInView?._id) {
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
      console.log('please type out your coment')
      return
    }
    postComment(commentString, songId)
    props.commentInputRef.current.value = ''
  }

  // const handleSubmit = e => {
  //   e.preventDefault()
  //   if (comment === undefined) {
  //     console.log('please type out your comment')
  //     return null
  //   }
  //   actions
  //     .addComment({
  //       comment: comment,
  //       commSong: props.songInView?._id,
  //       commDate: new Date(),
  //     })
  //     .then(res => {
  //       if (res.data.songComments.length) {
  //         let comments = res.data.songComments
  //         resetCommentsArray(comments)
  //         props.setTotalComments(res.data.songComments.length)
  //       }
  //     })
  //     .catch(console.error)
  //   props.commentInputRef.current.value = ''
  // }

  function GetComments(each) {
    const { handlePostLikeComment, commentLikes, setCommentLikes } = usePostLike()
    const [commentValue, setCommentValue] = useState();
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
      const likesArray = each.commLikes
      likesArray.forEach(each => {
        console.log(each, "WHAT IS GOING ON??")
      })

      // setCommentLikes(prevLikes => ({
      //   ...prevLikes,

      // }))
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
          .deleteComment({ deleteObj: each, songId: props.songInView?._id })
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
                  to={`/profile/${each.commUser._id}`}
                  state={{state: each.commUser}}
                >
                  <img src={each.commUser?.picture} alt="user's profile"></img>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="comment-text-container">
            <div className="comment-list-outer">
              <p className="comment-username">
                {each.commUser?.userName}
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>
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
          </div>
        </div>
        
        <div className="comment-list-buttons" ref={listBtnsRef}>
          <div className="space-filler">
          </div>

          <div className="comment-btns-container">
            <div className="comment-btns_shadow-div-inset">
              {checkCommUser ? (
                <>
                  <div className="action-buttons-container">
                    <button 
                      className="action-btn_shadow-div-outset"
                      style={{borderRadius: "40px 4px 4px 40px"}}
                      onClick={() => deleteComment(each)}
                    >
                      <div className="action-btn-icon-container edit-delete">
                        <img
                          className="social-icons heart"
                          src={trash}
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
                      className="action-btn_shadow-div-outset"
                      style={{borderRadius: "40px 4px 4px 40px"}}
                      onClick={() => { handlePostLikeComment(each._id, commentLikes?.IS_LIKED, commentLikes?.USERS_LIKE_TO_DELETE)}}
                    >
                      <div className="action-btn-icon-container">
                        <img
                          className="social-icons heart"
                          src={heart2}
                          alt="like"
                        />
                      </div>
                      <div className="action-btn-text-container" ref={likeTextRef}>
                        <p className="like-text">Like</p>
                        <p className="like-number">13</p>
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
                        <p className="reply-number">{checkCommUser ? '' : '13'}</p>
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
          {/* <div className="comments-title">
            <div className="comments-title-inner">
              <p>
                Comments - <span style={{ color: '#e5bdcd' }}>{props.totalComments}</span>
              </p>
            </div>
          </div> */}

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
