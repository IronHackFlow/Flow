import { IComment } from '../../../interfaces/IModels'

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
