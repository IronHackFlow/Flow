import React, { useState, useRef, useCallback, PropsWithChildren, useEffect } from 'react'
import { NavigationButton, PlayButton, ExitButton, SongTitle, SongInfo } from './SongScreen'
import CommentMenu from '../../components/_Comments/CommentMenu'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import { ISong } from '../../interfaces/IModels'
import { tempMockSong } from '../_Home/initialData'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useUserSongs } from 'src/hooks/useQueries_REFACTOR/useSongs'
import { FollowButtonWrapper } from 'src/components/_Buttons/SocialButtons/FollowButtonWrapper'
import { LikeButtonWrapper } from 'src/components/_Buttons/SocialButtons/LikeButtonWrapper'
import { CommentButtonWrapper } from 'src/components/_Buttons/SocialButtons/CommentButtonWrapper'
import { LoadingSongPage } from 'src/components/Loading/Skeletons/LoadingHome'
enum Direction {
  Back = 'Back',
  Forward = 'Forward',
}

type LocationProps = {
  currentSong: string
}

export default function SongScreenDisplay() {
  const { id } = useParams()
  const songs = useUserSongs(id ? id : '')
  const location = useLocation()
  const navigate = useNavigate()
  const { currentSong } = location.state as LocationProps
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [songInView, setSongInView] = useState<ISong>()
  const [songScreen] = useState(`#353535`)
  const [userSongs, setUserSongs] = useState<ISong[]>([])
  const [isMarquee, setIsMarquee] = useState(false)
  const [showCommentMenu, setShowCommentMenu] = useState<boolean>(false)

  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (songs.data) {
      setUserSongs(songs.data)
    }
  }, [songs])

  useEffect(() => {
    if (!userSongs || !currentSong) return
    const current = userSongs.filter(each => each._id === currentSong)
    setSongInView(current[0])
  }, [userSongs, currentSong])

  const findCurrentSong = useCallback(
    direction => {
      userSongs.filter((each, index) => {
        if (each._id === songInView?._id) {
          if (direction === 'back') {
            if (index === 0) {
              return null
            } else {
              setSongInView(userSongs[index - 1])
              console.log(songInView, 'back')
            }
          } else {
            if (index === userSongs.length - 1) {
              return null
            } else {
              setSongInView(userSongs[index + 1])
            }
          }
        }
      })
    },
    [userSongs, songInView],
  )

  const onClose = () => {
    navigate(-1)
  }

  if (!songInView || songs.isLoading) return <LoadingSongPage />
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
        <ExitButton onClick={onClose} />
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
              <SongTitle
                song={songInView}
                songs={userSongs}
                isMarquee={isMarquee}
                titleRef={titleRef}
                wrapperRef={wrapperRef}
              />
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
