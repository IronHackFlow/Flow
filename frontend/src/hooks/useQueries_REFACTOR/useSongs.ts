import React, { useEffect, useState } from 'react'
// import { ISong } from '../../interfaces/IModels'
import { ISong } from '../../../../backend/src/models/Song'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
import { ISongTake } from 'src/pages/_RecordPage/Utils/types'
import {
  getSignedS3,
  putSignedS3,
  addSong,
  getUserSongs,
  getAllSongs,
} from '../../apis/actions/songs.actions'
import useAxiosPrivate from 'src/apis/axios/useAxiosPrivate'

type SignedS3Params = {
  fileName: string
  fileType: string
  fileBlob: any
}

type AddSong = {
  currentSong: ISongTake
  awsURL: string
}

export const useUploadToAWS = () => {
  return useMutation(
    ['signedS3'],
    ({ fileName, fileType, fileBlob }: SignedS3Params) => getSignedS3(fileName, fileType),
    {
      onSuccess: async (data, fileBlob) => {
        const signedURL = data.signedRequest.signed_URL
        const file = fileBlob.fileBlob
        await putSignedS3(signedURL, file)
      },
    },
  )
}

export const useSaveSong = () => {
  return useMutation(['song'], ({ currentSong, awsURL }: AddSong) => addSong(currentSong, awsURL))
}

export const useUserSongs = (id: string) => {
  const axiosPrivate = useAxiosPrivate()
  const getUserSongs = async (id: string) => {
    const songs = await axiosPrivate.get(`/getUserSongs/${id}`)
    return songs.data
  }
  return useQuery<ISong[], Error>(['user', 'songs', id], () => getUserSongs(id))
}

export const useAllSongs = () => {
  // return useQuery<ISong[], Error>(['songs'], getAllSongs)
}
