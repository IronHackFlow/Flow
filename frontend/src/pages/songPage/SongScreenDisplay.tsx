import { useState } from 'react'
import { useParams } from 'react-router'
import { NavigationButton, PlayButton, ExitButton, SongTitle, SongInfo } from './SongScreen'
import CommentMenu from '../../components/_Comments/CommentMenu'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { FollowButtonWrapper } from 'src/components/_Buttons/SocialButtons/FollowButtonWrapper'
import { LikeButtonWrapper } from 'src/components/_Buttons/SocialButtons/LikeButtonWrapper'
import { CommentButtonWrapper } from 'src/components/_Buttons/SocialButtons/CommentButtonWrapper'
import { LoadingSongPage } from 'src/components/Loading/Skeletons/LoadingHome'
import useSongPage from './hooks/useSongPage'

export default function SongScreenDisplay() {
  const { id } = useParams()
  const { songInView, songs, findCurrentSong, isLoading, isError } = useSongPage(id)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [songScreen] = useState(`#353535`)
  const [showCommentMenu, setShowCommentMenu] = useState<boolean>(false)

  if (isLoading || !songInView) return <LoadingSongPage />
  if (isError) return <LoadingSongPage />
  return (
    <LayoutTwo classes={['SongScreen', 'song-screen--container']}>
      <CommentMenu
        song={songInView}
        page="songScreen"
        isOpen={showCommentMenu}
        onClose={setShowCommentMenu}
      />

      <LayoutThree
        classes={[
          'songscreen__header--container',
          'songscreen__header--shadow-outset',
          'songscreen__header--shadow-inset',
        ]}
      >
        <ExitButton />
        <LayoutTwo classes={['songscreen__title--container', 'songscreen__title--shadow-inset']}>
          <LayoutThree
            classes={[
              'songscreen__photo--container',
              'songscreen__photo--shadow-inset',
              'songscreen__photo--shadow-outset',
            ]}
          >
            <img src={songInView?.user?.picture} alt="song user" />
          </LayoutThree>

          <div className="songscreen__song-data--container">
            <LayoutTwo
              classes={[
                'songscreen__song-title--container',
                'songscreen__song-title--shadow-inset',
              ]}
            >
              <SongTitle song={songInView} songs={songs} />
            </LayoutTwo>
            <SongInfo song={songInView} />
          </div>
        </LayoutTwo>
      </LayoutThree>

      <LayoutTwo classes={['song-video-frame', 'song-lyric-container']}>
        {songInView?.lyrics?.map((each, index) => {
          return (
            <div className="each-lyric-container" key={`${each}_${index}`}>
              <p className="each-lyric-no">{index + 1}</p>
              <p className="each-lyric-line">{each}</p>
            </div>
          )
        })}
      </LayoutTwo>

      <div className="songscreen__interactions--container">
        <LayoutThree
          classes={[
            'songscreen__play--container',
            'songscreen__play--shadow-inset',
            'songscreen__play--shadow-outset',
          ]}
        >
          <div className="songscreen__play">
            <NavigationButton onClick={findCurrentSong} direction="back" />
            <LayoutTwo
              classes={['songscreen__play-btn--container', 'songscreen__play-btn--shadow-inset']}
            >
              <LayoutTwo classes={['songscreen__play-btn', 'songscreen__play-btn--shadow-outset']}>
                <PlayButton isPlaying={isPlaying} onClick={setIsPlaying} />
              </LayoutTwo>
            </LayoutTwo>
            <NavigationButton onClick={findCurrentSong} direction="forward" />
          </div>

          <LayoutThree
            classes={[
              'songscreen__audioslider--container',
              'songscreen__audioslider--shadow-inset',
              'songscreen__audioslider--shadow-outset',
            ]}
          >
            <AudioTimeSlider
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentSong={songInView}
              bgColor={songScreen}
            />
          </LayoutThree>
        </LayoutThree>

        <LayoutThree
          classes={[
            'songscreen__social-btns--container',
            'songscreen__social-btns--shadow-outset',
            'songscreen__social-btns--shadow-inset',
          ]}
        >
          <div className="songscreen__btn--container follow">
            <FollowButtonWrapper page="SongScreen" song={songInView} />
          </div>
          <div className="songscreen__btn--container like">
            <LikeButtonWrapper page="SongScreen" song={songInView} likeType="song" />
          </div>
          <div className="songscreen__btn--container comment">
            <CommentButtonWrapper
              page="SongScreen"
              song={songInView}
              onClick={() => setShowCommentMenu(prev => !prev)}
              isPushed={false}
            />
          </div>
        </LayoutThree>
      </div>
    </LayoutTwo>
  )
}
