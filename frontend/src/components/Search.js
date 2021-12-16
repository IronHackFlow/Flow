import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import actions from '../api'
import NavBar from './NavBar'
import search from '../images/search.svg'
import back from '../images/back.svg'
import xExit from "../images/exit-x-2.svg"

function Search(props) {
  const [suggestions, setSuggestions] = useState(<h4>Find Friends & Artists</h4>)
  const [songSuggestions, setSongSuggestions] = useState(<h4>Find A Song</h4>)
  const [searchValue, setSearchValue] = useState();
  const history = useHistory();
  const searchInputRef = useRef();

  const listUsers = e => {
    e.preventDefault()
    setSearchValue(e.target.value)
    if (e.target.value.length > 0) {
      grabUsers(e.target.value)
      // grabSongs(e.target.value)
    } else {
      setSuggestions(<h4>Find Friends & Artists</h4>)
    }
  }

  const closeWindow = () => {
    if (history.location.link && history.location.link !== "/search") {
      history.push(history.location.link)
    } else {
      history.push("/")
    }
  }

  useEffect(() => {
    console.log(history, "what??")
  })

  const clearSearchField = (e) => {
    e.preventDefault()
    searchInputRef.current.value = ""
    setSearchValue("")
    setSuggestions(<h4>Find Friends & Artists</h4>)
  }

  const suggestionBox = info => {
    //render top 1, 2 or 4 suggestions
    console.log(info)
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
      return searchArr.map(ele => {
        console.log(ele)
        return (
          <li className="search-results">
            <div className="search-username-container">
              <p className="comment-username">{`@${ele.user ? ele.user.userName : ele.song.songName}`}</p>
            </div>

            <div className="search-prof-container">
              <div className="search-prof-inset">
                <div className="search-prof-outset">
                  <Link
                    to={{
                      pathname: `/profile/${ele.user ? ele.user._id : ele.song.songUser._id}`,
                      profileInfo: ele.user ? ele.user._id : ele.song.songUser._id,
                    }}
                    className="search-results-link"
                  >
                    <img className="prof-pic" src={ele.user ? ele.user.picture : ele.song.songUser.picture} alt=""></img>
                  </Link>
                </div>
              </div>
            </div>
          </li>
        )
      })
    }
    //this part is for cases where the search returns 2-4
    else {
      return <h4>...thinking</h4>
    }
  }

  const grabUsers = theQuery => {
    actions
      .getManyUsers({ search: theQuery })
      .then(res => {
        console.log(res.data, "this an object? should have songs and users")
        setSuggestions(suggestionBox(res.data))
      })
      .catch(e => {
        console.log(e)
      })
  }



  return (
    <div className="Search">
      <div className="search-inner">
        <div className="search-field-container">
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
        <div className="search-results-container">
          <div className="results-1_recent">
            
          </div>
          <div className="results-2_suggestions">
            <div className="comment-list-container">
              <ul className="com-search">
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
