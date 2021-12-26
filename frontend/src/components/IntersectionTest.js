import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView, observe } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import TheViewContext from '../TheViewContext'
import TheContext from '../TheContext'
import useDebugInformation from "./utils/useDebugInformation"
import actions from '../api'
import gradientbg from '../images/gradient-bg-2.png'
import gifsArr from "../images/gifs.json";

function IntersectionTest(props) {
  // useDebugInformation("IntersectionTest", props)
  const { user } = React.useContext(TheContext)
  const {
    setSongInView, followingFeed, 
    totalFollowsLikesArr, setTotalFollowsLikesArr,
    theFeedBool, trendingBool, followingBool
  } = React.useContext(TheViewContext)

  const gifsCopy = [...gifsArr];
  const [commentsArray, setCommentsArray] = useState([])
  const [homeFeedArr, setHomeFeedArr] = useState([]);
  const [trendingFeedArr, setTrendingFeedArr] = useState([]);
  const [followingFeedArr, setFollowingFeedArr] = useState([])
  const [feedArr, setFeedArr] = useState([])
  const [value, setValue] = useState("");

  const viewRef = useRef();

  useEffect(() => {
    if (!feedArr?.length) {
      setFeedArr(homeFeedArr)
    } else if (theFeedBool) {
      setFeedArr(homeFeedArr)
    } else if (trendingBool) {
      setFeedArr(trendingFeedArr)
    } else if (followingBool) {
      setFeedArr(followingFeedArr)
    }
  }, [homeFeedArr, theFeedBool, trendingBool, followingBool])

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          feedArr.forEach((each) => {
            if (each.song._id === entry.target.id) {
              setSongInView(each.song)
              // setSongUserInView(each.song.songUser)
              // setFollowersInView(each.song.songUser.followers)
              // setCommentsInView(each.song.songComments)
              // setLikesInView(each.song.songLikes)
              // setAudioInView(each.song.songURL)
              entry.target.style.backgroundImage = `url('${each.songVideo}')`
            }
          })
        } 
      })
    },
    {
      threshold: .9,
      root: document.querySelector('.video-scroll-container'),
      rootMargin: "0px 0px 200px 0px"
    }
  )

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    
      let filteredArr = []
      user?.userFollows?.filter(each => filteredArr.push(each.followed))

      actions
      .getUserFollowsSongs(filteredArr)
      .then(res => {

        const songsArray = res.data.map((each, index) => {
          return { song: each, songVideo: gifsCopy[index].url }
        }).reverse()

        setFollowingFeedArr(songsArray)
      }, signal)
      .catch(console.error)

    return () => controller.abort()
  }, [user])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    
    actions
    .getMostLikedSongs()
    .then(res => {
        let commentArray = []

        const songsArray = res.data.map((each, index)=> {
          commentArray.push({ songId: each._id, comments: each.songComments })
          return { song: each, songVideo: gifsCopy[index].url }
        }).reverse()
        
        const sortByLikes = res.data.sort((a, b) => b.songLikes.length - a.songLikes.length)
        const trendingArray = sortByLikes.map((each, index) => {   
          const likesFollowsObj = {
            songId: each._id,
            totalLikes: each.songLikes.length,
            totalFollowers: each.songUser.followers.length
          }
          totalFollowsLikesArr.push(likesFollowsObj)
          setTotalFollowsLikesArr(totalFollowsLikesArr)
          return { song: each, songVideo: gifsCopy[index].url }
        })

        setHomeFeedArr(songsArray)
        setTrendingFeedArr(trendingArray)

    }, signal)

    .catch(console.error)
  }, [])
  // useEffect(() => {
  //   let feed = feedArr.map((each) => {
  //     return (
  //       <li
  //         id={each.song._id}
  //         ref={setRefs}
  //         className="video-pane"
  //         key={`${uuidv4()}_${each.song._id}`}
  //         style={{
  //           backgroundImage: `url('${gradientbg}'), url('')`,
  //         }}
  //       >
  //         <div className="last-div">
  //           {each.song.songLyricsStr?.map((each, index) => {
  //             return (
  //               <div className="each-lyric-container" key={`${uuidv4()}_${index}_songlyrics`}>
  //                 <p className="each-lyric-no">{index + 1}</p>
  //                 <p className="each-lyric-line">{each}</p>
  //               </div>
  //             )
  //           })}
  //         </div>
  //       </li>
  //     )
  //   })

  //   setFeedElements(feed)
  // }, [feedArr])

  const showFeedSongs = useCallback(() => {
    return feedArr.map((each) => {
      return (
        <li
          id={each.song._id}
          ref={setRefs}
          className="video-pane"
          key={`${uuidv4()}_${each.song._id}`}
          style={{
            backgroundImage: `url('${gradientbg}'), url('')`,
          }}
        >
          <div className="last-div">
            {each.song.songLyricsStr?.map((each, index) => {
              return (
                <div className="each-lyric-container" key={`${uuidv4()}_${index}_songlyrics`}>
                  <p className="each-lyric-no">{index + 1}</p>
                  <p className="each-lyric-line">{each}</p>
                </div>
              )
            })}
          </div>
        </li>
      )
    })
  }, [feedArr, homeFeedArr, trendingFeedArr, followingFeedArr])

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [feedArr],
  )
    
  // const showFeedSongs = useCallback(() => {
  //   return feedElements.map((each, index) => {
  //     return each
  //   })
  // }, [feedElements, feedArr])
    
  return (
    <ul className="video-scroll-container" ref={props.windowRef}>
      {showFeedSongs()}
    </ul>
  )
}
  export default IntersectionTest
  