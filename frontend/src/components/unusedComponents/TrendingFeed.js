import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from "uuid";
import TheViewContext from '../../TheViewContext'
import { songData } from '../../contexts/SongData'
import Loading from '../Loading'
import useDebugInformation from "../../utils/useDebugInformation"
import gradientbg from '../../images/gradient-bg-2.png'


function TrendingFeed(props) {
  // useDebugInformation("IntersectionTest", props)
  const { setSongInView } = useContext(TheViewContext)
  const { trendingFeedSongs } = useContext(songData)
  const [trendingFeedSongsCopy, setTrendingFeedSongsCopy] = useState([])
  const [trendingDisplayNodes, setTrendingDisplayNodes] = useState([])
  const viewRef = useRef();

  useEffect(() => {
    setTrendingFeedSongsCopy([...trendingFeedSongs])
  }, [trendingFeedSongs])

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trendingFeedSongsCopy.forEach((each) => {
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
    console.log(trendingFeedSongsCopy, "what is this yo/")
    let feedNodes = trendingFeedSongsCopy.map((each) => {
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
            {each.song.lyrics?.map((each, index) => {
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
    setTrendingDisplayNodes(feedNodes)
  }, [trendingFeedSongsCopy])

  const setRefs = useCallback(
    node => {
      viewRef.current = node
      if (viewRef.current !== null) {
        observer.observe(viewRef.current)
      }
    },
    [trendingFeedSongsCopy],
  )

  return (
    <ul className="video-scroll-container">
      <Loading />
      {trendingDisplayNodes}
    </ul>
  )
}
export default TrendingFeed
  