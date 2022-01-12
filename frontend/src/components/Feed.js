import { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from "uuid";
// import TheViewContext from '../../TheViewContext'
// import { songData } from './SongData'
import Loading from './Loading'
// import useDebugInformation from "../../utils/useDebugInformation"
import gradientbg from '../images/gradient-bg-2.png'


export default function HomeFeed({ feedSongs, setSongInView }) {
  // useDebugInformation("IntersectionTest", props)
//   const { setSongInView } = useContext(TheViewContext)
//   const { homeFeedSongs } = useContext(songData)
  const [feedSongsCopy, setFeedSongsCopy] = useState([]);
  const [displayElements, setDisplayElements] = useState([])
  const viewRef = useRef();

  useEffect(() => {
    setFeedSongsCopy([...feedSongs])
  }, [feedSongs])

  const observer = new IntersectionObserver(
    entries => {
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
    },
    {
      threshold: .9,
      root: document.querySelector('.video-scroll-container'),
      rootMargin: "0px 0px 200px 0px"
    }
  )

  useEffect(() => {
    let elements = feedSongsCopy.map((each) => {
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

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [feedSongsCopy],
  )

  return (
    <ul className="video-scroll-container">
      <Loading />
      {displayElements}
    </ul>
  )
}

  