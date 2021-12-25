import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView, observe } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import gradientbg from '../images/gradient-bg-2.png'
import TheViewContext from '../TheViewContext'
import actions from '../api'
import gifsArr from "../images/gifs.json";
import { ElastiCache } from 'aws-sdk';

function IntersectionTest(props) {
  const {
    setSongInView,
    totalLikes, totalFollowers,
    totalFollowsLikesArr, setTotalFollowsLikesArr,
    setAudioInView,
    setSongUserInView,
    setCommentsInView,
    setLikesInView,
    setFollowersInView,
  } = React.useContext(TheViewContext)

  const gifsCopy = [...gifsArr];
  const [commentsArray, setCommentsArray] = useState([])
  const [theFeedSongs, setTheFeedSongs] = useState([]);
  const [trendingSongsFeed, setTrendingSongsFeed] = useState([]);
  const [displayTrending, setDisplayTrending] = useState([])

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trendingSongsFeed.forEach((each) => {
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
        setCommentsArray(commentArray)
        setTheFeedSongs(songsArray)
        setTrendingSongsFeed(trendingArray)
      }, signal)
      .catch(console.error)
  
    return () => controller.abort()
  }, [])

  const viewRef = useRef();


  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [trendingSongsFeed],
  )
    
  useEffect(() => {
    let trend = trendingSongsFeed.map((each) => {
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
    setDisplayTrending(trend)
  }, [trendingSongsFeed])

    
  const showTrendingSongs = useCallback(() => {
    return displayTrending?.map((each, index) => {
      return each
    })
  }, [displayTrending, trendingSongsFeed])
    
  const lastCardObserver = new IntersectionObserver(
    entries => {
      const lastCard = entries[0]
    }, {}
  ) 

  return (
    <ul className="video-scroll-container" ref={props.windowRef}>
      {showTrendingSongs()}
    </ul>
  )
}
  export default IntersectionTest
  