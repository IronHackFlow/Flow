import {
  closeIcon,
  goBackIcon,
  editIcon,
  saveIcon,
  heartIcon,
  followIcon,
  commentIcon,
  homeIcon,
  micIcon,
  searchIcon,
  profileIcon,
  shuffleIcon,
  lockedIcon,
  deleteIcon,
  stopIcon,
} from 'src/assets/images/_icons'
import { BtnColorsEnum } from '../RoundButton/RoundButton'

export enum ButtonTypes {
  Close = 'Close',
  Back = 'Back',
  Edit = 'Edit',
  Save = 'Save',
  Delete = 'Delete',
  Like = 'Like',
  Follow = 'Follow',
  Comment = 'Comment',
  Home = 'Home',
  Record = 'Record',
  Stop = 'Stop',
  Search = 'Search',
  Profile = 'Profile',
  Shuffle = 'Shuffle',
  Locked = 'Locked',
}

const getButtonIcon = (type: ButtonTypes) => {
  switch (type) {
    case 'Close':
      return closeIcon
    case 'Back':
      return goBackIcon
    case 'Edit':
      return editIcon
    case 'Save':
      return saveIcon
    case 'Delete':
      return deleteIcon
    case 'Like':
      return heartIcon
    case 'Follow':
      return followIcon
    case 'Comment':
      return commentIcon
    case 'Home':
      return homeIcon
    case 'Record':
      return micIcon
    case 'Stop':
      return stopIcon
    case 'Search':
      return searchIcon
    case 'Profile':
      return profileIcon
    case 'Shuffle':
      return shuffleIcon
    case 'Locked':
      return lockedIcon
  }
}

type IconOptions = {
  color: 'White' | 'Primary'
  size?: number
  margin?: string
}

export const Icon = ({ type, options }: { type: ButtonTypes; options: IconOptions }) => {
  const size = options?.size ? `${options.size}%` : undefined
  const icon = getButtonIcon(type)
  return (
    <div className="Icon__wrapper">
      <img
        className={`Icon ${options.color}`}
        style={{ height: size, width: size, margin: options?.margin }}
        src={icon}
        alt="icon"
      />
    </div>
  )
}
