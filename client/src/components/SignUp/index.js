import React, { Component } from "react";
import "./style.css";
import axios from "axios";

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        confirm: "",
        usernameLabel: "Username:",
        emailLabel: "E-mail Address:",
        passwordLabel: "Password:",
        confirmLabel: "Confirm password:"
    }
    
    handleChange = event => this.setState({[event.target.name]: event.target.value});

    handleFormSubmit = event => {
        event.preventDefault();
        let submission = {}
        submission.username = this.state.username;
        if (this.props.createUser)  { submission.email = this.state.email };
        submission.password = this.state.password;
        let url="api/users/";
        this.props.createUser ? url +="signup" : url += "login";

        let usernameValid = true;
        let emailValid = true;
        let passwordVaild = true;
        let confirmValid = true;

        if (submission.username) { 
            this.setState({ usernameLabel: "Username:"});
        } else {
            usernameValid = false;
            this.setState({ usernameLabel: "Please enter a username."});
        }

        if (submission.email) {
            let emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailRegex.test(String(submission.email).toLowerCase())) { 
                emailValid = false;
                this.setState({ emailLabel: "Please enter a valid e-mail address."});
            } else {
                this.setState({ emailLabel: "E-mail Address:"});
            };
        };
        if (this.props.createUser) {
            let passwordRegex = RegExp(/^(?=.{8,})(?=.*[0-9])(?=.*[A-Za-z])/);
            if (!passwordRegex.test(String(submission.password))) { 
                passwordVaild = false;
                this.setState({ passwordLabel: "Password must include letters and numbers and be at least eight characters long."});
            } else {
                this.setState({ passwordLabel: "Password:" });
            };
            if (submission.password !== this.state.confirm) {
                this.setState({ confirmLabel: "Must match password." });
            } else {
                this.setState({ confirmLabel: "Confirm password:" });
            };
        };

        if (usernameValid && emailValid && passwordVaild && confirmValid) {
            axios.post(url, submission).then(response => { 
                this.props.logInSuccess(response.data.username);
            }).catch(() => {
                this.setState({ usernameLabel: "Username or password incorrect.", passwordLabel: "Username or password incorrect."});
            });
        };
    }

    render() {
        let contents = [];
        contents.push(
            <label key="usernameLabel" htmlFor="username">
                {this.state.usernameLabel}
            </label>
        );
        contents.push(
            <input
                name="username"
                key="username"
                type="text"
                value={this.state.username} onChange={this.handleChange}
            />
        );
        if (this.props.createUser) {
            contents.push(
                <label key="emailLabel" htmlFor="email">
                    {this.state.emailLabel}
                </label>
            );
            contents.push(
                <input
                    name="email"
                    key="email"
                    type="text"
                    value={this.state.email} onChange={this.handleChange}
                />
            );   
        };
        contents.push(
            <label key="passwordLabel" htmlFor="password">
                {this.state.passwordLabel}
            </label>
        );
        contents.push(
            <input
                name="password"
                key="password"
                type="password"
                value={this.state.password} onChange={this.handleChange}
            />
        );
        if (this.props.createUser) {
            contents.push(
                <label key="confirmLabel" htmlFor="confirm">
                    {this.state.confirmLabel}
                </label>
            );
            contents.push(
                <input
                    name="confirm"
                    key="confirm"
                    type="password"
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

// Load name upon login or signup
// Hide button






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