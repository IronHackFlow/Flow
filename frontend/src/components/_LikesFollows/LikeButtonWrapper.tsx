import React, { useState, useEffect, useRef } from 'react'
import {
  useAddLike,
  useDeleteLike,
} from '../../hooks/useQueries_REFACTOR/useLikesOrFollows/useLikes'
import { ISong } from '../../interfaces/IModels'
import { checkListForUserId } from '../../utils/Social_REFACTOR/socialFilters'
import { HomeSocialButton } from '../_Buttons/HomeSocialButton'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import usePrevious from '../../hooks/usePrevious'

type LikeProps = {
  song: ISong
  type: string
  likeType: string
}

export const useLikeButton = () => {
  const addLike = useAddLike()
  const deleteLike = useDeleteLike()
  return { addLike: addLike, deleteLike: deleteLike }
}

export const LikeButtonWrapper = ({ song, type, likeType }: LikeProps) => {
  const { user } = useAuth()
  const { addLike, deleteLike } = useLikeButton()
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [totalLikes, setTotalLikes] = useState<number>(-1)
  const [hasClicked, setHasClicked] = useState<boolean>(false)

  const prevSong: ISong = usePrevious<ISong>(song)
  const prevLikes: string[] = usePrevious<string[]>(song?.likes)
  const prevTotalLikes: number = usePrevious<number>(totalLikes)

  useEffect(() => {
    if (!song || !user) return
    const songLikes = song?.likes
    setIsLiked(checkListForUserId(user._id, songLikes))
    setTotalLikes(songLikes.length)
  }, [song])

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
    // update totalLikes, isLiked, with mockdata
    // update client cache
    setHasClicked(true)
    if (isLiked) {
      setIsLiked(false)
      setTotalLikes(totalLikes - 1)
    } else {
      setIsLiked(true)
      setTotalLikes(totalLikes + 1)
    }
  }

  const props = {
    type: 'like',
    total: totalLikes,
    onClick: executeLikeAction,
    hasUser: isLiked,
  }

  if (type === 'commentLike') return <p>CommentLike Button is a WIP</p>
  return <HomeSocialButton {...props} />
}
