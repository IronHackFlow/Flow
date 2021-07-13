import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import TheContext from "../TheContext"
import actions from '../api'

function Comments(props) {
  const {
    songId
    } = React.useContext(
    TheContext
  );

  const [comment, setComment] = useState();
  const [commState, setCommState] = useState([])
  // const renderRef = useRef(0)
  
  // let commentUsers = []
  // useEffect(() => {
  //   commentUsers = []

  //   songComments.map((each) => {
  //     actions
  //     .getAUser({id: each.commUser})
  //     .then((res) => {
  //       commentUsers.push({ user: res.data, comment: each.comment })
  //       console.log(commentUsers)
  //       // setCommState(oldArray =>  [...oldArray, { user: res.data, comment: each.comment }])
  //       // console.log(commState, 'this prob gonna cause many renderz')
  //     }).catch((e) => {
  //       console.log('failed to get name', e)
  //     })
  //   })
  // }, [songComments])

  useEffect(() => {
    actions
      .getComments({ id: songId })
      .then((res) => {
        setCommState(res.data.songComments)
      })
      .catch(console.error)
  }, [songId])

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
    actions
      .addComment({ comment: comment, 
                    commSong: songId,
                    commDate: new Date() })
      .then((res) => {
        console.log(res, "comment data ")
      })
      .catch(console.error);
  }

  const renderEachComment = () => {
    return commState.map((each, index) => {
      return (
        <div key={index} className="comment-list">
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
            <div className="comment-list-outer">
              <p className="comment-username">
                {each.commUser.userName}
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
  // const renderEachComment = useCallback(() => {
  //   return commentUsers.map((each, index) => {
  //     return (
  //       <div key={index} className="comment-list">
  //         <div className="comment-list-photo">
  //           <div className="comment-photo-inner">
  //             <div className="comment-photo-outer">
  //               <Link to={{pathname: `/profile/other/${each.user?._id}`, profileInfo: each.user}}>
  //                 <img src={each.user?.picture} alt="user's profile"></img>
  //               </Link>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="comment-list-inner">
  //           <div className="comment-list-outer">
  //             <p className="comment-username">
  //               {each.user.userName}
  //             </p>
  //             <p className="comment-text">
  //               {each.comment}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   })
  // }, [songComments])

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
