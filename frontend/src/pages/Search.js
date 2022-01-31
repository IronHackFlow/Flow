import { useContext, useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import actions from '../api'
import TheContext from '../contexts/TheContext'
import useEventListener from '../utils/useEventListener'
import NavBar from '../components/NavBar'
import { searchIcon, goBackIcon, closeIcon, bulletPointIcon } from '../assets/images/_icons'


function Search(props) {
  const { windowSize } = useContext(TheContext);

  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('Search').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('Search').style.height = `${onChange}px`
    }
  })

  const navigation = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState(<h4>Find Friends & Artists</h4>)
  const [searchValue, setSearchValue] = useState();

  const searchInputRef = useRef();

  useEffect(() => {
    if (location?.state?.propSearchValue == null) return
    const value = location.state.propSearchValue
    searchInputRef.current.focus()
    searchInputRef.current.value = value
    setSearchValue(value)
    grabUsers(value)
  }, [])

  const closeWindow = (e) => {
    e.preventDefault()
    // if (history.location.link && history.location.link !== "/search") {
    //   history.push(history.location.link)
    // } else {
    //   history.push("/")
    // }
    navigation("/")
  }

  const clearSearchField = e => {
    e.preventDefault()
    searchInputRef.current.value = ""
    setSearchValue("")
    setSuggestions(<h4>Find Friends & Artists</h4>)
  }

  const listUsers = e => {
    e.preventDefault()
    setSearchValue(e.target.value)
    if (e.target.value.length > 0) {
      grabUsers(e.target.value)
    } else {
      setSuggestions(<h4>Find Friends & Artists</h4>)
    }
  }

  const grabUsers = theQuery => {
    actions
      .getManySongsAndUsers({ search: theQuery })
      .then(res => {
        console.log(res.data, "this an object? should have songs and users")
        setSuggestions(suggestionBox(res.data))
      })
      .catch(e => {
        console.log(e)
      })
  }

  const suggestionBox = info => {
    const searchArr = []

    if (info.songs.length > 0) {
      info.songs.forEach((each) => {
        searchArr.push({ song: each, user: null })
      })
    }
    
    if (info.user.length > 0) {
      info.user.forEach((each) => {
        searchArr.push({ song: null, user: each })
      })
    }

    if (searchArr.length > 0) {
      return searchArr.map((ele, index) => {
        return (
          <li className="suggestions-result-list" key={ele.user ? `${ele.user._id}_${index}` : `${ele.song._id}_${index}`}>
            <Link
              className="result-link-container"
              to={ele.user ? `/profile/${ele.user._id}` : `/SongScreen/${ele.song._id}`}
              state={ele.user ? { propSongUser: ele.user } : { propCurrentSong: ele.song, propSearchValue: searchInputRef.current.value, propReturnLink: '/search' }}
            >
              <div className="result-1_data">
                <div className="data_shadow-div-outset">
                  <div className="search-icon-container">
                    <img className="button-icons" src={searchIcon} alt="search icon" />
                  </div>
                  <div className="data-container">
                    <div className="data-1_titles">
                      <p className="data-title">{`${ele.user ? ele.user.user_name : ele.song.name}`}</p>
                      {ele.user ? (
                        <p className="data-type">
                          Artist
                        </p>
                      ) : (
                        <p className="data-type">Song <img src={bulletPointIcon} alt="bulletpoint" /> {`${ele.song.song_user.user_name}`}</p>
                      )}
                    </div>
                    <div className="data-2_caption">
                      <p>{ele.user ? "" : `${ele.song.caption ? ele.song.caption : ""}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-2_picture">
                <div className="search-prof-inset">
                  <div className="search-prof-outset">
                    <div className="search-results-link">
                      <img className="prof-pic" src={ele.user ? ele.user.picture : ele.song.song_user.picture} alt=""></img>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        )
      })
    } else {
      return <h4>...thinking</h4>
    }
  }
  const preventDefault = (e) => {
    e.preventDefault()
  }

  return (
    <div id="Search" className="Search">
      <div className="search-inner" id="SearchInner">
        <div className="section-1_search-field">
          <div className="search-field_shadow-div-outset">
            <form className="search-field-form" onSubmit={(e) => preventDefault(e)}>
              <div className="search-back-btn-container">
                <button className="search-back-btn" type="button" onClick={(e) => closeWindow(e)}>
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
                  style={{width: `${searchValue ? '82%' : '94%'}`}}
                  placeholder="&#xf002; Search for a user"
                ></input>
                {searchValue ? (
                  <button className="search-clear-btn" type="button" onClick={(e) => clearSearchField(e)}>
                    <img className="social-icons" src={closeIcon} alt="clear search" />
                  </button>                
                ) : (
                  <></>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="section-2_search-results" id="SearchResults">
          <div className="results-1_recent">
          </div>
          <div className="results-2_suggestions">
            <div className="suggestions_shadow-div-inset">
              <ul className="suggestions_shadow-div-outset">
                {suggestions}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}

export default Search
