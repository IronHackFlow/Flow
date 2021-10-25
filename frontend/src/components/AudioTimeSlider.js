import React, { useState, useEffect, useRef} from "react";

function UseAudioPlayer(props) {
  const audioRef = useRef();
  const [trackProgress, setTrackProgress] = useState(0);
  const intervalRef = useRef();
  const secondsRef = useRef();
  const currentProgressRef = useRef(0);
  const currentMinutesRef = useRef();
  const [songDuration, setSongDuration] = useState(0);
  const [songMinutes, setSongMinutes] = useState(0);

  useEffect(() => {
    if (props.isPlaying) {
      audioRef.current.play()
      startTimer();
    }
    else {
      clearInterval(intervalRef.current);
      clearInterval(secondsRef.current)
      audioRef.current.pause();
    }
  }, [props.isPlaying])
  
  // useEffect(() => {
  //   return () => {
  //     audioRef.current.pause();
  //     clearInterval(intervalRef.current);
  //     clearInterval(secondsRef.current)
  //   }
  // }, []);
  
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
    if (props.allTakes) {
      let filteredDuration = ""
  

      props.allTakes.filter((each) => {
        if (each.songmix === audioRef.current.src) {
          filteredDuration = each.songDuration / 1000
        }
      })
      filteredDuration = Math.round(filteredDuration)
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
    } 
  }, [props.audioSrc])
  
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current.src = props.audioSrc
    setTrackProgress(audioRef.current.currentTime);
    currentProgressRef.current = 0
  }, [props.audioSrc])
  

  const currentPercentage = songDuration ? `${(trackProgress / songDuration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #63DEBC), color-stop(${currentPercentage}, #363636))
  `;
  
  const startTimer = () => {
    clearInterval(intervalRef.current)
    clearInterval(secondsRef.current)
  
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        props.setIsPlaying(false)
        currentProgressRef.current = 0
      } 
      else {
        setTrackProgress(audioRef.current.currentTime)
      }
    }, [100])
  
    secondsRef.current = setInterval(() => {
      if (audioRef.current.ended) {
      }
      else {
        currentProgressRef.current++
      }
    }, [1000])
  }
    
  const onScrub = (value) => {
    clearInterval(intervalRef.current)
    clearInterval(secondsRef.current)
    audioRef.current.currentTime = value;
    currentProgressRef.current = Math.round(value)
    setTrackProgress(audioRef.current.currentTime)
  }
  
  const onScrubEnd = () => {
    if (!props.isPlaying) {
      props.setIsPlaying(true)
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
        max={songDuration}
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
          {songDuration >= 60 ? songMinutes : songDuration}
        </div>
      </div>
      <audio ref={audioRef} src={props.audioSrc} />
    </div>
  )
}
export default UseAudioPlayer;