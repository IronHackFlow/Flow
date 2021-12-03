import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import gradientbg from '../images/gradient-bg-2.png'
import TheViewContext from '../TheViewContext'

function DisplaySong(eachSong) {
  const {
    setSongInView,
    setAudioInView,
    setSongUserInView,
    setCommentsInView,
    setLikesInView,
    setFollowersInView,
  } = React.useContext(TheViewContext)

  const viewRef = useRef()

  const [inViewRef, inView] = useInView({
    threshold: .99,
    root: document.querySelector('.video-scroll-container'),
  })
  
  const setRefs = useCallback(
    node => {
      viewRef.current = node
      inViewRef(node)
    },
    [inViewRef],
  )

  useEffect(() => {
    let mounted = true;
    if (inView) {
      setSongInView(eachSong)
      setSongUserInView(eachSong.songUser)
      setFollowersInView(eachSong.songUser.followers)
      setCommentsInView(eachSong.songComments)
      setLikesInView(eachSong.songLikes)
      setAudioInView(eachSong.songURL)
      console.log('this is the song inView: ', eachSong)
    }
    return () => mounted = false
  }, [inView])

  return (
    <li
      className="video-pane"
      ref={setRefs}
      style={{
        backgroundImage: `url('${gradientbg}'), url('${eachSong.songVideo}')`,
      }}
    >
      <div className="last-div">
        {eachSong?.songLyricsStr?.map((each, index) => {
          return (
            <div className="each-lyric-container">
              <p className="each-lyric-no">{index + 1}</p>
              <p className="each-lyric-line">{each}</p>
            </div>
          )
        })}
      </div>
    </li>
  )
}
export default DisplaySong
