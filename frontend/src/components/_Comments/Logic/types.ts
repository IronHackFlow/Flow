// import { IComment } from '../../../interfaces/IModels'
import { IComment } from '../../../../../backend/src/models/Comment'

export enum CommentActions {
  Comment = 'Comment',
  Edit = 'Edit',
  Reply = 'Reply',
  Like = 'Like',
  Delete = 'Delete',
  Hide = '',
}

export interface ITextModalObject {
  inputType: string
  songId: string
  comment: IComment | undefined
  isEditing: string
}
