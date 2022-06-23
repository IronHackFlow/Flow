import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { ISongUpload } from '../../pages/_Record/Record'
import { axiosConfig } from '../client/axiosConfig'
import { ISong } from '../../interfaces/IModels'

export const addSong = async (currentSong: ISongUpload, awsURL: string) => {
  const payload = { currentSong: currentSong, awsURL: awsURL }
  const addSong = await axios(axiosConfig(`/addSong`, payload))
  console.log(addSong, 'ADDSONG AXIOS POST RESPONSE')
  return addSong.data
}

export const deleteSong = async () => {}

export const getSignedS3 = async (fileName: string, fileType: string) => {
  const payload = { fileName: fileName, fileType: fileType }
  const signedS3 = await axios(axiosConfig(`/getSignedS3`, payload))
  console.log(signedS3, 'SIGNEDS3 AXIOS GET RESPONSE')
  return signedS3.data
}

export const putSignedS3 = async (signedURL: string, file: any) => {
  const options = {
    headers: { 'Content-Type': 'audio/mpeg-3' },
  }
  const signedS3 = await axios.put(signedURL, file, options)
  console.log(signedS3, 'SIGNEDS3 AXIOS PUT RESPONSE')
  return signedS3.data
}

export const getUserSongs = async (id: string) => {
  const userSongs = await axios(axiosConfig(`/getUserSongs/${id}`))
  console.log(userSongs, 'GETUSERSONGS AXIOS GET RESPONSE')
  return userSongs.data
}

export const getAllSongs = async (): Promise<ISong[]> => {
  const allSongs = await axios(axiosConfig(`/getAllSongs`))
  console.log(allSongs, 'GETALLSONGS AXIOS GET RESPONSE')
  return allSongs.data
}
