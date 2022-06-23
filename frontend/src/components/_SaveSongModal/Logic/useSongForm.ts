import { useState } from 'react'
import { useUploadToAWS, useSaveSong } from '../../../hooks/useQueries_REFACTOR/useSongs'
import { ISongUpload } from '../../../pages/_Record/Record'
import { saveSongSchema } from '../../../utils/validationSchemas'

export const useSongForm = () => {
  const signedS3 = useUploadToAWS()
  const saveSong = useSaveSong()
  const [error, setError] = useState({path: '', message: '', showError: false})

  const handleSaveSong = async (e: any, _song: ISongUpload, _title: any, _caption: any) => {
    e.preventDefault()

    if (_song.blob === '') return setError({ path: '', message: "You haven't yet recorded a Flow", showError: true})
    const title = _title.value.trim()
    const caption = _caption.value.trim()
    const userId = _song.user?._id

    const songToUpload = await validateInputs(_song, title, caption)
    if (!songToUpload) return

    const fileName = userId + title.replaceAll(' ', '-')
    const fileType = 'audio/mpeg-3'
    const fileBlob = songToUpload.blob

    signedS3.mutate({fileName: fileName, fileType: fileType, fileBlob: fileBlob}, {
      onSuccess: (data) => {
        saveSong.mutate({currentSong: songToUpload, awsURL: data.signedRequest.aws_URL})
      }
    })
  }

  const validateInputs = async (_song: ISongUpload, _title: string, _caption: string): Promise<ISongUpload | null> => {
    const songData = { title: _title, caption: _caption }
    let song: ISongUpload | null = null

    await saveSongSchema
      .validate(songData, { abortEarly: false })
      .then(() => {
        song = {..._song, title: _title, caption: _caption}
      })
      .catch(err => {
        setError({ path: err.inner[0].path, message: err.errors[0], showError: true })
      })

    return song
  }

  return { handleSaveSong, error, setError }
}