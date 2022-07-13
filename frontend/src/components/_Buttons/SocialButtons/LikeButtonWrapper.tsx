import React, { useState, useEffect, useRef } from 'react'
import {
  useAddLike,
  useDeleteLike,
} from '../../../hooks/useQueries_REFACTOR/useLikesOrFollows/useLikes'
import { ISong } from '../../../interfaces/IModels'
import { checkListForUserId } from '../../../utils/Social_REFACTOR/socialFilters'
import { useAuth } from '../../../contexts/_AuthContext/AuthContext'
import usePrevious from '../../../hooks/usePrevious'
import { SocialButtonSongs, SocialButtonHome } from './SocialButtons'
import { IWrapperProps, ISocialButtonProps } from './utils'

interface LikeButtonWrapperProps extends IWrapperProps {
  likeType: string
}

export const useLikeButton = () => {
  const addLike = useAddLike()
  const deleteLike = useDeleteLike()
  return { addLike: addLike, deleteLike: deleteLike }
}

export const LikeButtonWrapper = ({ page, song, likeType }: LikeButtonWrapperProps) => {
  const { user } = useAuth()
  const { addLike, deleteLike } = useLikeButton()
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [totalLikes, setTotalLikes] = useState<number>(-1)
  const [hasClicked, setHasClicked] = useState<boolean>(false)

  const prevSong: ISong = usePrevious<ISong>(song)
  const prevLikes: string[] = usePrevious<string[]>(song?.likes)
  const prevTotalLikes: number = usePrevious<number>(totalLikes)

  useEffect(() => {
    if (!user) return
    const songLikes = song?.likes
    setIsLiked(checkListForUserId(user._id, songLikes))
    setTotalLikes(songLikes?.length)
  }, [song, user])

  useEffect(() => {
    if (hasClicked) {
      handleLikeMutationOnStateChange(
        prevSong,
        hasClicked,
        prevLikes?.length,
        prevTotalLikes,
        user?._id,
      )
      setHasClicked(false)
    }
  }, [song])

  const handleLikeMutationOnStateChange = (
    _song: ISong,
    _hasClicked: boolean,
    propLikes: number,
    stateLikes: number,
    _userId: string | undefined,
  ) => {
    if (propLikes === stateLikes || !_hasClicked || !_userId) {
      return console.log(propLikes, stateLikes, _hasClicked, 'user hasnt added or deleted a like')
    } else if (propLikes < stateLikes) {
      console.log(propLikes, stateLikes, 'Adding a like')
      addLike.mutate({ id: _song._id, type: likeType, song: _song, userId: _userId })
    } else {
      console.log(propLikes, stateLikes, 'Deleting a like')
      deleteLike.mutate({ id: _song._id, type: likeType, song: _song, userId: _userId })
    }
  }

  const executeLikeAction = () => {
    setHasClicked(true)
    if (isLiked) {
      setIsLiked(false)
      setTotalLikes(totalLikes - 1)
    } else {
      setIsLiked(true)
      setTotalLikes(totalLikes + 1)
    }
  }

  const props: ISocialButtonProps = {
    type: 'Like',
    total: totalLikes,
    onClick: executeLikeAction,
    hasUser: isLiked,
  }

  if (page === 'SongScreen') return <SocialButtonSongs {...props} />
  return <SocialButtonHome {...props} />
}
