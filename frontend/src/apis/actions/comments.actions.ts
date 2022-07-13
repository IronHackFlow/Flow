import React from 'react'
import axios from 'axios'
import { axiosConfig } from '../axios/axiosConfig'
import { IComment } from '../../interfaces/IModels'

export const addComment = async (songId: string, text: string) => {
  const payload = { songId: songId, text: text }
  const addComment = await axios(axiosConfig(`/addComment`, payload))
  console.log(addComment, 'ADDCOMMENT AXIOS POST RESPONSE')
  return addComment.data
}

export const editComment = async (
  _songId: string,
  _newText: string,
  _comment: IComment | undefined,
) => {
  if (!_comment) return
  const requestBody = { songId: _songId, newText: _newText, comment: _comment }
  const editComment = await axios(axiosConfig(`/editComment`, requestBody))
  console.log(editComment, 'EDITCOMMENT AXIOS POST RESPONSE')
  return editComment.data
}

export const deleteComment = async (_songId: string, _comment: IComment | undefined) => {
  if (!_comment) return
  const requestBody = { songId: _songId, comment: _comment }
  const deleteComment = await axios(axiosConfig(`/deleteComment`, requestBody))
  console.log(deleteComment, 'DELETECOMMENT AXIOS POST RESPONSE')
  return deleteComment.data
}

export const getComments = async () => {
  const getComments = await axios(axiosConfig(`/getComments/:id`))
  console.log(getComments, 'GETCOMMENTS AXIOS GET RESPONSE')
  return getComments.data
}
