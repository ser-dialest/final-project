import React, { Component } from "react";
import axios from "axios";
import "./style.css";

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        confirm: ""
    }
    
    handleChange = event => this.setState({[event.target.name]: event.target.value});

    handleFormSubmit = event => {
        event.preventDefault();
        let submission = {}
        submission.username = this.state.username;
        if (this.props.createUser) {submission.email = this.state.email};
        submission.password = this.state.password;
        let url="api/users/";
        this.props.createUser ? url +="signup" : url += "login";
        
        axios.post(url, submission).then(response => console.log(response));
    }

    render() {
        let contents = [];
        contents.push(
            <input
                name="username"
                key="username"
                type="text"
                placeholder="Enter your username*"
                value={this.state.username} onChange={this.handleChange}
            />
        );
        if (this.props.createUser) {
            contents.push(
                <input
                    name="email"
                    key="email"
                    type="text"
                    placeholder="Enter your e-mail address"
                    value={this.state.email} onChange={this.handleChange}
                />
            );   
        };
        contents.push(
            <input
                name="password"
                key="password"
                type="password"
                placeholder="Enter your password*"
                value={this.state.password} onChange={this.handleChange}
            />
        );
        if (this.props.createUser) {
            contents.push(
                <input
                    name="confirm"
                    key="confirm"
                    type="password"
                    placeholder="Re-type your password"
                    value={this.state.confirm} onChange={this.handleChange}
                />
            );
        };
        contents.push(<button onClick={this.handleFormSubmit} key="Submit">Submit</button>);
        return (
            <form
                id="sign-in"
                style={{display: this.props.display}}
            >
                {contents}
            </form>
        );
    }
}

export default SignUp;

// function loginSubmit () {
//     // What happens when you submit log in
//     $("#login_submit").on("click", function(event) {
//         event.preventDefault();
//         // Create object from user input (name password)
//         var login = {
//             name: $("#user_name_login")
//                 .val()
//                 .trim(),
//             password: $("#password_login")
//                 .val()
//                 .trim()
//         };
//         // User GET with that object based on object.name
//         API.getUser(login.name);
//         if (login.password === loginCheck.password) {
//             localStorage.setItem("userId", login.id);
//             alert("Welcome, " + login.name + "!");
//         } else {
//             alert("Username or password did not match.");
//         }
//         // GET fridge based on id
//         // Set all the ingredients to their fridge values
//     });