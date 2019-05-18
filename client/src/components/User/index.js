import React from "react";
import "./style.css";

function User(props) {
    return (
        <div>
            <p>Log in or Sign up to save!</p>
            <p><span>Log In</span><span>Sign Up</span></p>
            <br />
            <p>Hello, User! (if logged in)</p>
            <p><span>Save</span><span>Load</span></p>            
        </div>
    );
};

export default User;