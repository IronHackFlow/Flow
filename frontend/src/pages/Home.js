import { useContext, useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import TheContext from '../contexts/TheContext'
import HomeContext from '../contexts/HomeContext'
import { SongDataContext } from '../contexts/SongData'
import useDebugInformation from '../utils/useDebugInformation'
import useFormatDate from '../utils/useFormatDate'
import usePostFollow from '../utils/usePostFollow'
import usePostLike from '../utils/usePostLike'
import Feed from '../components/Feed/Feed'
import NavBar from '../components/NavBar.js'
import ButtonSocialAction from '../components/ButtonSocialAction'
import CommentButton from '../components/Comments/CommentButton'
import CommentMenu from '../components/Comments/CommentMenu.js'
import CommentInputModal from '../components/Comments/CommentInputModal'
import AudioTimeSlider from '../components/AudioTimeSlider.js'
import { playIcon, pauseIcon, bulletPointIcon } from '../assets/images/_icons'

export default function Home(props) {
  const { user } = useContext(TheContext)
  const { homeFeedSongs, isLoading } = useContext(SongDataContext)
  const { formatDate } = useFormatDate()
  const { addSongLike, deleteSongLike } = usePostLike()
  const { postFollow, deleteFollow } = usePostFollow()
  useDebugInformation('Home', props)

  const [songInView, setSongInView] = useState(homeFeedSongs[0]?.song)
  const [currentInView, setCurrentInView] = useState(null)
  const [toggleFeed, setToggleFeed] = useState('home')
  const [trackInView, setTrackInView] = useState({ home: null, trending: null, following: null })
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCommentMenu, setShowCommentMenu] = useState(false)
  const [showCommentInputModal, setShowCommentInputModal] = useState(null)
  const [editComment, setEditComment] = useState(null)
  const [isMarquee, setIsMarquee] = useState(false)

  const titleRef = useRef()
  const wrapperRef = useRef()

  useLayoutEffect(() => {
    let computedTitleWidth = window.getComputedStyle(titleRef.current)
    let computedWrapperWidth = window.getComputedStyle(wrapperRef.current)
    let titleWidth = parseInt(computedTitleWidth.getPropertyValue('width'))
    let wrapperWidth = parseInt(computedWrapperWidth.getPropertyValue('width'))

    if (titleWidth >= wrapperWidth) setIsMarquee(true)
    else setIsMarquee(false)
  }, [songInView])

  useEffect(() => {
    if (currentInView) {
      let viewSong = homeFeedSongs.filter(each => each.song._id === currentInView)
      setSongInView(viewSong[0].song)
    }
  }, [currentInView])

  const showFeedInDisplay = useCallback(() => {
    let trendingFeed = [...homeFeedSongs].sort(
      (a, b) => b.song.song_likes.length - a.song.song_likes.length,
    )
    let filterUserFollows = user?.user_follows.map(each => {
      return each.followed_user
    })
    let followingFeed = homeFeedSongs.filter(each => {
      let followedUser = false
      filterUserFollows?.forEach(user => {
        if (each.song.song_user._id === user) {
          followedUser = true
        }
      })
      if (followedUser) return each
    })

    if (toggleFeed === 'home')
      return (
        <Feed
          songArray={homeFeedSongs}
          trackInView={trackInView?.home}
          letScroll={showCommentMenu}
          onInView={setCurrentInView}
        />
      )
    else if (toggleFeed === 'trending')
      return (
        <Feed
          songArray={trendingFeed}
          trackInView={trackInView?.trending ? trackInView?.trending : trendingFeed[0].song}
          letScroll={showCommentMenu}
          onInView={setCurrentInView}
        />
      )
    else
      return (
        <Feed
          songArray={followingFeed}
          trackInView={trackInView?.following ? trackInView.following : followingFeed[0].song}
          letScroll={showCommentMenu}
          onInView={setCurrentInView}
        />
      )
  }, [homeFeedSongs, toggleFeed, showCommentMenu])

  const showFeedHandler = feed => {
    setTrackInView(prev => ({
      ...prev,
      [toggleFeed]: songInView,
    }))
    setToggleFeed(feed)
  }

  const handleCommentMenu = () => {
    setShowCommentMenu(true)
    setShowCommentInputModal('comment')
  }

  return (
    <HomeContext.Provider
      value={{ editComment, setEditComment, showCommentInputModal, setShowCommentInputModal }}
    >
      <div className="Home" id="Home">
        <CommentInputModal
          songId={songInView?._id}
          isOpen={showCommentInputModal}
          onClose={setShowCommentInputModal}
          onEdit={editComment}
        />
        <CommentMenu
          songInView={songInView}
          isOpen={showCommentMenu}
          onClose={setShowCommentMenu}
          onCloseInput={setShowCommentInputModal}
        />

        <div className="section-1_feed">
          <div
            className="section-1a_toggle-feed"
            style={showCommentMenu ? { height: '0%', visibility: 'hidden' } : {}}
          >
            <div className="toggle-feed-container">
              <div
                className="each-feed_shadow-div-inset"
                style={{ borderRadius: '0.3vh 0.3vh 0.3vh 2.5vh' }}
              >
                <button
                  className={
                    toggleFeed === 'home'
                      ? 'each-feed_shadow-div-outset toggle-feed'
                      : 'each-feed_shadow-div-outset'
                  }
                  onClick={() => showFeedHandler('home')}
                  style={{ borderRadius: '4vh .2vh .2vh 4vh' }}
                >
                  <div
                    className={
                      toggleFeed === 'home'
                        ? 'each-feed_shadow-div-inset-2 toggle-feed-2'
                        : 'each-feed_shadow-div-inset-2'
                    }
                  >
                    Feed
                  </div>
                </button>
              </div>

              <div className="each-feed_shadow-div-inset">
                <button
                  className={
                    toggleFeed === 'trending'
                      ? 'each-feed_shadow-div-outset toggle-feed'
                      : 'each-feed_shadow-div-outset'
                  }
                  onClick={() => showFeedHandler('trending')}
                >
                  <div
                    className={
                      toggleFeed === 'trending'
                        ? 'each-feed_shadow-div-inset-2 toggle-feed-2'
                        : 'each-feed_shadow-div-inset-2'
                    }
                  >
                    Trending
                  </div>
                </button>
              </div>
              <div
                className="each-feed_shadow-div-inset"
                style={{ borderRadius: '.3vh .3vh 2.5vh .3vh' }}
              >
                <button
                  className={
                    toggleFeed === 'following'
                      ? 'each-feed_shadow-div-outset toggle-feed'
                      : 'each-feed_shadow-div-outset'
                  }
                  style={{ borderRadius: '.2vh 4vh 4vh .2vh' }}
                  onClick={() => showFeedHandler('following')}
                >
                  <div
                    className={
                      toggleFeed === 'following'
                        ? 'each-feed_shadow-div-inset-2 toggle-feed-2'
                        : 'each-feed_shadow-div-inset-2'
                    }
                  >
                    Following
                  </div>
                </button>
              </div>
            </div>
          </div>

          {showFeedInDisplay()}

          <div className="section-1c_song-details">
            <div className="song-details-1_actions">
              <div className="actions_shadow-div-outset">
                <div className="actions_shadow-div-inset">
                  <div className="action-btns-container">
                    <ButtonSocialAction
                      type="follow"
                      songInView={{
                        id: songInView?.song_user?._id,
                        list: songInView?.song_user?.followers,
                      }}
                      btnStyle="home"
                      action={{ add: postFollow, delete: deleteFollow }}
                    />
                    <ButtonSocialAction
                      type="like"
                      songInView={{ id: songInView?._id, list: songInView?.song_likes }}
                      btnStyle="home"
                      action={{ add: addSongLike, delete: deleteSongLike }}
                    />
                    <CommentButton
                      songInView={songInView}
                      btnStyle="home"
                      isPushed={showCommentMenu}
                      onClose={handleCommentMenu}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="song-details-2_song-data">
              <div className="song-data-container">
                <div className="song-user-section">
                  <div className="song-user-container">
                    <div className="user-pic-container">
                      <div className="user-pic_shadow-div-outset">
                        <Link
                          to={`/profile/${songInView?.song_user?._id}`}
                          state={{ propSongUser: songInView?.song_user }}
                          className="user-pic_shadow-div-inset"
                        >
                          <div
                            className="loading loading-pic"
                            style={isLoading ? { opacity: '1' } : { opacity: '0' }}
                          ></div>
                          <img src={songInView?.song_user?.picture} alt="" />
                        </Link>
                      </div>
                    </div>

                    <div className="song-title-container">
                      <div className="song-title_shadow-div-outset">
                        <div className="song-title_shadow-div-inset">
                          <div className="song-title_title--container">
                            <div
                              className="loading loading-title"
                              style={isLoading ? { opacity: '1' } : { opacity: '0' }}
                            ></div>
                            <div
                              className={`marquee-wrapper ${isMarquee ? 'marquee--animation' : ''}`}
                              ref={wrapperRef}
                            >
                              <p className="song-title-marquee" id="marquee-one" ref={titleRef}>
                                {songInView?.name} {String.fromCodePoint(8226)}{' '}
                                <span>{songInView?.song_user?.user_name}</span>
                              </p>
                              {isMarquee && (
                                <p className="song-title-marquee" id="marquee-two">
                                  {songInView?.name} {String.fromCodePoint(8226)}{' '}
                                  <span>{songInView?.song_user?.user_name}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="song-caption-container">
                          <p
                            className="song-date"
                            style={isLoading ? { opacity: '0' } : { opacity: '1' }}
                          >
                            {formatDate(songInView?.date, 'm')}
                            <span>{String.fromCodePoint(8226)}</span>
                          </p>
                          <p
                            className="song-caption"
                            style={isLoading ? { opacity: '0' } : { opacity: '1' }}
                          >
                            {songInView?.caption
                              ? `${songInView?.caption}`
                              : 'no caption for this song'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="song-play-section">
                  <div className="play-song-container">
                    <div className="play-btn-container">
                      <div className="play-btn-container-2">
                        <div className="play-btn_inset-container">
                          <div className="play-btn_shadow-div-inset">
                            <button
                              className="play-btn_shadow-div-outset"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              <img
                                className={`button-icons ${isPlaying ? 'bi-pause' : 'bi-play'}`}
                                src={isPlaying ? pauseIcon : playIcon}
                                alt="play or pause"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="play-bar-container">
                    <div className="play-bar_shadow-div-inset">
                      <AudioTimeSlider
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentSong={songInView}
                        bgColor={`#6d6d6d`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavBar isVisible={showCommentMenu} />
      </div>
    </HomeContext.Provider>
  )
}
