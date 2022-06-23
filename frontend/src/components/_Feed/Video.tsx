import { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import gradientbg from '../../assets/images/gradient-bg-2.png'
import { ISong } from '../../interfaces/IModels'

type Props = {
  song: ISong
  // video: string,
  onInView: Dispatch<SetStateAction<string>> | null
}

function Video({ song, onInView }: Props) {
  const [loadVideo, setLoadVideo] = useState('')
  const [ref, inView] = useInView({
    threshold: 0.9,
    root: document.querySelector('.video-scroll-container'),
    rootMargin: '0px 0px 200px 0px',
  })

  useEffect(() => {
    if (inView && onInView) {
      console.log(song._id, 'yoyoyo')
      onInView(song._id)
      // if (loadVideo === '') setLoadVideo(video)
    }
  }, [inView])

  return (
    <li
      id={song?._id}
      ref={ref}
      className="video-pane"
      // style={{ backgroundImage: `url('${gradientbg}'), url('${loadVideo}')` }}
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
}

export default Video
