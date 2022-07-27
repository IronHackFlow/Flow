import { useContext, useState, useEffect, Dispatch, SetStateAction } from 'react'
import Loading from '../Loading/Loading'
import Video from './Video'
import { UseQueryResult } from 'react-query'
// import { ISong } from '../../interfaces/IModels'
import { ISong } from '../../../../backend/src/models/Song'

import { trpc } from 'src/utils/trpc'

type Props = {
  songArray: ISong[]
  // trackInView: Song,
  // letScroll: boolean,
  onInView: Dispatch<SetStateAction<ISong>>
}
export const Feed = ({ songArray, onInView }: Props) => {
  // useEffect(() => {
  //   console.log(songArray, "WTF IS GOING ON HERE")
  //   let scrollTo = document.getElementById(`${trackInView?._id}`)
  //   // scrollTo?.scrollIntoView({ behavior: 'instant' })
  // }, [trackInView])

  return (
    <ul
      className="video-scroll-container"
      // style={letScroll ? { overflowY: 'hidden' } : { overflowY: 'scroll' }}
      style={{ overflowY: 'scroll' }}
    >
      {/* <Loading isLoading={isLoading} /> */}
      {songArray?.map(item => {
        return (
          <Video
            key={item?._id}
            song={item}
            // video={item}
            onInView={onInView}
          />
        )
      })}
    </ul>
  )
}

type FeedDisplayProps = {
  feed: string
  onInView: Dispatch<SetStateAction<ISong>>
}

export const FeedDisplay = ({ feed, onInView }: FeedDisplayProps) => {
  // const songs: UseQueryResult<ISong[], Error> = useAllSongs()

  const songs = trpc.useQuery(['songs.all-songs'])
  console.log(songs, 'SONGS IN FEED')
  // const [onInView, setOnInView] = useState('')

  if (songs.isLoading) return <Loading isLoading={songs.isLoading} />
  if (songs.isError) return <Loading isLoading={songs.isLoading} />
  return <Feed songArray={songs.data} onInView={onInView} />
}
