import React from 'react'

function Loading(props) {
  
  return (
    <div className="Loading" style={props.isLoading === true ? {display: "flex"} : {display: "none"}}>
      <div className="loading_shadow-div-inset">
        <div className="loading_shadow-div-outset">
          <div className="loading-circle_shadow-div-inset">
            <div className="loading-circle_shadow-div-outset">
              <div className="loading-bubble-container">
                <div className="bubble-traveller"></div>
                <div className="loading-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Loading