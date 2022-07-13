import { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useQuery, useQueryClient } from 'react-query'
import gradientbg from '../../assets/images/gradient-bg-2.png'
import { ISong } from '../../interfaces/IModels'
import { getSongVideo } from '../../apis/actions/songs.actions'

type Props = {
  song: ISong
  // video: string,
  onInView: Dispatch<SetStateAction<ISong | undefined>>
}

const useGiphy = () => {
  return useQuery(['video'], getSongVideo)
}

function Video({ song, onInView }: Props) {
  const queryClient = useQueryClient()
  const [loadVideo, setLoadVideo] = useState('')

  const [ref, inView] = useInView({
    threshold: 0.9,
    root: document.querySelector('.video-scroll-container'),
    rootMargin: '0px 0px 200px 0px',
  })

  // useEffect(() => {
  //   if (video.data) {
  //     const index = Math.floor(Math.random() * 9)
  //     const bgVideo = video.data[index].url
  //     setLoadVideo(bgVideo)
  //   }
  // }, [video])

  useEffect(() => {
    if (inView && onInView) {
      queryClient.setQueryData(['songs', 'current', song._id], song)
      const getCurrentSong: ISong | undefined = queryClient.getQueryData([
        'songs',
        'current',
        song._id,
      ])
      if (getCurrentSong) {
        onInView(getCurrentSong)
      }
      // if (loadVideo === '') setLoadVideo(video)
    }
  }, [inView])

  return (
    <li
      id={song?._id}
      ref={ref}
      className="video-pane"
      // style={{ backgroundImage: `url('${gradientbg}'), url(${loadVideo})` }}
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
