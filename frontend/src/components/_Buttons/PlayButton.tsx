import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { pauseIcon, playIcon } from '../../assets/images/_icons'


type PlayButtonProps = {
  isPlaying: boolean
  setIsPlaying: Dispatch<SetStateAction<boolean>>
  audio?: any
}

export const PlayButton = ({isPlaying, setIsPlaying, audio}: PlayButtonProps) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio(audio));
  
  useEffect(() => {
    let pauseRef = audioRef.current
    return () => {
      pauseRef.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (!audio) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <button
      className={`play-btn_shadow-div-outset ${isPlaying ? 'pause' : 'play'}`}
      aria-label={isPlaying ? "Play" : "Pause"}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <img
        className={`button-icons bi-${isPlaying ? 'pause' : 'play'}`}
        id="play-stop-img"
        src={isPlaying ? pauseIcon : playIcon}
        alt="icon"
      />
    </button>
  )
}