import { useEffect, useState } from 'react'
import {
  SocialButtonSongs,
  SocialButtonHome,
} from 'src/components/_Buttons/SocialButtons/SocialButtons'
import { IWrapperProps, ISocialButtonProps } from './utils'

interface ICommentButtonWrapperProps extends IWrapperProps {
  onClick: any
  isPushed?: boolean
}

export const CommentButtonWrapper = ({
  page,
  song,
  onClick,
  isPushed,
}: ICommentButtonWrapperProps) => {
  const comments = song?.comments
  const [hasCommented, setHasCommented] = useState<boolean>(false)
  const [totalComments, setTotalComments] = useState<number>(0)

  useEffect(() => {
    setTotalComments(comments?.length)
  }, [song])

  const props: ISocialButtonProps = {
    type: 'Comment',
    total: totalComments,
    onClick: onClick,
    hasUser: hasCommented,
  }
  if (page === 'SongScreen') return <SocialButtonSongs {...props} />
  return <SocialButtonHome {...props} />
}
