import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
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
    threshold: 0.99,
    root: document.querySelector('.video-scroll-container'),
  })

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      inViewRef(node)
    },
    [inViewRef],
  )

  if (inView) {
    setSongInView(eachSong.song)
    setSongUserInView(eachSong.song.songUser)
    setFollowersInView(eachSong.song.songUser.followers)
    setCommentsInView(eachSong.song.songComments)
    setLikesInView(eachSong.song.songLikes)
    setAudioInView(eachSong.song.songURL)
    console.log('this is the song inView: ', eachSong.song)
  }

  return (
    <li
      ref={setRefs}
      className="video-pane"
      style={{
        backgroundImage: `url('${gradientbg}'), url('${eachSong.songVideo}')`,
      }}
    >
      {/* <div className="last-div"></div> */}
    </li>
  )
}
export default DisplaySong
