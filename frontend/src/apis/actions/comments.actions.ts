import React from 'react'
import axios from 'axios'
import { axiosConfig } from '../client/axiosConfig'

export const addComment = async (songId: string, text: string) => {
  const payload = { songId: songId, text: text }
  const addComment = await axios(axiosConfig(`/addComment`, payload))
  console.log(addComment, 'ADDCOMMENT AXIOS POST RESPONSE')
  return addComment.data
}

export const editComment = async (payload: any) => {
  const editComment = await axios(axiosConfig(`/editComment`, payload))
  console.log(editComment, 'EDITCOMMENT AXIOS POST RESPONSE')
  return editComment.data
}

export const deleteComment = async (payload: any) => {
  const deleteComment = await axios(axiosConfig(`/deleteComment`, payload))
  console.log(deleteComment, 'DELETECOMMENT AXIOS POST RESPONSE')
  return deleteComment.data
}

export const getComments = async () => {
  const getComments = await axios(axiosConfig(`/getComments/:id`))
  console.log(getComments, 'GETCOMMENTS AXIOS GET RESPONSE')
  return getComments.data
}
