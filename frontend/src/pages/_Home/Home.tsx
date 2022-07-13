import React, { useContext, useEffect, useState, useRef, ReactNode, PropsWithChildren } from 'react'
import { useQueryClient, useIsMutating, QueryObserver } from 'react-query'
import { FeedToggleHeader, FeedToggleButton } from './HomeHeader'
import { tempMockSong } from './initialData'
import { UserPhoto, SongTitle, SongCaption } from './SongDetails'
import { PlayButton } from '../../components/_Buttons/PlayButton'
import { ISong } from '../../interfaces/IModels'
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
  const queryClient = useQueryClient()
  const [showCommentMenu, setShowCommentMenu] = useState<boolean>(false)
  const [toggleFeed, setToggleFeed] = useState<string>(Feeds.Home)
  const [songInView, setSongInView] = useState<ISong>(tempMockSong)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [trackInView, setTrackInView] = useState<ISong | undefined>()

  const renderRef = useRef(0)

  useEffect(() => {
    // const songs: ISong[] | undefined = queryClient.getQueryData('songs')
    // if (trackInView === '' && songs) {
    //   setSongInView(songs[0])
    // } else {
    //   let song = songs?.filter(each => each._id === trackInView)
    //   if (song) {
    //     setSongInView(song[0])
    //   }
    // }

    if (trackInView) {
      // setSongInView(trackInView)
      const currentSong: ISong | undefined = queryClient.getQueryData([
        'songs',
        'current',
        trackInView?._id,
      ])
      if (currentSong) {
        setSongInView(currentSong)
      }
    }
  }, [trackInView, songInView])

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

        <FeedDisplay feed={toggleFeed} onInView={setTrackInView} />

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
