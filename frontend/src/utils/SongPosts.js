import { useContext } from 'react'
import actions from '../api'
import { SongDataContext } from '../contexts/SongData'
import TheContext from '../contexts/TheContext'

export default function SongPosts() {
  const { user } = useContext(TheContext)
  const { homeFeedSongs, setHomeFeedSongs } = useContext(SongDataContext)

  const addSong = () => {}

  const deleteSong = () => {}

  const updateSong = async (songId, name, caption) => {
    if (songId == null || name == null || caption == null) return

    await actions
      .updateSong({ songId: songId, name: name, caption: caption })
      .then(res => {
        const updatedSong = res.data
        console.log(`UPDATED a SONG's NAME to---`, res.data.name)

        let updateFeed = homeFeedSongs.map(songs => {
          if (songs.song._id === songId) return { ...songs, song: updatedSong }
          else return songs
        })
        setHomeFeedSongs(updateFeed)
      })
      .catch(err => console.log(err))
  }

  return {
    addSong,
    deleteSong,
    updateSong,
  }
}
