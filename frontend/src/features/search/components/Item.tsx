import { ISong } from '../../../../../backend/src/models/Song'
import { IUser } from '../../../../../backend/src/models/User'
import { searchIcon } from 'src/assets/images/_icons'
import { UserPhoto } from 'src/components/UserPhoto/UserPhoto'

type Id = IUser['_id'] | ISong['_id']

type SearchItemProps = {
  id: Id
  type: string
  index: number
  onClick: (id: Id, type: string) => void
  artist: IUser
  song?: ISong
}

const ArtistData = ({ artist }: { artist: IUser }) => {
  return (
    <div className="data-container">
      <div className="data-1_titles">
        <p className="data-title">{artist.username}</p>

        <p className="data-type">Artist</p>
      </div>
      <div className="data-2_caption">
        <p>{artist.email}</p>
      </div>
    </div>
  )
}

const SongData = ({ song }: { song: ISong }) => {
  return (
    <div className="data-container">
      <div className="data-1_titles">
        <p className="data-title">{song.title}</p>

        <p className="data-type">
          Song {String.fromCodePoint(8226)} {song.user.username}
        </p>
      </div>
      <div className="data-2_caption">
        <p>{song.caption}</p>
      </div>
    </div>
  )
}
export const SearchItem = ({ id, type, index, artist, song, onClick }: SearchItemProps) => {
  return (
    <li className="suggestions-result-list" key={`${id}_${index}`}>
      <button className="result-link-container" onClick={() => onClick(id, type)}>
        <div className="result-1_data">
          <div className="data_shadow-div-outset">
            <div className="search-icon-container">
              <img className="button-icons" src={searchIcon} alt="search icon" />
            </div>
            {song ? <SongData song={song} /> : <ArtistData artist={artist} />}
          </div>
        </div>

        <div className="result-2_picture">
          <div className="search-prof-inset">
            <div className="search-prof-outset">
              <div className="search-results-link">
                <div className="prof-pic">
                  <UserPhoto photoUrl={artist.picture} username={artist.username} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </li>
  )
}

type SearchListProps = {
  users: IUser[]
  songs: ISong[]
  onClick: (id: string, type: string) => void
}

export const SearchList = ({ users, songs, onClick }: SearchListProps) => {
  return (
    <ul className="suggestions_shadow-div-outset">
      {users &&
        users.map((user, index) => {
          return (
            <SearchItem id={user._id} type="artist" index={index} artist={user} onClick={onClick} />
          )
        })}
      {songs &&
        songs.map((song, index) => {
          return (
            <SearchItem
              id={song._id}
              type="song"
              index={index}
              artist={song.user}
              song={song}
              onClick={onClick}
            />
          )
        })}
    </ul>
  )
}
