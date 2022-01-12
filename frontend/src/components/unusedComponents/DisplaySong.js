import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { v4 as uuidv4 } from "uuid";
import gradientbg from '../images/gradient-bg-2.png'
import TheViewContext from '../../TheViewContext'

function DisplaySong(props) {
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
      setSongInView(props.eachSong.song)
      setSongUserInView(props.eachSong.song.songUser)
      setFollowersInView(props.eachSong.song.songUser.followers)
      setCommentsInView(props.eachSong.song.songComments)
      setLikesInView(props.eachSong.song.songLikes)
      setAudioInView(props.eachSong.song.songURL)
      console.log('this is the song inView: ', props.eachSong.song)
    }
    return () => mounted = false
  }, [inView])

  return (
    <li
      className="video-pane"
      key={props.passKey}
      ref={setRefs}
      style={{
        backgroundImage: `url('${gradientbg}'), url('${props.eachSong.songVideo}')`,
      }}
    >
      <div className="last-div">
        {props.eachSong.song.songLyricsStr?.map((each, index) => {
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
}
export default DisplaySong
