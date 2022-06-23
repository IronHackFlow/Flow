import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'
import { commentIcon } from '../../assets/images/_icons'
import { ISong } from '../../interfaces/IModels'
import { HomeSocialButton } from '../../components/_Buttons/HomeSocialButton'

type Props = {
  song: ISong
  type: string
  // btnStyle: string,
  onClick: Dispatch<SetStateAction<boolean>>
  isPushed: boolean
  // onClose: () => void
}

export default function CommentButtonWrapper({ song, type, onClick, isPushed }: Props) {
  // const { homeFeedSongs, isLoading } = useContext(SongDataContext)
  const comments = song?.comments
  const [hasCommented, setHasCommented] = useState<boolean>(false)
  const [totalComments, setTotalComments] = useState<number>(0)
  const [songs, setSongs] = useState<ISong[]>([])

  useEffect(() => {
    setTotalComments(comments?.length)
  }, [song])

  const executeLikeAction = () => {}

  const props = {
    type: type,
    total: totalComments,
    onClick: onClick,
    hasUser: hasCommented,
  }

  return <HomeSocialButton {...props} />
}
