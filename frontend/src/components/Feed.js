import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from "uuid";
import Loading from './Loading'
import { songData } from '../contexts/SongData'
import gradientbg from '../images/gradient-bg-2.png'
import useEventListener from '../utils/useEventListener';


export default function Feed({ feedSongs, setSongInView, trackInView, isHomeFeed, isTrendingFeed, isFollowingFeed }) {
  const [feedSongsCopy, setFeedSongsCopy] = useState([]);
  const [displayElements, setDisplayElements] = useState([])
  const viewRef = useRef();

  useEffect(() => {
    setFeedSongsCopy([...feedSongs])
  }, [feedSongs])

  const observer = new IntersectionObserver(
    entries => {
      if (trackInView !== null) {
        let getScroll = entries.filter(entry => entry.target.id === trackInView?._id)
        getScroll[0]?.target.scrollIntoView({ behavior: 'smooth' })

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            feedSongsCopy.forEach((each) => {
              if (each.song._id === entry.target.id) {
                setSongInView(each.song)
                entry.target.style.backgroundImage = `url('${each.songVideo}')`
              }
            })
          } 
        })
      } else {
        let getFirst = entries.filter(entry => entry.target.id === feedSongs[0]?.song?._id)
        getFirst[0]?.target.scrollIntoView({ behavior: 'smooth' })

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            feedSongsCopy.forEach((each) => {
              if (each.song._id === entry.target.id) {
                setSongInView(each.song)
                entry.target.style.backgroundImage = `url('${each.songVideo}')`
              }
            })
          } 
        })
      }
    },
    {
      threshold: .9,
      root: document.querySelector('.video-scroll-container'),
      rootMargin: "0px 0px 200px 0px"
    }
  )

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [feedSongsCopy],
  )


  useEffect(() => {
    let elements = feedSongsCopy.map((each) => {
      return (
        <li
          id={each.song._id}
          ref={setRefs}
          className="video-pane"
          key={`${uuidv4()}_${each.song._id}`}
          style={{ backgroundImage: `url('${gradientbg}'), url('')` }}
        >
          <div className="last-div">
            {each.song.lyrics.map((each, index) => {
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
    setDisplayElements(elements)
  }, [feedSongsCopy])

  // useEventListener('DOMContentLoaded', () => {
  //   for (let i = 0; i < feedSongs?.length; i++) {
  //     console.log(feedSongs[i].song._id, "I hope this worked")
  //     observer.observe(document.getElementById(`${feedSongs[i].song._id}`))
  //   }
  // })
  
  return (
    <ul className="video-scroll-container">
      <Loading />
      {displayElements}
    </ul>
  )
}

  