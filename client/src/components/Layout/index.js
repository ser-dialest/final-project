import React, { Component } from "react";
import Map from "../Map";
import User from "../User";
import Data from "../Data";
import SignUp from "../SignUp";
import "./style.css";
import axios from "axios";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.logInSuccess = this.logInSuccess.bind(this);
        this.hideSignIn = this.hideSignIn.bind(this);
        this.state = {
            loggedIn: false,
            userName: "",
            signingIn: "none",
            createUser: false,
            mapState: {}
        }
    }

    signIn(signUp) {
        this.setState({signingIn: "flex", createUser: signUp})
    }

    logInSuccess(data) {
        // receive user data
        localStorage.setItem("token", data.token);
        this.setState({ loggedIn: true, userName: data.username, signingIn: "none" });
    }

    save() {
        let submission = {};
        submission.state = localStorage.getItem("state");
        submission.token = localStorage.getItem("token");
        let url="api/users/save";
        axios.post( url, submission).then(response => {
            console.log(response);
        })
    }

    load() {
        let submission = {};
        submission.token = localStorage.getItem("token");
        let url="api/users/load";
        axios.post( url, submission).then(response => {
            this.setState({ mapState: response.data}, () => console.log(this.state.mapState));            
        })
    }

    hideSignIn(event) {
        event.preventDefault();
        this.setState({ signingIn: "none" });
    }

    render() {
        return (
            <div id="page">
                <SignUp
                    display={this.state.signingIn}
                    createUser={this.state.createUser}
                    logInSuccess={this.logInSuccess}
                    hide={this.hideSignIn}
                >
                </SignUp>
                <div id="layout">
                    <div className="borders"></div>
                    <div id="map-area">
                        <Map
                            mapState={this.state.mapState}
                        ></Map>
                    </div>
                    <div className="borders"></div>
                    <div className="borders"></div>
                    <div id="info">
                        <User
                            loggedIn={this.state.loggedIn}
                            userName={this.state.userName}
                            signUp={() => this.signIn(true)}
                            logIn={() => this.signIn(false)}
                            save={() => this.save()}
                            load={() => this.load()}
                        ></User>
                        <Data></Data>
                    </div>
                    <div className="borders"></div>
                </div>
            </div>
        )
    }
};

export default Layout;