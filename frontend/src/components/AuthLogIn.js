import React from 'react';
import { Link } from 'react-router-dom';

function AuthLogIn(props) {
    
  return (
    <div className="user-login-3_form">
      <form className="login-form">
        <div className="login-input-container email-container">
          <div className="login-input_shadow-div-outset email" style={{borderRadius: "13px 13px 5px 5px"}}>
            <p>Email or Username</p>
            <div className="input-container">
              <input 
                className="login-input-field email-input"
                type="text"
              ></input>
            </div>
          </div>
        </div>
        <div className="login-input-container password-container">
          <div className="login-input_shadow-div-outset password" style={{borderRadius: "5px 5px 13px 13px"}}>
            <p>Password</p>
            <div className="input-container">
              <input className="login-input-field password-input"></input>
            </div>
          </div>
        </div>
        <div className="enter-btn-container">
          <Link 
            to ="/" 
            className="login-link"
          >
            <div className="login-button">
              <h4>Log In</h4>
            </div>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AuthLogIn;
