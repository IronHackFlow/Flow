import { Dispatch, SetStateAction } from 'react'
import { ISong } from 'src/interfaces/IModels'

export interface IWrapperProps {
  page: 'Home' | 'SongScreen'
  song: ISong
}
export interface ISocialButtonProps {
  type: 'Follow' | 'Like' | 'Comment'
  total: number
  onClick: any
  hasUser: boolean
  isPushed?: boolean
}
