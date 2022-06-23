import React, { useEffect, useState } from 'react'
import { generateSongArray } from '../../pages/_Home/initialData'
import { ISong } from '../../interfaces/IModels'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
import { ISongUpload } from '../../pages/_Record/Record'
import {
  getSignedS3,
  putSignedS3,
  addSong,
  getUserSongs,
  getAllSongs,
} from '../../apis/actions/songs.actions'

export default function useSongs() {
  const [songs, setSongs] = useState<ISong[]>([])

  useEffect(() => {
    let getSongs = generateSongArray()
    setSongs(getSongs)
  }, [])

  return { songs, setSongs }
}

type SignedS3Params = {
  fileName: string
  fileType: string
  fileBlob: any
}

type AddSong = {
  currentSong: ISongUpload
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
  return useQuery<ISong[], Error>(['user', 'songs', id], () => getUserSongs(id))
}

export const useAllSongs = () => {
  return useQuery<ISong[], Error>(['songs'], getAllSongs)
}
