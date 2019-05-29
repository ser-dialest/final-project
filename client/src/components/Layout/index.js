import React, { Component } from "react";
import Map from "../Map";
import User from "../User";
import Data from "../Data";
import SignUp from "../SignUp";
import "./style.css";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.logInSuccess = this.logInSuccess.bind(this);
        this.hideSignIn = this.hideSignIn.bind(this);
        this.state = {
            loggedIn: false,
            userName: "",
            signingIn: "none",
            createUser: false
        }
    }

    signIn(signUp) {
        console.log("sign up", signUp);
        this.setState({signingIn: "flex", createUser: signUp})
    }

    logInSuccess(username) {
        this.setState({ loggedIn: true, userName: username, signingIn: "none" });
    }

    save() {
        alert("save");
        // I don't know yet
    }

    load() {
        alert("load");
        // Also don't know
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
                        <Map></Map>
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


// var API = {
//     // User calls
//     createUser: function(userObj) {
//       return $.ajax({
//         type: "POST",
//         url: "/api/user",
//         data: userObj,
//         success: function(response) {
//           localStorage.clear();
//           localStorage.setItem("userId", response.id);
//           localUser.id = localStorage.getItem("userId");
//           console.log(localUser.id);
//         }
//       });
//     },
//     getUser: function(userName) {
//       return $.ajax({
//         url: "/api/user/" + userName,
//         type: "GET",
//         success: function(res) {
//           loginCheck.id = res.id;
//           loginCheck.password = res.password;
//           console.log(res);
//         }
//       });
//     },