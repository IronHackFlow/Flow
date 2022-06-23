import React, { useLayoutEffect, useState, useRef, Dispatch } from 'react'
import { SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { ISong } from '../../interfaces/IModels'
import useFormatDate from '../../utils/useFormatDate'
import { playIcon, pauseIcon } from '../../assets/images/_icons'

type SongTitleProps = {
  song: ISong | undefined
  // isMarquee: boolean
  // titleRef: any
  // wrapperRef: any
}

type PlayButtonProps = {
  isPlaying: boolean
  setIsPlaying: Dispatch<SetStateAction<boolean>>
}

export const UserPhoto = ({song}: {song: ISong | undefined}) => {
  return (
    <div className="user-pic-container">
      <div className="user-pic_shadow-div-outset">
        <Link
          to={`/profile/${song?.user?._id}`}
          state={{ propSongUser: song?.user }}
          className="user-pic_shadow-div-inset"
        >
          {/* <div
            className="loading loading-pic"
            style={isLoading ? { opacity: '1' } : { opacity: '0' }}
          ></div> */}
          <img src={song?.user?.picture} alt="" />
        </Link>
      </div>
    </div>
  )
}

export const SongTitle = ({song}: SongTitleProps) => {
  const [isMarquee, setIsMarquee] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!titleRef.current || !wrapperRef.current) throw Error("divRef is not assigned")
    let computedTitleWidth = window.getComputedStyle(titleRef?.current)
    let computedWrapperWidth = window.getComputedStyle(wrapperRef?.current)
    let titleWidth = parseInt(computedTitleWidth.getPropertyValue('width'))
    let wrapperWidth = parseInt(computedWrapperWidth.getPropertyValue('width'))

    if (titleWidth >= wrapperWidth) setIsMarquee(true)
    else setIsMarquee(false)
  }, [song])

  return (
    <div className="song-title_shadow-div-inset">
      <div className="song-title_title--container">
        <div
          className={`marquee-wrapper ${isMarquee ? 'marquee--animation' : ''}`}
          ref={wrapperRef}
        >
          <p className="song-title-marquee" id="marquee-one" ref={titleRef}>
            {song?.title} {String.fromCodePoint(8226)}{' '}
            <span>{song?.user?.username}</span>
          </p>
          {isMarquee && (
            <p className="song-title-marquee" id="marquee-two">
              {song?.title} {String.fromCodePoint(8226)}{' '}
              <span>{song?.user?.username}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const SongCaption = ({song}: {song: ISong}) => {
  const { formatDate } = useFormatDate()
  return (
    <div className="song-caption-container">
      <p
        className="song-date"
        // style={isLoading ? { opacity: '0' } : { opacity: '1' }}
      >
        {formatDate(song?.createdOn, 'm')}
        <span>{String.fromCodePoint(8226)}</span>
      </p>
      <p
        className="song-caption"
        // style={isLoading ? { opacity: '0' } : { opacity: '1' }}
      >
        {song?.caption
          ? `${song?.caption}`
          : 'no caption for this song'}
      </p>
    </div>
  )
}