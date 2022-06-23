import React, { useContext, useEffect, useState, useRef, ReactNode, PropsWithChildren } from 'react'
import { FeedToggleHeader, FeedToggleButton } from './HomeHeader'
import { tempMockSong } from './initialData'
import { UserPhoto, SongTitle, SongCaption } from './SongDetails'
import { PlayButton } from '../../components/_Buttons/PlayButton'
import { ISong } from '../../interfaces/IModels'
import Navbar from '../../components/_Navbar/Navbar'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import CommentMenu from '../../components/_Comments/CommentMenu'
import CommentButtonWrapper from './CommentButtonWrapper'
import { FollowButtonWrapper } from '../../components/_LikesFollows/FollowButtonWrapper'
import { LikeButtonWrapper } from '../../components/_LikesFollows/LikeButtonWrapper'
import { FeedDisplay } from '../../components/_Feed/Feed'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { useAllSongs } from '../../hooks/useQueries_REFACTOR/useSongs'

export default function HomeDisplay() {
  const songs = useAllSongs()
  const [showCommentMenu, setShowCommentMenu] = useState<boolean>(false)
  const [toggleFeed, setToggleFeed] = useState<string>('home')
  const [songInView, setSongInView] = useState<ISong>(tempMockSong)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [trackInView, setTrackInView] = useState<string>('')

  const renderRef = useRef(0)

  useEffect(() => {
    if (songs.data) {
      if (trackInView === '') {
        setSongInView(songs.data[0])
      } else {
        let song = songs.data.filter(each => each._id === trackInView)
        setSongInView(song[0])
      }
    }
  }, [trackInView, songs])

  if (songs.isLoading) return null
  if (songs.isError) return null
  return (
    <div className="Home" id="Home">
      <CommentMenu
        song={songInView}
        page="home"
        isOpen={showCommentMenu}
        onClose={setShowCommentMenu}
      />
      <div className="section-1_feed">
        <FeedToggleHeader showMenu={showCommentMenu}>
          <FeedToggleButton feed="Home" selectedFeed={toggleFeed} onClick={setToggleFeed} />
          <FeedToggleButton feed="Trending" selectedFeed={toggleFeed} onClick={setToggleFeed} />
          <FeedToggleButton feed="Following" selectedFeed={toggleFeed} onClick={setToggleFeed} />
        </FeedToggleHeader>

        <FeedDisplay feed={toggleFeed} onInView={setTrackInView} />

        <div className="section-1c_song-details">
          <LayoutTwo classes={['song-details-1_actions', 'actions_shadow-div-outset']}>
            <LayoutTwo classes={['actions_shadow-div-inset', 'action-btns-container']}>
              <FollowButtonWrapper song={songInView} userId="" type="follow" />
              <LikeButtonWrapper song={songInView} type="like" likeType="song" />
              <CommentButtonWrapper
                song={songInView}
                type="comment"
                onClick={() => setShowCommentMenu(!showCommentMenu)}
                isPushed={false}
              />
            </LayoutTwo>
          </LayoutTwo>

          {console.log(renderRef.current++, 'Checking Renders in Home')}

          <LayoutTwo classes={['song-details-2_song-data', 'song-data-container']}>
            <LayoutTwo classes={['song-user-section', 'song-user-container']}>
              <UserPhoto song={songInView} />

              <LayoutTwo classes={['song-title-container', 'song-title_shadow-div-outset']}>
                <SongTitle song={songInView} />
                <SongCaption song={songInView} />
              </LayoutTwo>
            </LayoutTwo>

            <div className="song-play-section">
              <LayoutThree
                classes={['play-song-container', 'play-btn-container', 'play-btn-container-2']}
              >
                <LayoutTwo classes={['play-btn_inset-container', 'play-btn_shadow-div-inset']}>
                  <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                </LayoutTwo>
              </LayoutThree>

              <LayoutTwo classes={['play-bar-container', 'play-bar_shadow-div-inset']}>
                <AudioTimeSlider
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentSong={songInView}
                  bgColor={`#6d6d6d`}
                />
              </LayoutTwo>
            </div>
          </LayoutTwo>
        </div>
      </div>
      <Navbar isVisible={showCommentMenu} />
    </div>
  )
}
