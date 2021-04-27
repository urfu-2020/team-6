import React from "react";
import "./LoginButton.css"

const routeChange = () => {
    console.log(process.env);
    window.location = process.env.REACT_APP_LOGIN_REDIRECT_CLIENT ?? "/login";
};

function LoginButton() {
 return <button className="LoginButton" onClick={routeChange}>Login</button>
}

export default LoginButton;