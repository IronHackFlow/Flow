import React from 'react'
import axios, { AxiosResponse } from 'axios'
import { ISongTake } from 'src/pages/_RecordPage/Utils/types'
import { axiosConfig } from '../axios/axiosConfig'
import { ISong } from '../../../../backend/src/models/Song'

export const addSong = async (currentSong: ISongTake, awsURL: string) => {
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

export const getSongVideo = async () => {
  const headers = new Headers()

  const key = process.env.REACT_APP_IMVDB_KEY
  if (!key) return
  headers.append('IMVDB-APP-KEY', key)

  const options = {
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',

      'Access-Control-Allow-Headers': 'X-Requested-With, content-type',
      'IMVDB-APP-KEY': key,
    },
  }
  const video = await axios.get(`https://imvdb.com/api/v1/video/121779770452`, options)
  console.log(video.data, 'GETVIDEO AXIOS GET RESPONSE')
  return video.data
}
// export const getSongVideo = async () => {
//   const video = await axios.get(
//     `http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_KEY}&limit=10`,
//   )
//   console.log(video.data, 'GETVIDEO AXIOS GET RESPONSE')
//   return video.data.data
// }
