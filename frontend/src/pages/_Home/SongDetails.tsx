import { useLayoutEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { UserPhoto } from 'src/components/UserPhoto/UserPhoto'
import { ISong } from '../../../../backend/src/models/Song'
import useFormatDate from '../../hooks/useFormatDate'

type SongTitleProps = {
  song: ISong
}

const PRIMARY_COLOR_400 = '#e24f8c'
const BASE_COLOR = '#ffffff'

export const UserPhotoContainer = ({ song }: { song: ISong }) => {
  const user = song?.user
  return (
    <div className="user-pic-container">
      <div className="user-pic_shadow-div-outset">
        <Link
          to={`/profile/${user?._id}`}
          state={{ propSongUser: user }}
          className="user-pic_shadow-div-inset"
        >
          <div
            className="user-pic_wrapper"
            style={{ border: `2px solid ${user?.picture ? PRIMARY_COLOR_400 : BASE_COLOR}` }}
          >
            <UserPhoto photoUrl={user?.picture} username={user?.username} />
          </div>
          {/* <img src={song?.user?.picture} alt="" /> */}
        </Link>
      </div>
    </div>
  )
}

export const SongTitle = ({ song }: SongTitleProps) => {
  const [isMarquee, setIsMarquee] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
    <div className="song-title_shadow-div-inset">
      <div className="song-title_title--container">
        <div
          className={`marquee-wrapper ${isMarquee ? 'marquee--animation' : ''}`}
          ref={wrapperRef}
        >
          <p className="song-title-marquee" id="marquee-one" ref={titleRef}>
            {song?.title} {String.fromCodePoint(8226)} <span>{song?.user?.username}</span>
          </p>
          {isMarquee && (
            <p className="song-title-marquee" id="marquee-two">
              {song?.title} {String.fromCodePoint(8226)} <span>{song?.user?.username}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const SongCaption = ({ song }: { song: ISong }) => {
  const { formatDate } = useFormatDate()
  return (
    <div className="song-caption--container">
      <p className="song-caption__text date">{formatDate(song.createdOn, 'm')}</p>
      <p className="song-caption__text bullet">{String.fromCodePoint(8226)}</p>
      <p className="song-caption__text caption">
        {song?.caption ? `${song.caption}` : 'no caption for this song'}
      </p>
    </div>
  )
}
