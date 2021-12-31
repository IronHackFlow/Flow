import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useInView, observe } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import TheViewContext from '../../TheViewContext'
import Loading from '../Loading'
import useDebugInformation from "../utils/useDebugInformation"
import actions from '../../api'
import gradientbg from '../../images/gradient-bg-2.png'
import gifsArr from "../../images/gifs.json";

function TrendingFeed(props) {
  // useDebugInformation("IntersectionTest", props)
  const { setSongInView, setIsLoading} = React.useContext(TheViewContext)
  const gifsCopy = [...gifsArr];
  const [trendingFeedArr, setTrendingFeedArr] = useState([]);
  const [trendingDisplayNodes, setTrendingDisplayNodes] = useState([])

  const viewRef = useRef();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trendingFeedArr.forEach((each) => {
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
    
    actions
    .getMostLikedSongs()
    .then(res => {
      const sortByLikes = res.data.sort((a, b) => b.songLikes.length - a.songLikes.length)
      const trendingArray = sortByLikes.map((each, index) => {   
        return { song: each, songVideo: gifsCopy[index].url }
      })

      setTrendingFeedArr(trendingArray)
      setIsLoading(false)
    }, signal)
    .catch(console.error)
  }, [])

  useEffect(() => {
    let feedNodes = trendingFeedArr.map((each) => {
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
    setTrendingDisplayNodes(feedNodes)
  }, [trendingFeedArr])

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [trendingFeedArr],
  )

  return (
    <ul className="video-scroll-container">
      <Loading />
      {trendingDisplayNodes}
    </ul>
  )
}
export default TrendingFeed
  