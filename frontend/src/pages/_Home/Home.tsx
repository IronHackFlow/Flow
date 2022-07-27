import React, { useContext, useEffect, useState, useRef, ReactNode, PropsWithChildren } from 'react'
import { useQueryClient, useIsMutating, QueryObserver } from 'react-query'
import { FeedToggleHeader, FeedToggleButton } from './HomeHeader'
import { tempMockSong } from './initialData'
import { UserPhotoContainer, SongTitle, SongCaption } from './SongDetails'
import { PlayButton } from '../../components/_Buttons/PlayButton'
import { ISong } from '../../../../backend/src/models/Song'
import Navbar from '../../components/_Navbar/Navbar'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import CommentMenu from '../../components/_Comments/CommentMenu'
import { CommentButtonWrapper } from '../../components/_Buttons/SocialButtons/CommentButtonWrapper'
import { FollowButtonWrapper } from '../../components/_Buttons/SocialButtons/FollowButtonWrapper'
import { LikeButtonWrapper } from '../../components/_Buttons/SocialButtons/LikeButtonWrapper'
import { Feed, FeedDisplay } from '../../components/_Feed/Feed'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import LoadingHome from 'src/components/Loading/Skeletons/LoadingHome'

enum Feeds {
  Home = 'Home',
  Trending = 'Trending',
  Following = 'Following',
}

export default function HomeDisplay() {
  const [showCommentMenu, setShowCommentMenu] = useState<boolean>(false)
  const [toggleFeed, setToggleFeed] = useState<string>(Feeds.Home)
  const [songInView, setSongInView] = useState<ISong>(tempMockSong)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  // if (!songInView) return <LoadingHome />
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
          <FeedToggleButton feed={Feeds.Home} selectedFeed={toggleFeed} onClick={setToggleFeed} />
          <FeedToggleButton
            feed={Feeds.Trending}
            selectedFeed={toggleFeed}
            onClick={setToggleFeed}
          />
          <FeedToggleButton
            feed={Feeds.Following}
            selectedFeed={toggleFeed}
            onClick={setToggleFeed}
          />
        </FeedToggleHeader>

        <FeedDisplay feed={toggleFeed} onInView={setSongInView} />

        <div className="section-1c_song-details">
          <LayoutTwo classes={['song-details-1_actions', 'actions_shadow-div-outset']}>
            <LayoutTwo classes={['actions_shadow-div-inset', 'action-btns-container']}>
              <FollowButtonWrapper page="Home" song={songInView} />
              <LikeButtonWrapper page="Home" song={songInView} likeType="song" />
              <CommentButtonWrapper
                page="Home"
                song={songInView}
                onClick={() => setShowCommentMenu(!showCommentMenu)}
                isPushed={false}
              />
            </LayoutTwo>
          </LayoutTwo>

          <LayoutTwo classes={['song-details-2_song-data', 'song-data-container']}>
            <LayoutTwo classes={['song-user-section', 'song-user-container']}>
              <UserPhotoContainer song={songInView} />

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
                  <PlayButton
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    options={{ offset: 9 }}
                  />
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
