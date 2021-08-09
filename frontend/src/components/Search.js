import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import actions from "../api";
import send from "../images/send.svg";

function Search(props) {
  const [suggestions, setSuggestions] = useState(
    <h4>Find Friends & Artists</h4>
  );

  const listUsers = (e) => {
    if (e.target.value.length > 0) {
      grabUsers(e.target.value);
    }
    else {
      setSuggestions(<h4>Find Friends & Artists</h4>)
    }
  };

  const suggestionBox = (info) => {
    //render top 1, 2 or 4 suggestions
    const mappedRes = info.data.map((ele) => {
        return { userName: ele.userName, picture: ele.picture, profile: ele};
      });

    if (mappedRes.length === 1) {
      return mappedRes.map((ele) => {
       console.log(ele)
        return (
          <div className="search-results">
            <div className="search-username-container">
              <p className="comment-username">{`@${ele.userName}`}</p>
            </div>

            <div className="search-prof-container">
              <div className="search-prof-inset">
                <div className="search-prof-outset">
                  <Link to={{pathname:`/profile/${ele.profile._id}`, profileInfo: ele.profile}} className="search-results-link">
                    <img className="prof-pic" src={ele.picture} alt=""></img>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    //this part is for cases where the search returns 2-4
    else {
      return <h4>...thinking</h4>;
    }
  };

  const grabUsers = (theQuery) => {
    actions
      .getManyUsers({ search: theQuery })
      .then((res) => {
        console.log(res)
        setSuggestions(suggestionBox(res));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="comment-pop-out" ref={props.popUpSearchRef}>
      <div className="inner-com">
        <div className="com-cont-1">
          <form className="social-comment-form">
            <input 
              className="social-comment-input"
              ref={props.searchInputRef}
              onChange={listUsers}
              type='text' 
              placeholder='Search for a user' 
              >
            </input>
            <button className="comment-button" ref={props.searchButtonRef}>
              <img className="social-icons si-send" src={send} alt="send" />
            </button>
          </form>
        </div>

        <div className="com-cont-2">
          <div className="comments-container">
            <div className="comment-list-container com-list-cont">
              <div className="com-list-search">
                <div className="com-search">
                  {suggestions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;