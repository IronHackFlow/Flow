import { useState, useRef, useCallback, PropsWithChildren, useEffect } from 'react'
import { trpc } from 'src/utils/trpc'
import { ISong } from '../../../../../backend/src/models/Song'

const useSongPage = (id: string | undefined) => {
  const {
    data: song,
    isLoading: songIsLoading,
    isError: songIsError,
  } = trpc.useQuery(['songs.get-song', { _id: id }], {
    enabled: !!id,
  })
  const userId = song?.user?._id
  const {
    data: songs,
    isLoading: songsIsLoading,
    isError: songsIsError,
  } = trpc.useQuery(['songs.users-songs', { _id: userId }], {
    enabled: !!userId,
  })
  const [songInView, setSongInView] = useState<ISong>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    if (song) {
      setSongInView(song)
    }
  }, [song])

  useEffect(() => {
    if (songIsLoading || songsIsLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [songIsLoading, songsIsLoading])

  useEffect(() => {
    if (songIsError || songsIsError) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }, [songIsError, songsIsError])

  const findCurrentSong = useCallback(
    (direction: 'back' | 'forward') => {
      if (!songs) return
      ;[...songs].filter((each: ISong, index: number) => {
        if (each._id === songInView?._id) {
          if (direction === 'back') {
            if (index === 0) {
              return null
            } else {
              setSongInView(songs[index - 1])
              console.log(songInView, 'back')
            }
          } else {
            if (index === songs.length - 1) {
              return null
            } else {
              setSongInView(songs[index + 1])
            }
          }
        }
      })
    },
    [songs, songInView],
  )

  return { songInView, songs, findCurrentSong, isLoading, isError }
}

export default useSongPage
