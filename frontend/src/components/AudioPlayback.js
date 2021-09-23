import React, { useState, useEffect, useRef } from "react";
import { audioSrc, allTakes } from "./TestAudio"

function AudioPlayback() {
  const audioRef = useRef(new Audio(audioSrc))
  const [trackProgress, setTrackProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songMinutes, setSongMinutes] = useState(0);
  const currentProgressRef = useRef(0)
  const currentMinutesRef = useRef();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const { duration } = audioRef.current;
  const intervalRef = useRef();
  const secondsRef = useRef();

  useEffect(() => {
    console.log(isPlaying)
    if (isPlaying) {
      audioRef.current.play()
      startTimer();
    }
    else {
      clearInterval(intervalRef.current);
      clearInterval(secondsRef.current)
      audioRef.current.pause();
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
      clearInterval(secondsRef.current)
    }
  }, []);

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
    if (allTakes.length !== 0) {
      let filteredDuration = ""

      allTakes.filter((each) => {
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
  }, [audioSrc])

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);
  }, [audioSrc])

  const currentPercentage = songDuration ? `${(trackProgress / songDuration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #63DEBC), color-stop(${currentPercentage}, #555555))
  `;

  const startTimer = () => {
    clearInterval(intervalRef.current)
    clearInterval(secondsRef.current)

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setIsPlaying(false)
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
    if (!isPlaying) {
      setIsPlaying(true)
    }
    startTimer()
  }
  return { 
      onScrubEnd,
      onScrub,
      trackStyling,

  }
}
export default AudioPlayback;