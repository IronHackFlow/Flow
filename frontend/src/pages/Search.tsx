import { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import actions from '../api'
import Navbar from '../components/_Navbar/Navbar'
import ButtonClearText from '../components/ButtonClearText'
import useHandleOSK from '../hooks/useMobileKeyboardHandler'
import { ISong, IUser } from '../interfaces/IModels'
import { searchIcon, goBackIcon } from '../assets/images/_icons'

type LocationPropTypes = {
  returnValue: string
}

function Search() {
  const { handleOnFocus } = useHandleOSK()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationPropTypes
  const { returnValue } = state
  const [suggestions, setSuggestions] = useState<React.ReactNode>(<h4>Find Friends & Artists</h4>)
  const [searchValue, setSearchValue] = useState<string>()

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (returnValue == null || !searchInputRef.current) return
    searchInputRef.current.focus()
    searchInputRef.current.value = returnValue
    setSearchValue(returnValue)
    grabUsers(returnValue)
  }, [])

  const clearSearchField = useCallback(val => {
    if (val === '' && searchInputRef.current) {
      searchInputRef.current.value = ''
      setSearchValue('')
      setSuggestions(<h4>Find Friends & Artists</h4>)
    }
  }, [])

  const listUsers = useCallback(
    e => {
      e.preventDefault()
      setSearchValue(e.target.value)
      if (e.target.value.length > 0) {
        grabUsers(e.target.value)
      } else {
        setSuggestions(<h4>Find Friends & Artists</h4>)
      }
    },
    [searchValue],
  )

  const grabUsers = (theQuery: string) => {
    actions
      .searchUsersAndSongs({ search: theQuery })
      .then(res => {
        console.log(res.data, 'this an object? should have songs and users')
        setSuggestions(suggestionBox(res.data))
      })
      .catch(e => {
        console.log(e)
      })
  }

  const itemOnClickHandler = (data: { song: ISong | null; user: IUser | null }) => {
    if (!searchInputRef.current) return
    if (data.user) navigate(`/profile/${data.user._id}`, { state: { propSongUser: data.user } })
    else
      navigate(`/songScreen/${data.song?._id}`, {
        state: { currentSong: data.song, returnValue: searchInputRef.current.value },
      })
  }

  const suggestionBox = (info: { songs: ISong[]; user: IUser[] }): React.ReactNode => {
    const searchArr: Array<{ song: ISong | null; user: IUser | null }> = []

    if (info.songs.length > 0) {
      info.songs.forEach(each => {
        searchArr.push({ song: each, user: null })
      })
    }

    if (info.user.length > 0) {
      info.user.forEach(each => {
        searchArr.push({ song: null, user: each })
      })
    }

    if (searchArr.length > 0) {
      return searchArr.map((ele, index) => {
        return (
          <li
            className="suggestions-result-list"
            key={ele.user ? `${ele.user?._id}_${index}` : `${ele.song?._id}_${index}`}
          >
            <button className="result-link-container" onClick={() => itemOnClickHandler(ele)}>
              <div className="result-1_data">
                <div className="data_shadow-div-outset">
                  <div className="search-icon-container">
                    <img className="button-icons" src={searchIcon} alt="search icon" />
                  </div>
                  <div className="data-container">
                    <div className="data-1_titles">
                      <p className="data-title">{`${
                        ele.user ? ele.user.username : ele.song?.title
                      }`}</p>
                      {ele.user ? (
                        <p className="data-type">Artist</p>
                      ) : (
                        <p className="data-type">
                          Song {String.fromCodePoint(8226)} {ele.song?.user.username}
                        </p>
                      )}
                    </div>
                    <div className="data-2_caption">
                      <p>{ele.user ? '' : `${ele.song?.caption ? ele.song?.caption : ''}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-2_picture">
                <div className="search-prof-inset">
                  <div className="search-prof-outset">
                    <div className="search-results-link">
                      <img
                        className="prof-pic"
                        src={ele.user ? ele.user.picture : ele.song?.user.picture}
                        alt=""
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
        )
      })
    } else {
      return <h4>...thinking</h4>
    }
  }
  const onClose = () => {
    if (returnValue) navigate('/')
    else navigate(-1)
  }
  return (
    <div id="Search" className="Search">
      <div className="search-inner" id="SearchInner">
        <div className="section-1_search-field">
          <div className="search-field_shadow-div-outset">
            <form className="search-field-form" onSubmit={e => e.preventDefault()}>
              <div className="search-back-btn-container">
                <button className="search-back-btn" type="button" onClick={() => onClose()}>
                  <img className="button-icons" src={goBackIcon} alt="back" />
                </button>
              </div>

              <div className="search-field-input-container">
                <input
                  className="search-field-input"
                  ref={searchInputRef}
                  onChange={listUsers}
                  type="text"
                  inputMode="search"
                  style={{ marginRight: `${searchValue ? '0%' : '2%'}` }}
                  placeholder="&#xf002; Search for a user"
                  onFocus={() => handleOnFocus()}
                />
                {/* <ButtonClearText
                  inset={true}
                  shadowColors={['#525252', '#c7c7c7', '#525252', '#c7c7c7']}
                  // inputRef={searchInputRef}
                  value={searchValue}
                  setValue={clearSearchField}
                /> */}
              </div>
            </form>
          </div>
        </div>

        <div className="section-2_search-results" id="SearchResults">
          <div className="results-1_recent"></div>
          <div className="results-2_suggestions">
            <div className="suggestions_shadow-div-inset">
              <ul className="suggestions_shadow-div-outset">{suggestions}</ul>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Search
