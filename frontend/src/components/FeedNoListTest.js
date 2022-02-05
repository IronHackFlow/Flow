import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from "uuid";
import Loading from './Loading'
import { songData } from '../contexts/SongData'
import Video from "./Video"
import gradientbg from '../assets/images/gradient-bg-2.png'
import useDebounce from '../hooks/useDebounce'
import useThrottle from '../hooks/useThrottle'


export default function Feed({ feedSongs, setSongInView, trackInView, letScroll }) {

  const [feedSongsCopy, setFeedSongsCopy] = useState([]);

  useEffect(() => {
    setFeedSongsCopy([...feedSongs])
  }, [feedSongs])

  // const observer = new IntersectionObserver(
  //   entries => {
  //     if (trackInView !== null) {
  //       let getScroll = entries.filter(entry => entry.target.id === trackInView?._id)
  //       getScroll[0]?.target.scrollIntoView({ behavior: 'smooth' })

  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           feedSongsCopy.forEach((each) => {
  //             if (each.song._id === entry.target.id) {
  //               setSongInView(each.song)
  //               entry.target.style.backgroundImage = `url('${each.songVideo}')`
  //             }
  //           })
  //         } 
  //       })
  //     } else {
  //       let getFirst = entries.filter(entry => entry.target.id === feedSongs[0]?.song?._id)
  //       getFirst[0]?.target.scrollIntoView({ behavior: 'smooth' })

  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           feedSongsCopy.forEach((each) => {
  //             if (each.song?._id === entry.target.id) {
  //               setSongInView(each.song)
  //               entry.target.style.backgroundImage = `url('${each.songVideo}')`
  //             }
  //           })
  //         } 
  //       })
  //     }
  //   },
  //   {
  //     threshold: .9,
  //     root: document.querySelector('.video-scroll-container'),
  //     rootMargin: "0px 0px 200px 0px"
  //   }
  // )


  const [newVideo, setNewVideo] = useState([])
  const [showNextVideo, setShowNextVideo] = useState(0)

  
  const showVidz = () => {
    console.log("am i called?")
    const index = Math.floor(Math.random() * feedSongsCopy.length)
    setNewVideo(prevVideo => [...prevVideo, <Video index={index} key={feedSongsCopy[index]?.song?._id} song={feedSongsCopy[index]?.song} video={feedSongsCopy[index]?.songVideo}/>])
    return newVideo
  }
  
  const throttled = useThrottle(showVidz, 500)

  return (
    <ul 
      className="video-scroll-container" 
      style={letScroll ? {overflowY: "hidden"} : {overflowY: "scroll"}}
      onScroll={() => showVidz()}
    >
      <Video index={0} key={feedSongsCopy[0]?.song?._id} song={feedSongsCopy[0]?.song} video={feedSongsCopy[0]?.songVideo}  />
      <Video index={1} key={feedSongsCopy[1]?.song?._id} song={feedSongsCopy[1]?.song} video={feedSongsCopy[1]?.songVideo}  />
      {throttled}
    </ul>
  )
}

  