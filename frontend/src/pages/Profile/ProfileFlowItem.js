import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../../contexts/TheContext'
import { SongDataContext } from '../../contexts/SongData'
import actions from '../../api'
import useFormatDate from '../../utils/useFormatDate'
import { editIcon, closeIcon, playIcon, pauseIcon } from '../../assets/images/_icons'

export default function ProfileFlowItem({ song, songs, setSongs, profileUser }) {
  const { user } = useContext(TheContext)
  const { homeFeedSongs, setHomeFeedSongs } = useContext(SongDataContext)
  const { formatDate } = useFormatDate()
  const [deleteCheck, setDeleteCheck] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const songListRef = useRef()

  const audioRef = useRef()

  useEffect(() => {
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

  const setFocus = e => {
    if (document.activeElement === e.currentTarget) {
      e.currentTarget.blur()
    } else {
      e.currentTarget.focus()
    }
  }

  const deleteCheckHandler = bool => {
    if (bool === false) {
      setDeleteCheck(false)
    } else {
      setDeleteCheck(true)
    }
  }

  const deleteSong = eachSong => {
    actions
      .deleteSong({ song: eachSong })
      .then(res => {
        console.log(res.data)
        setSongs(oldArr => oldArr.filter(item => item._id !== eachSong._id))
        setHomeFeedSongs(prev => prev.filter(item => item.song._id !== eachSong._id))
      })
      .catch(console.error)
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
        <div className="profile-songs__lyrics-line" key={`${eachLine}lyrics${index}`}>
          <p className="profile-songs__lyrics-line-text no">{index + 1}</p>
          <p className="profile-songs__lyrics-line-text line" key={`${eachLine}_${index}`}>
            {eachLine}
          </p>
        </div>
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
                  <p className="profile-songs__title-text">{song.name}</p>
                </div>
                <div className="profile-songs__song-info">
                  <div className="profile-songs__text--container">
                    <p className="profile-songs__text caption">
                      {song.caption ? song.caption : 'no caption for this flow'}
                    </p>
                  </div>
                  <div className="profile-songs__text--container">
                    <p className="profile-songs__text">
                      {formatDate(song.date, 'm')}
                      <span className="profile-songs__text-bullet">
                        {String.fromCodePoint(8226)}
                      </span>
                      {song.song_likes.length === 1
                        ? `${song.song_likes.length} like`
                        : `${song.song_likes.length} likes`}
                      <span className="profile-songs__text-bullet">
                        {String.fromCodePoint(8226)}
                      </span>
                      {song.song_comments.length === 1
                        ? `${song.song_comments.length} comment`
                        : `${song.song_comments.length} comments`}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="profile-songs__lyrics">
              <div className="profile-songs__lyrics--shadow-outset">
                <div className="profile-songs__lyrics-text">{showLyrics()}</div>
              </div>
            </div>
          </div>

          <div className="profile-songs__action-btns--container">
            <div className="buttons-inner">
              {profileUser?._id === user?._id && (
                <>
                  <div className="delete-btn-container">
                    <div className="play-container">
                      <div className="play-outset">
                        <button className="play-inset">
                          <img
                            className="button-icons"
                            src={closeIcon}
                            onClick={() => deleteCheckHandler(false)}
                            alt="exit"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="delete-btn-container">
                    <div className="play-container">
                      <div className="play-outset">
                        <Link
                          to={`/editLyrics`}
                          state={{ propSongs: songs, propCurrentSong: song }}
                          className="play-inset"
                        >
                          <img className="button-icons" src={editIcon} alt="edit" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="delete-btn-container">
                <audio src={song.songURL} ref={setAudioRefs}></audio>
                <div className="play-container">
                  <div className="play-outset">
                    <button className="play-inset">
                      <img
                        className="button-icons bi-play-2"
                        src={isPlaying ? pauseIcon : playIcon}
                        onClick={() => handlePlayPause()}
                        alt="play"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="delete-container">
          <div className="delete-question-container">
            <p>
              Are you sure you want to delete <span>{song.name}</span>?
            </p>
          </div>
          <div className="delete-btn-container">
            <div className="delete-btn_shadow-div-inset">
              <div className="space-container"></div>
              <div className="cancel-btn-container">
                <button
                  className="cancel-btn_shadow-div-outset"
                  onClick={() => deleteCheckHandler(true)}
                >
                  Cancel
                </button>
              </div>
              <div className="confirm-btn-container">
                <button className="confirm-btn_shadow-div-outset" onClick={() => deleteSong(song)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
