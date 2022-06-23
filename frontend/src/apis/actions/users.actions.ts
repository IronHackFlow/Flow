import React from 'react'
import axios from 'axios'
import { IUser } from '../../interfaces/IModels'
import { axiosConfig } from '../client/axiosConfig'

// const baseURL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://iron-flow.herokuapp.com/api'
//     : 'http://localhost:5000/api'

// const token = localStorage.getItem('token')

// const headers = {
//   headers: { Authorization: `Bearer ${token}`}
// }
export const getAuthUser = async (): Promise<IUser> => {
  const authUser = await axios(axiosConfig(`/getAuthUser`))
  return authUser.data
}