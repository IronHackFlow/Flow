import { useEffect, useState, useRef, useCallback, Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import useFormatDate from '../../utils/useFormatDate'
import { editIcon, closeIcon, playIcon, pauseIcon } from '../../assets/images/_icons'
import { IUser, ISong } from '../../interfaces/IModels'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { ConfirmDeleteSong } from './Displays/DeleteSongDisplay'

type Props = {
  song: ISong
  songs: ISong[]
  // setSongs: Dispatch<SetStateAction<Array<Song[]>>>,
  profileUser: IUser | undefined
}

export default function ProfileFlowItem({ song, songs, profileUser }: Props) {
  const { user } = useAuth()
  const { formatDate } = useFormatDate()
  const [deleteCheck, setDeleteCheck] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const songListRef = useRef()

  const audioRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  const setFocus = (e: React.MouseEvent<HTMLElement>) => {
    if (document.activeElement === e.currentTarget) {
      e.currentTarget.blur()
    } else {
      e.currentTarget.focus()
    }
  }

  const deleteCheckHandler = (bool: boolean) => {
    if (bool === false) {
      setDeleteCheck(false)
    } else {
      setDeleteCheck(true)
    }
  }

  const deleteSong = (eachSong: ISong) => {
    // actions
    //   .deleteSong({ song: eachSong })
    //   .then(res => {
    //     console.log(res.data)
    //     if (res.data) {
    //       setSongs(oldArr => oldArr.filter(item => item.song._id !== eachSong._id))
    //     }
    //     setHomeFeedSongs(prev => prev.filter(item => item.song._id !== eachSong._id))
    //   })
    //   .catch(console.error)
  }

  const setSongRefs = useCallback(node => {
    songListRef.current = node
  }, [])

  const setAudioRefs = useCallback(node => {
    audioRef.current = node
  }, [])

  const showLyrics = () => {
    return song?.lyrics?.map((eachLine, index) => {
      return (
        <li className="profile-songs__lyrics-line" key={`${eachLine}lyrics${index}`}>
          <p className="profile-songs__lyrics-line-text no">{index + 1}</p>
          <p className="profile-songs__lyrics-line-text line" key={`${eachLine}_${index}`}>
            {eachLine}
          </p>
        </li>
      )
    })
  }

  return (
    <li className="profile-songs__item" ref={setSongRefs} onClick={e => setFocus(e)}>
      {deleteCheck ? (
        <>
          <div className="profile-songs__body">
            <div className="profile-songs__header">
              <Link
                to={`/songScreen/${song._id}`}
                state={{ currentSong: song }}
                type="button"
                className="profile-songs__header--shadow-outset"
              >
                <div className="profile-songs__title">
                  <p className="profile-songs__title-text">{song.title}</p>
                </div>
                <div className="profile-songs__song-info">
                  <div className="profile-songs__text--container">
                    <p className="profile-songs__text caption">
                      {song.caption ? song.caption : 'no caption for this flow'}
                    </p>
                  </div>
                  <div className="profile-songs__text--container">
                    <p className="profile-songs__text social">
                      {formatDate(song?.createdOn, 'm')}
                      <span className="profile-songs__text-bullet">
                        {String.fromCodePoint(8226)}
                      </span>
                      {song?.likes?.length === 1
                        ? `${song?.likes?.length} like`
                        : `${song?.likes?.length} likes`}
                      <span className="profile-songs__text-bullet">
                        {String.fromCodePoint(8226)}
                      </span>
                      {song?.comments?.length === 1
                        ? `${song?.comments?.length} comment`
                        : `${song?.comments?.length} comments`}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <LayoutTwo classes={["profile-songs__lyrics", "profile-songs__lyrics--shadow-outset"]}>
              <ul className="profile-songs__lyrics-text">{showLyrics()}</ul>
            </LayoutTwo>
          </div>

          <LayoutTwo classes={["profile-songs__action-btns--container", "buttons-inner"]}>
            {profileUser?._id === user?._id && (
              <>
                <LayoutThree classes={["delete-btn-container delete", "play-container", "play-outset"]}>
                  <button className="play-inset">
                    <img
                      className="button-icons"
                      src={closeIcon}
                      onClick={() => deleteCheckHandler(false)}
                      alt="exit"
                    />
                  </button>
                </LayoutThree>
                <LayoutThree classes={["delete-btn-container edit", "play-container", "play-outset"]}>
                  <Link
                    to={`/editLyrics`}
                    state={{ propSongs: songs, propCurrentSong: song }}
                    className="play-inset"
                  >
                    <img className="button-icons" src={editIcon} alt="edit" />
                  </Link>
                </LayoutThree>
              </>
            )}
            <LayoutThree classes={["delete-btn-container play", "play-container", "play-outset"]}>
              <audio src={song?.audio} ref={setAudioRefs}></audio>
              <button className="play-inset">
                <img
                  className="button-icons bi-play-2"
                  src={isPlaying ? pauseIcon : playIcon}
                  onClick={() => handlePlayPause()}
                  alt="play"
                />
              </button>
            </LayoutThree>
          </LayoutTwo>
        </>
      ) : (
        <ConfirmDeleteSong song={song} />
      )}
    </li>
  )
}
