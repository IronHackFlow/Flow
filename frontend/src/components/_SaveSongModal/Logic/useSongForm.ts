import { useState } from 'react'
import axios from 'axios'
import { useUploadToAWS, useSaveSong } from '../../../hooks/useQueries_REFACTOR/useSongs'
import { ISongTake } from 'src/pages/_RecordPage/Utils/types'
import { saveSongSchema } from '../../../utils/validationSchemas'
import { trpc } from 'src/utils/trpc'

export const useSongForm = () => {
  const upload = trpc.useMutation(['songs.upload-song'])
  const createSong = trpc.useMutation(['songs.create-song'])
  const [error, setError] = useState({ path: '', message: '', showError: false })

  const handleSaveSong = async (e: any, _song: ISongTake, _title: any, _caption: any) => {
    e.preventDefault()

    if (_song.blob == null)
      return setError({ path: '', message: "You haven't yet recorded a Flow", showError: true })
    const title = _title.value.trim()
    const caption = _caption.value.trim()
    const userId = _song.user._id

    const songToUpload = await validateInputs({ ..._song }, title, caption)
    if (!songToUpload) return

    const fileName = userId + title.replaceAll(' ', '-')
    const fileType = 'audio/mpeg-3'
    const fileBlob = songToUpload.blob

    upload.mutate(
      { fileName: fileName, fileType: fileType },
      {
        onSuccess: async data => {
          await axios.put(data.signedUrl, fileBlob, data.options)
          console.log(songToUpload, data.url, 'these values need to be valid')
          createSong.mutate({ ...songToUpload, audio: data.url })
        },
      },
    )
    // signedS3.mutate(
    //   { fileName: fileName, fileType: fileType, fileBlob: fileBlob },
    //   {
    //     onSuccess: data => {
    //       saveSong.mutate({ currentSong: songToUpload, awsURL: data.signedRequest.aws_URL })
    //     },
    //   },
    // )
  }

  const validateInputs = async (
    _song: ISongTake,
    _title: string,
    _caption: string,
  ): Promise<ISongTake | null> => {
    const songData = { title: _title, caption: _caption }
    let song: ISongTake | null = null

    await saveSongSchema
      .validate(songData, { abortEarly: false })
      .then(() => {
        song = { ..._song, title: _title, caption: _caption }
      })
      .catch(err => {
        setError({ path: err.inner[0].path, message: err.errors[0], showError: true })
      })

    return song
  }

  return { handleSaveSong, error, setError }
}
