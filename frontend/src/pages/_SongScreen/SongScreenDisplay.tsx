import React, { useState, useRef, useCallback, PropsWithChildren } from 'react'
import { NavigationButton, PlayButton, ExitButton, SongTitle, SongInfo } from './SongScreen'
import CommentMenu from '../../components/_Comments/CommentMenu'
import AudioTimeSlider from '../../components/_AudioTimeSlider/AudioTimeSlider'
import { ISong } from '../../interfaces/IModels'
import { tempMockSong } from '../_Home/initialData'
import { LayoutThree, LayoutTwo } from '../../components/__Layout/LayoutWrappers'

export default function SongScreenDisplay() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [songInView, setSongInView] = useState<ISong>(tempMockSong)
  const [songScreen] = useState(`#353535`)
  const [userSongs, setUserSongs] = useState<ISong[]>([])
  const [isMarquee, setIsMarquee] = useState(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const findCurrentSong = useCallback(
    direction => {
      userSongs.filter((each, index) => {
        if (each._id === songInView._id) {
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
    // if (returnValue) navigate('/search', { state: { returnValue: returnValue } })
    // else navigate(-1)
  }

  return (
    <LayoutTwo classes={['SongScreen', 'song-screen--container']}>
      <CommentMenu song={songInView} page="songScreen" isOpen={showMenu} onClose={setShowMenu} />

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
          <div className="songscreen__btn--container follow"></div>
          <div className="songscreen__btn--container like"></div>
          <div className="songscreen__btn--container comment"></div>
        </LayoutThree>
      </div>
    </LayoutTwo>
  )
}
