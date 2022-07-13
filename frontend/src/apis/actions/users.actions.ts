import axios from 'axios'
import { IUser } from '../../interfaces/IModels'
import { axiosConfig } from '../axios/axiosConfig'

export const getAuthUser = async (): Promise<IUser> => {
  const authUser = await axios(axiosConfig(`/getAuthUser`))
  return authUser.data
}
