import React from 'react';
import { GoogleLogin } from 'react-google-login'
import { Link } from 'react-router-dom'
import actions from '../api'
import TheContext from '../TheContext'

const Auth = (props) => {
    const { user } = React.useContext(TheContext)

    const onResponse = (response) => {
        actions
            .logIn(response)
            .then(res => {
                console.log("THIS", props)
                props.setUser(res.data)
                props.history.push('/')
            })
            .catch(console.error)
    }
    
    console.log('ice cream', user)

    return (
        <div className="LogIn">
            <div className="page-container">
                <div className="upper-container">
                    <div className="upper-outset">
                        <div className="upper-inset">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div> 
                <div className="middle-container">
                    <div className="mid-outset">
                        <div className="mid-inset">
                            <div className="login-container">
                                <div className="title-container">
                                    <h1>FLOW</h1>
                                </div>
                                <div className="user-input-container">
                                    <div className="user-input ui-login-i">
                                        <input className="user-text ui-login-t" type="text" placeholder="DO NOT USE"></input>
                                    </div>
                                    <div className="user-input ui-login-i">
                                        <input className="user-text ui-login-t" type="text" placeholder="DO NOT USE"></input>
                                    </div>
                                    <Link to ="/" className="login-link">
                                        <div className="login-button">
                                                <h4>Enter</h4>
                                        </div>
                                    </Link>
                                    <GoogleLogin 
                                            clientId={process.env.REACT_APP_GOOGLEID}
                                            buttonText="Signup"
                                            onSuccess={onResponse}
                                            onFailure={onResponse}
                                            cookiePolicy={"single_host_origin"}
                                            />
                                </div>
                                <div className="bottom-filler-space"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-container">
                    <div className="useless-bars"></div>
                    <div className="useless-bars"></div>
                    <div className="useless-bars"></div>
                </div>
            </div>
        </div>
    );
}

export default Auth