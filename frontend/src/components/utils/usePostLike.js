import React, { useCallback, useEffect, useState } from "react";
import actions from "../../api.js";
import { songData } from "../songFeedComponents/SongData";
import TheContext from "../../TheContext.js"

export default function usePostLike() {
  const { 
    user
  } = React.useContext(TheContext);

  const { 
    homeFeedArrTest, setHomeFeedArrTest, 
    trendingFeedArrTest, setTrendingFeedArrTest, 
    commentsArrTest, setCommentsArrTest,
    likesArrTest, setLikesArrTest,
    followersArrTest, setFollowersArrTest,
    isLoadingTest, setIsLoadingTest, updateHomeFeed } = React.useContext(songData)

  const [totalLikes, setTotalLikes] = useState([]);
  const [totalCommentLikes, setTotalCommentLikes] = useState([]);
  const [returnLikeSongId, setReturnLikeSongId] = useState();

  // const checkSongLikes = (arr, likeUser) => {
  //   let user = likeUser
  //   for (let i = 0; i < arr.length; i++) {
  //     if ()
  //   }
  // }
  // useEffect(() => {
  //   console.log(homeFeedArrTest[0]?.song?.songLikes, "homefeedTest in the usePOSTLIKE?")
  // }, [homeFeedArrTest])

  const checkSongLikes = (id) => {
    actions
      .getSong({ id : id })
      .then(res => {
        let deleteData = null
        let songLikes = res.data.songLikes

        for (let i = 0; i < songLikes.length; i++) {
          if (songLikes[i].likeUser === user._id) {
            deleteData = songLikes[i]
          }
        }

        if (deleteData) return deleteLikeSong(id, deleteData)
        else return addLikeSong(id)
      })
      .catch(console.error)
  }

  const checkCommentLikes = (id) => {
    actions
      .getAComment({ id: id })
      .then(res => {
        let deleteData = null
        let commLikes = res.data.commLikes

        for (let i = 0; i < commLikes.length; i++) {
          if (commLikes[i].likeUser === user._id) {
            deleteData = commLikes[i]
          }
        }

        if (deleteData) return deleteLikeComment(deleteData)
        else return addLikeComment(id)
      })
      .catch(console.error)
  }

  const addLikeSong = (id) => {
    actions
    .addLike({ likerSong: id, likeDate: new Date(), commLike: false})
    .then(res => {
      console.log('added a like to: ', res)
      setTotalLikes(res.data.songLikes)
      // let newLikesArr = likesArrTest.map(like => {
      //   if (like.songId === id) {
      //     return {...like, likes: res.data.songLikes }
      //   } else {
      //     return like
      //   }
      // })
      // setLikesArrTest(newLikesArr)
      let updateArr = homeFeedArrTest.map(each => {
        if (each.song._id === res.data._id) {
          return { ...each, song: { ...each.song, songLikes: res.data.songLikes } }
        } else {
          return each
        }
      })
      setHomeFeedArrTest(updateArr)
    })
    .catch(console.error)
  }

  const addLikeComment = (id) => {
    actions
    .addLike({ likedComment: id, likeDate: new Date(), commLike: true})
    .then(res => {
      console.log('added a like to: ', res.data)
      setTotalCommentLikes(res.data.commLikes)
    })
    .catch(console.error)
  }

  const deleteLikeSong = (id, deleteData) => {
    actions
    .deleteLike({
      likerSong: id,
      deleteObj: deleteData,
      commLike: false,
    })
    .then(res => {
      console.log(`deleted a like from: `, res.data)
      setTotalLikes(res.data.songLikes)
      // let newLikesArr = likesArrTest.map(like => {
      //   if (like.songId === id) {
      //     return {...like, likes: res.data.songLikes }
      //   } else {
      //     return like
      //   }
      // })
      // setLikesArrTest(newLikesArr)
      let updateArr = homeFeedArrTest.map(each => {
        if (each.song._id === res.data._id) {
          return { ...each, song: { ...each.song, songLikes: res.data.songLikes } }
        } else {
          return each
        }
      })
      setHomeFeedArrTest(updateArr)
    })
    .catch(console.error)
  }

  const deleteLikeComment = (deleteData) => {
    actions
      .deleteLike({ deleteObj: deleteData, commLike: true })
      .then(res => {
        console.log(`deleted a like from: `, res.data)
        setTotalCommentLikes(res.data.commLikes)
      })
      .catch(console.error)
  }
  
  const handlePostLike = (model, id, arr) => {
    console.log(`Gonna handle this ${model} Like`)
    setReturnLikeSongId(id)

    if (model === "song") {
      checkSongLikes(id)
    } else {
      checkCommentLikes(id)
    }
  }

  return { 
    handlePostLike, 
    returnLikeSongId,
    setReturnLikeSongId,
    totalLikes, 
    setTotalLikes, 
    totalCommentLikes, 
    setTotalCommentLikes 
  }
}
