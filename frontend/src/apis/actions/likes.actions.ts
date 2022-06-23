import React from 'react'
import axios from 'axios'
import { axiosConfig } from '../client/axiosConfig'

export const addLike = async (id: string, type: string) => {
  const requestBody = { id: id, type: type }
  const addLike = await axios(axiosConfig(`/addLike`, requestBody))
  console.log(addLike, 'ADD LIKE AXIOS POST RESPONSE')
  return addLike.data
}

export const deleteLike = async (id: string, type: string) => {
  const requestBody = { id: id, type: type }
  const deleteLike = await axios(axiosConfig(`/deleteLike`, requestBody))
  console.log(deleteLike, 'DELETE LIKE AXIOS POST RESPONSE')
  return deleteLike.data
}

// export const editComment = async (payload: any) => {
//   const editComment = await axios(axiosConfig(`/editComment`, payload))
//   console.log(editComment, 'EDITCOMMENT AXIOS POST RESPONSE')
//   return editComment.data
// }

// export const getComments = async () => {
//   const getComments = await axios(axiosConfig(`/getComments/:id`))
//   console.log(getComments, 'GETCOMMENTS AXIOS GET RESPONSE')
//   return getComments.data
// }
