import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'
import NavBar from './NavBar'
import search from '../images/search.svg'
import back from '../images/back.svg'
import xExit from "../images/exit-x-2.svg"
import bullet from "../images/bullet-point.svg";

function Search(props) {
  const { windowSize } = React.useContext(TheContext);
  const [suggestions, setSuggestions] = useState(<h4>Find Friends & Artists</h4>)
  const [searchValue, setSearchValue] = useState();
  const navigation = useNavigate();
  const location = useLocation()

  const searchInputRef = useRef();

  useEffect(() => {
    console.log(location, 'fuck this')
    if (location.state !== null) {
      const value = location.state
      searchInputRef.current.focus()
      searchInputRef.current.value = value
      setSearchValue(value)
      grabUsers(value)
    }
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

  useLayoutEffect(() => {
    var onLoad = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById('body').style.height = `${onLoad}px`
    document.getElementById('Search').style.height = `${onLoad}px`

    const changeToPixels = () => {
      var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      if (onChange  <  600) {
        document.getElementById('body').style.height = `${windowSize}px`
        document.getElementById('Search').style.height = `${windowSize}px`
      } 
      else {
        document.getElementById('body').style.height = `${onChange}px`
        document.getElementById('Search').style.height = `${onChange}px`
      }
    }
    window.addEventListener("resize", changeToPixels)
    return () => window.removeEventListener("resize", changeToPixels)
  }, [])

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
              to={ele.user ? `/profile/${ele.user._id}` : `/SongScreen/${ele.song_id}`}
              state={ele.user ? {state: ele.user} : { state: ele.song, searchValue: searchInputRef.current.value, link: "/search" }}
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
  const preventDefault = (e) => {
    e.preventDefault()
  }

  return (
    <div className="Search" id="Search">
      <div className="search-inner" id="SearchInner">
        <div className="section-1_search-field">
          <div className="search-field_shadow-div-outset">
            <form className="search-field-form" onSubmit={(e) => preventDefault(e)}>
              <div className="search-back-btn-container">
                <button className="search-back-btn" type="button" onClick={(e) => closeWindow(e)}>
                  <img className="button-icons" src={back} alt="back" />
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
                    <img className="social-icons" src={xExit} alt="clear search" />
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
