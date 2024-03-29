import React, { useState, useEffect, useRef} from "react";

function UseAudioPlayer({isPlaying, setIsPlaying, currentSong, bgColor}) {
  const [trackProgress, setTrackProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songMinutes, setSongMinutes] = useState(0);

  const audioRef = useRef();
  const intervalRef = useRef();
  const secondsRef = useRef();
  const currentProgressRef = useRef(0);
  const currentMinutesRef = useRef();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      clearInterval(secondsRef.current)
      audioRef.current.pause()
    }
  }, [isPlaying])
  
  useEffect(() => {
    if (currentProgressRef.current >= 60) {
      let current = currentProgressRef.current
      let getRefMinutes = Math.floor(current / 60)
      let getRefSeconds = current % 60
      if (getRefSeconds < 10) {
        let getJustSeconds = `0${getRefSeconds}`
        currentMinutesRef.current = `${getRefMinutes}:${getJustSeconds}`
      }
      else {
        currentMinutesRef.current = `${getRefMinutes}:${getRefSeconds}`
      }
    }
  }, [currentProgressRef.current])
    
  useEffect(() => {
    let filteredDuration = Math.round(currentSong?.duration / 1000)
    setSongDuration(filteredDuration)
    
    if (filteredDuration >= 60) {
      const getMinutes = Math.floor(filteredDuration / 60)
      const getSeconds = filteredDuration % 60
      
      if (getSeconds < 10) {
        let getJustSeconds = `0${getSeconds}`
        setSongMinutes(`${getMinutes}:${getJustSeconds}`)
      }
      else {
        setSongMinutes(`${getMinutes}:${getSeconds}`)
      }
    } 
  }, [currentSong])
  
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current.src = currentSong?.song_URL
    setTrackProgress(audioRef.current.currentTime);
    currentProgressRef.current = 0
  }, [currentSong])
  
  const currentPercentage = songDuration ? `${(trackProgress / songDuration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #63DEBC), color-stop(${currentPercentage}, ${bgColor}))
  `;
  
  const startTimer = () => {
    if (audioRef.current !== null) {
      clearInterval(intervalRef.current)
      clearInterval(secondsRef.current)
    
      intervalRef.current = setInterval(() => {
        if (audioRef.current?.ended) {
          setIsPlaying(false)
          currentProgressRef.current = 0
        } 
        else {
          setTrackProgress(audioRef.current?.currentTime)
        }
      }, [100])
    
      secondsRef.current = setInterval(() => {
        if (audioRef.current?.ended) {
        }
        else {
          currentProgressRef.current++
        }
      }, [1000])
    }
  }
    
  const onScrub = (value) => {
    clearInterval(intervalRef.current)
    clearInterval(secondsRef.current)
    audioRef.current.currentTime = value;
    currentProgressRef.current = Math.round(value)
    setTrackProgress(audioRef.current.currentTime)
  }
  
  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true)
    }
    startTimer()
  }

  return (
    <div className="play-slider_shadow-div-inset">
      <input 
        className="dur-onset progress"
        type="range"
        value={trackProgress}
        step=".1"
        min="0"
        max={songDuration ? songDuration : `${songDuration}`}
        onChange={(e) => onScrub(e.target.value)}
        onMouseUp={() => onScrubEnd()}
        onKeyUp={() => onScrubEnd()}
        onTouchEnd={() => onScrubEnd()}
        style={{background: trackStyling}}
        > 
      </input>
      <div className="time-text-container">
        <div className="time-text-start">
          {currentProgressRef.current >= 60 ? currentMinutesRef.current : currentProgressRef.current}
        </div>
        <div className="time-text-end">
          {songDuration >= 60 ? songMinutes : `${songDuration}`}
        </div>
      </div>
      <audio ref={audioRef} src={currentSong?.song_URL} />
    </div>
  )
}
export default UseAudioPlayer;