import React from "react";
import "./style.css";

function SignUp(props) {
    let contents = [];
    contents.push(
        <input
            name="username"
            placeholder="Enter your username*"
        />
    );
    if (props.createUser) {
        contents.push(
            <input
                name="email"
                placeholder="Enter your e-mail address"
            />
        );   
    }
    contents.push(
        <input
            name="password"
            placeholder="Enter your password*"
        />
    );
    if (props.createUser) {
        contents.push(
            <input
                name="confirm"
                placeholder="Re-type your e-mail address"
            />
        );
    }
    return (
        <form
            id="sign-in"
            style={{display: props.display}}
        >
            {contents}
        </form>
    );
}

export default SignUp;
