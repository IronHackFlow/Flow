import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView, observe } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import TheViewContext from '../../TheViewContext'
import { songData } from './SongData'
import Loading from '../Loading'
import useDebugInformation from "../utils/useDebugInformation"
import actions from '../../api'
import gradientbg from '../../images/gradient-bg-2.png'
import gifsArr from "../../images/gifs.json";

function HomeFeed(props) {
  // useDebugInformation("IntersectionTest", props)
  const { 
    setSongInView, 
    setTotalFollowsLikesArr,
    setCommentsArr,
    isLoading,
    setIsLoading,
  } = React.useContext(TheViewContext)
  const { 
    homeFeedArrTest, setHomeFeedArrTest
  } = React.useContext(songData)
  const gifsCopy = [...gifsArr];
  const [homeFeedArr, setHomeFeedArr] = useState([]);
  const [homeDisplayNodes, setHomeDisplayNodes] = useState([])
  const viewRef = useRef();

  useEffect(() => {
    setHomeFeedArr([...homeFeedArrTest])
  }, [homeFeedArrTest])

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          homeFeedArr.forEach((each) => {
            if (each.song._id === entry.target.id) {
              setSongInView(each.song)
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

  // useEffect(() => {
  //   setIsLoading(true)
  //   const controller = new AbortController()
  //   const signal = controller.signal
    
  //   actions
  //   .getMostLikedSongs()
  //   .then(res => {
  //     console.log(res.data, "lets see this tho?")
  //     let commentArray = []
  //     let followsLikesArray = []

  //     const songsArray = res.data.map((each, index) => {
  //       commentArray.push({ songId: each._id, comments: each.songComments })
  //       const likesFollowsObj = {
  //         songId: each._id,
  //         totalLikes: each.songLikes,
  //         totalFollowers: each.songUser.followers
  //       }
  //       followsLikesArray.push(likesFollowsObj)
  //       return { song: each, songVideo: gifsCopy[index].url }
  //     }).reverse()

  //     setTotalFollowsLikesArr(followsLikesArray)
  //     setCommentsArr(commentArray)
  //     setHomeFeedArr(songsArray)
  //     setIsLoading(false)
  //   }, signal)

  //   .catch(console.error)
  // }, [])

  useEffect(() => {
    let feedNodes = homeFeedArr.map((each) => {
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
    setHomeDisplayNodes(feedNodes)
  }, [homeFeedArr])

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [homeFeedArr],
  )

  return (
    <ul className="video-scroll-container">
      <Loading />
      {homeDisplayNodes}
    </ul>
  )
}
  export default HomeFeed
  