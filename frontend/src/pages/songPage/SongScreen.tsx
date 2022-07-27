import { useState, useRef, Dispatch, SetStateAction, useLayoutEffect } from 'react'
import useFormatDate from '../../hooks/useFormatDate'
// import { ISong } from '../../interfaces/IModels'
import { ISong } from '../../../../backend/src/models/Song'
import {
  playIcon,
  pauseIcon,
  previousIcon,
  forwardIcon,
  goBackIcon,
} from '../../assets/images/_icons'
import { useNavigate } from 'react-router'

export const NavigationButton = ({ onClick, direction }: { onClick: any; direction: string }) => {
  let icon = direction === 'forward' ? forwardIcon : previousIcon
  return (
    <div className={`songscreen__navigate ${direction}`}>
      <button className="songscreen__navigate-btn" onClick={() => onClick(direction)}>
        <img src={icon} alt="navigation icon" />
      </button>
    </div>
  )
}

export const PlayButton = ({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean
  onClick: Dispatch<SetStateAction<boolean>>
}) => {
  let icon = isPlaying ? pauseIcon : playIcon
  return (
    <button className="songscreen__play-btn--shadow-outset2" onClick={() => onClick(!isPlaying)}>
      <div className="songscreen__play-btn--shadow-inset">
        <img src={icon} alt="pause/pause icon" />
      </div>
    </button>
  )
}

export const ExitButton = () => {
  const navigate = useNavigate()

  const onClose = () => {
    navigate(-1)
  }

  return (
    <div className="songscreen__exit--container">
      <button className="songscreen__exit-btn" onClick={() => onClose()}>
        <div className="songscreen__exit-btn--shadow-inset">
          <img className="button-icons" src={goBackIcon} alt="go back" />
        </div>
      </button>
    </div>
  )
}

type SongTitleProps = {
  song: ISong
  songs: ISong[]
}

export const SongTitle = ({ song, songs }: SongTitleProps) => {
  const [isMarquee, setIsMarquee] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getSongIndex = (array: ISong[], current: ISong): number => {
    let getIndex: number = 0
    array.forEach((each, index) => {
      if (each?._id === current?._id) {
        getIndex = index + 1
      }
    })
    return getIndex
  }

  useLayoutEffect(() => {
    if (!titleRef.current || !wrapperRef.current) throw Error('divRef is not assigned')
    let computedTitleWidth = window.getComputedStyle(titleRef?.current)
    let computedWrapperWidth = window.getComputedStyle(wrapperRef?.current)
    let titleWidth = parseInt(computedTitleWidth.getPropertyValue('width'))
    let wrapperWidth = parseInt(computedWrapperWidth.getPropertyValue('width'))

    if (titleWidth >= wrapperWidth) setIsMarquee(true)
    else setIsMarquee(false)
  }, [song])

  return (
    <>
      <div className={`marquee-wrapper ${isMarquee ? 'marquee--animation' : ''}`} ref={wrapperRef}>
        <p
          className="songscreen__song-title"
          id="marquee-one"
          ref={titleRef}
          style={isMarquee ? {} : { paddingLeft: '6%' }}
        >
          {song?.title}
        </p>
        {isMarquee && (
          <p className="songscreen__song-title" id="marquee-two">
            {song?.title}
          </p>
        )}
      </div>
      <p className="songscreen__song-index">
        <span>{getSongIndex(songs, song)}</span>
        of {songs?.length}
      </p>
    </>
  )
}

export const SongInfo = ({ song }: { song: ISong }) => {
  const { formatDate } = useFormatDate()
  return (
    <div className="songscreen__song-data">
      <p>{song?.caption ? song?.caption : 'No caption for this song'}</p>
      <p>
        by: <span> {song?.user?.username}</span>
      </p>
      <p>on: {formatDate(song?.createdOn, 'MMMM_Dth_YYYY')}</p>
    </div>
  )
}
