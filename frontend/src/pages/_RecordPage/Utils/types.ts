import { Types } from 'mongoose'
import { ISong } from '../../../../../backend/src/models/Song'

export interface ISongTake extends Omit<ISong, 'comments' | 'likes' | '_id'> {
  _id: string
  blob: Blob | null
}
