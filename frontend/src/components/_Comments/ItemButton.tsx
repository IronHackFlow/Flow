import { deleteIcon, commentIcon, thumbsUpIcon, editIcon } from '../../assets/images/_icons'

type ItemButtonProps = {
  type: string
  onClick: () => void
  total?: number
  isLiked?: boolean
}

const ItemButton = ({ type, onClick, total, isLiked }: ItemButtonProps) => {
  return (
    <button
      className={`comments__btn ${type} ${isLiked ? 'isLiked' : ''}`}
      style={type === 'Like' ? { borderRadius: '40px 3px 3px 40px' } : {}}
      onClick={() => onClick()}
    >
      <div className={`comments__btn-icon ${type}`}>
        <img
          className={`social-icons ${type}`}
          alt={`${type} icon`}
          src={
            type === 'Like'
              ? thumbsUpIcon
              : type === 'Reply'
              ? commentIcon
              : type === 'Delete'
              ? deleteIcon
              : editIcon
          }
        />
      </div>
      <div className="comments__btn-text--container">
        <p className={`comments__btn-text ${type}`}>
          {type === 'Like' || type === 'Reply' ? total : type}
        </p>
      </div>
    </button>
  )
}
export default ItemButton
