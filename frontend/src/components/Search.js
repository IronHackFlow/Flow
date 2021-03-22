import React, { useRef, useState, useEffect } from "react";
import actions from "../api";
import { Link } from "react-router-dom";
import TheContext from '../TheContext'

function Search(props) {
 const { user, setUser, userViewed, setUserViewed } = React.useContext(
    TheContext
  );


  const searchRef = useRef();
  const [suggestions, setSuggestions] = useState(
    <h4>Find Friends & Artists</h4>
  );

  useEffect(() => {});


  const listUsers = (e) => {
    if (e.target.value.length > 0) {
      grabUsers(e.target.value);
    }else{
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
                  <Link to={{pathname:`/profile/other/${ele.profile._id}`, profileInfo: ele.profile}} className="search-results-link">
                    <img className="prof-pic" src={ele.picture} alt=""></img>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      });       ///this part is for cases where the search returns 2-4
    }else {
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
    <div className="inner-com">

      <div className="com-cont-1">
        <div className="input-container">
          <div className="input-inset">
            <form className="social-comment-form">
              <input onChange={listUsers}
                    className="social-comment-input"
                    ref={props.dumbSearch}
                    style={{opacity: '0'}}
                    type='text' 
                    placeholder='Search' 
                    ></input>
            </form>
          </div>
        </div>
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
  );
}

export default Search;

// <>
// <div className="input-container">
//     <div className="input-inset">
//         <form className="social-comment-form">
//             <input onChange={listUsers}
//                 className="social-comment-input" 
//                 type='text' 
//                 placeholder='       Search' 
//                 ></input>
//         </form>
//     </div>
// </div>
// <div className="comments-container">
// <div className="comment-list-container">

//     {suggestions}

// </div>
// </div>
// </>
// {suggestions}

