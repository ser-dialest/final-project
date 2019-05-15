// from ucd-boilerplate
import React, { Component } from "react";
import API from "../utils/API";
// import { Link } from "react-router-dom";

class SignUp extends Component {
    state = {
        username: "",
        password: ""
    };

    componentDidMount() {
        const token = localStorage.getItem("current_user_token");
    
        if (token) {
            API.validateToken(token)
                .then(() => this.props.history.push("/"))
                .catch(() => localStorage.removeItem("current_user_token"));
        };
    };

    onSubmit = () => {
        API.signup(this.state)
            .then(res => localStorage.setItem("current_user_token", res.data.token))
            .catch(err => console.log(err));
    };

    onChange = key => e => this.setState({ [key]: e.target.value });

    render() {
        return (
            <div>
                <h1>Sign up</h1>
                <input
                    type="text"
                    value={this.state.email}
                    label="email"
                    onChange={this.onChange("email")}
                />
                <input
                    type="password"
                    value={this.state.password}
                    label="password"
                    onChange={this.onChange("password")}
                />
                <button
                    onClick={this.onSubmit}
                    disabled={!this.state.email || !this.state.password}
                >
                    signup
                </button>
            </div>
        );
    };
}

export default SignUp;