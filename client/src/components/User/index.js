import React from "react";
import "./style.css";

function User(props) {
    if (props.loggedIn){
        return (
            <div>
                <p>Welcome, {props.userName}!</p>
                <br />
                <button onClick={props.save}>Save</button>
                <button onClick={props.load}>Load</button>
            </div>
        )
    } else {
        return (
            <div>
                <p>Log in or Sign up to save!</p>
                <br />
                <button onClick={props.logIn}>Log In</button>
                <button onClick={props.signUp}>Sign Up</button>
                <br />
            </div>
        )
    }
};

export default User;