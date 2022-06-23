import React, { useState, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import {
  useAddFollow,
  useDeleteFollow,
} from '../../hooks/useQueries_REFACTOR/useLikesOrFollows/useFollows'
import { ISong } from '../../interfaces/IModels'
import { checkListForUserId } from '../../utils/Social_REFACTOR/socialFilters'
import { HomeSocialButton } from '../_Buttons/HomeSocialButton'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import usePrevious from '../../hooks/usePrevious'

type FollowProps = {
  song: ISong
  userId: string
  type: string
}

export const useFollowButton = () => {
  const addFollow = useAddFollow()
  const deleteFollow = useDeleteFollow()
  return { addFollow: addFollow, deleteFollow: deleteFollow }
}

export const FollowButtonWrapper = ({ song, userId, type }: FollowProps) => {
  const { user } = useAuth()
  const { addFollow, deleteFollow } = useFollowButton()
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const [totalFollowers, setTotalFollowers] = useState<number>(0)
  const [hasClicked, setHasClicked] = useState<boolean>(false)

  const prevSong: ISong = usePrevious<ISong>(song)
  const prevFollowers: string[] = usePrevious<string[]>(song?.user?.followers)
  const prevTotalFollowers: number = usePrevious<number>(totalFollowers)

  useEffect(() => {
    if (!song || !user) return
    const followers = song.user?.followers

    setIsFollowed(checkListForUserId(user._id, followers))
    setTotalFollowers(followers?.length)
  }, [song])

  useEffect(() => {
    if (hasClicked) {
      handleLikeMutationOnStateChange(
        prevSong,
        hasClicked,
        prevFollowers?.length,
        prevTotalFollowers,
        user?._id,
      )
      setHasClicked(false)
    }
  }, [song])

  const handleLikeMutationOnStateChange = (
    _song: ISong,
    _hasClicked: boolean,
    propFollowers: number,
    stateFollowers: number,
    _userId: string | undefined,
  ) => {
    if (propFollowers === stateFollowers || !_hasClicked || !_userId) {
      return console.log(
        propFollowers,
        stateFollowers,
        _hasClicked,
        'user hasnt added or deleted a follow',
      )
    } else if (propFollowers < stateFollowers) {
      console.log(propFollowers, stateFollowers, 'Adding a follow')
      addFollow.mutate({ id: _song.user._id, song: _song, userId: _userId })
    } else {
      console.log(propFollowers, stateFollowers, 'Deleting a follow')
      deleteFollow.mutate({ id: _song.user._id, song: _song, userId: _userId })
    }
  }

  const executeFollowAction = () => {
    setHasClicked(true)
    if (isFollowed) {
      setIsFollowed(false)
      setTotalFollowers(totalFollowers - 1)
    } else {
      setIsFollowed(true)
      setTotalFollowers(totalFollowers + 1)
    }
  }

  const props = {
    type: type,
    total: totalFollowers,
    onClick: executeFollowAction,
    hasUser: isFollowed,
  }

  return <HomeSocialButton {...props} />
}
