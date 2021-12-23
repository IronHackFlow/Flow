import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import actions from '../api'
import NavBar from './NavBar'
import search from '../images/search.svg'
import back from '../images/back.svg'
import xExit from "../images/exit-x-2.svg"
import bullet from "../images/bullet-point.svg";

function Search(props) {
  const [suggestions, setSuggestions] = useState(<h4>Find Friends & Artists</h4>)
  const [searchValue, setSearchValue] = useState();
  const history = useHistory();
  const searchInputRef = useRef();

  useEffect(() => {
    if (props.location.searchValue) {
      const value = props.location.searchValue
      searchInputRef.current.focus()
      searchInputRef.current.value = value
      setSearchValue(value)
      grabUsers(value)
    }
  }, [])

  const closeWindow = () => {
    if (history.location.link && history.location.link !== "/search") {
      history.push(history.location.link)
    } else {
      history.push("/")
    }
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
              to={ele.user ? ({
                pathname: `/profile/${ele.user._id}`,
                profileInfo: ele.user
              }) : ({
                pathname: `/SongScreen/${ele.song._id}`,
                songInfo: ele.song,
                link: "/search",
                searchValue: searchInputRef.current.value
              })}
            >
              <div className="result-1_data">
                <div className="data_shadow-div-outset">
                  <div className="search-icon-container">
                    <img className="button-icons" src={search} alt="search icon" />
                  </div>
                  <div className="data-container">
                    <div className="data-1_titles">
                      <p className="data-title">{`${ele.user ? ele.user.userName : ele.song.songName}`}</p>
                      {ele.user ? (
                        <p className="data-type">
                          Artist
                        </p>
                      ) : (
                        <p className="data-type">Song <img src={bullet} alt="bulletpoint" /> {`${ele.song.songUser.userName}`}</p>
                      )}
                    </div>
                    <div className="data-2_caption">
                      <p>{ele.user ? "" : `${ele.song.songCaption ? ele.song.songCaption : ""}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-2_picture">
                <div className="search-prof-inset">
                  <div className="search-prof-outset">
                    <div className="search-results-link">
                      <img className="prof-pic" src={ele.user ? ele.user.picture : ele.song.songUser.picture} alt=""></img>
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

  return (
    <div className="Search">
      <div className="search-inner">
        <div className="section-1_search-field">
          <div className="search-field_shadow-div-outset">
            <form className="search-field-form">
              <div className="search-back-btn-container">
                <button className="search-back-btn" onClick={() => closeWindow()}>
                  <img className="social-icons si-send" src={back} alt="send" />
                </button>
              </div>

              <div className="search-field-input-container">
                <input
                  className="search-field-input"
                  ref={searchInputRef}
                  onChange={listUsers}
                  type="text"
                  style={{width: `${searchValue ? '82%' : '94%'}`}}
                  placeholder="&#xf002; Search for a user"
                ></input>
                {searchValue ? (
                  <button className="search-clear-btn" onClick={(e) => clearSearchField(e)}>
                    <img className="social-icons" src={xExit} alt="clear search" />
                  </button>                
                ) : (
                  <></>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="section-2_search-results">
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
