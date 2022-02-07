import { useEffect, useState, memo } from 'react'
import { useInView } from 'react-intersection-observer'
import gradientbg from '../assets/images/gradient-bg-2.png'

const MemoizedVideo = memo(
  function Video({ song, video, onInView }) {
    const [loadVideo, setLoadVideo] = useState('')
    const [ref, inView, entry] = useInView({
      threshold: 0.9,
      root: document.querySelector('.video-scroll-container'),
      rootMargin: '0px 0px 200px 0px',
    })

    useEffect(() => {
      if (inView) {
        onInView(song._id)
        if (loadVideo === '') setLoadVideo(video)
      }
    }, [inView])

    return (
      <li
        id={song?._id}
        ref={ref}
        className="video-pane"
        style={{ backgroundImage: `url('${gradientbg}'), url('${loadVideo}')` }}
      >
        <div className="last-div">
          {song?.lyrics?.map((each, index) => {
            return (
              <div className="each-lyric-container" key={`${index}_${each}_songlyrics`}>
                <p className="each-lyric-no">{index + 1}</p>
                <p className="each-lyric-line">{each}</p>
              </div>
            )
          })}
        </div>
      </li>
    )
  },
  (nextProps, prevProps) => {
    if (nextProps.song !== prevProps.song) {
      return false
    }
    return true
  },
)

export default MemoizedVideo
