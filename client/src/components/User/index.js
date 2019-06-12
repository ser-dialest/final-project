import React from "react";
import "./style.css";

function User(props) {
    if (props.loggedIn){
        return (
            <div id="user">
                <p>HP: {props.playerHP}/{props.maxHP} Level: 1</p>
                <p>Welcome, {props.userName}!</p>
                <button onClick={props.save}>Save</button>
                <button onClick={props.load}>Load</button>
            </div>
        )
    } else {
        return (
            <div id="user">
                <p>HP: {props.playerHP}/{props.maxHP} Level: 1</p>
                <p>Log in or Sign up to save!</p>
                <button onClick={props.logIn}>Log In</button>
                <button onClick={props.signUp}>Sign Up</button>
                <br />
            </div>
        )
    }
};

export default User;