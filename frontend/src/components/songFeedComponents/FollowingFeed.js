import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView, observe } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import TheViewContext from '../../TheViewContext'
import TheContext from '../../TheContext'
import Loading from '../Loading'
import useDebugInformation from "../utils/useDebugInformation"
import actions from '../../api'
import gradientbg from '../../images/gradient-bg-2.png'
import gifsArr from "../../images/gifs.json";

function FollowingFeed(props) {
  // useDebugInformation("IntersectionTest", props)
  const { user } = React.useContext(TheContext)
  const { setSongInView, isLoading, setIsLoading } = React.useContext(TheViewContext)

  const gifsCopy = [...gifsArr];
  const [followingFeedArr, setFollowingFeedArr] = useState([]);
  const [followingDisplayNodes, setFollowingDisplayNodes] = useState([])
  const viewRef = useRef();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          followingFeedArr.forEach((each) => {
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

  useEffect(() => {
    setIsLoading(true)
    const controller = new AbortController()
    const signal = controller.signal
    
    let filteredArr = []
    if (props.updateFollowFeed?.length) {
      props.updateFollowFeed.filter(each => filteredArr.push(each.followed))
    } else {
      user?.userFollows.filter(each => filteredArr.push(each.followed))
    }

    actions
    .getUserFollowsSongs(filteredArr)
    .then(res => {
      const songsArray = res.data.map((each, index) => {
        return { song: each, songVideo: gifsCopy[index].url }
      }).reverse()
      setFollowingFeedArr([...songsArray])
      setIsLoading(false)
    }, signal)
    .catch(console.error)

    return () => controller.abort()
  }, [user])


  useEffect(() => {
    let feedNodes = followingFeedArr.map((each) => {
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
    setFollowingDisplayNodes(feedNodes)
  }, [followingFeedArr])

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [followingFeedArr],
  )

  return (
    <ul className="video-scroll-container">
      <Loading isLoading={isLoading} />
      {followingDisplayNodes}
    </ul>
  )
}
export default FollowingFeed
  