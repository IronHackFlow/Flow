import { useContext, useState, useEffect, memo } from 'react'
import { SongDataContext } from "../contexts/SongData"
import Loading from './Loading'
import Video from './Video'
import useDebugInformation from '../utils/useDebugInformation';


const MemoizedFeed = memo(function Feed({ songArray, trackInView, letScroll, onInView }) {
  const { isLoading } = useContext(SongDataContext)
  useDebugInformation("Feed", { songArray, letScroll})

  useEffect(() => {
    let scrollTo = document.getElementById(`${trackInView?._id}`)
    scrollTo?.scrollIntoView({ behavior: "instant"})
  }, [trackInView])

  return (
    <ul 
      className="video-scroll-container" 
      style={letScroll ? {overflowY: "hidden"} : {overflowY: "scroll"}}
      >
      <Loading isLoading={isLoading} />
      {songArray?.map(item => {
        return (
          <Video 
            key={item.song?._id} 
            song={item.song} 
            video={item.songVideo} 
            onInView={onInView}
          />
        )
      })}
    </ul>
  )
}, (prevProps, nextProps) => {
  if (nextProps.songArray !== prevProps.songArray || nextProps.onInView !== prevProps.onInView || nextProps.letScroll !== prevProps.letScroll) {
    return false
  }
  return true
})

export default MemoizedFeed