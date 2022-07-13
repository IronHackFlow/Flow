import React from 'react'
import axios from 'axios'
import { axiosConfig } from '../axios/axiosConfig'

export const addFollow = async (id: string) => {
  const requestBody = { id: id }
  const addFollow = await axios(axiosConfig(`/addFollow`, requestBody))
  console.log(addFollow, 'ADD FOLLOW AXIOS POST RESPONSE')
  return addFollow.data
}

export const deleteFollow = async (id: string) => {
  const requestBody = { id: id }
  const deleteFollow = await axios(axiosConfig(`/deleteFollow`, requestBody))
  console.log(deleteFollow, 'DELETE FOLLOW AXIOS POST RESPONSE')
  return deleteFollow.data
}
