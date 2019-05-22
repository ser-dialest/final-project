import React, { Component } from "react";
import "./style.css";

class User extends Component {
    state = {
        loggedIn: true,
        userName: "Jeffrey"
    }



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

    render() {
        let userContents;
        if (this.state.loggedIn){
            userContents = <div>
                <p>Welcome, {this.state.userName}!</p>
                <br />
                <button onClick={() => this.save()}>Save</button>
                <button onClick={() => this.load()}>Load</button>
            </div>;
        } else {
            userContents = <div>
                <p>Log in or Sign up to save!</p>
                <br />
                <button onClick={() => this.logIn()}>Log In</button>
                <button onClick={() => this.signUp()}>Sign Up</button>
                <br />
            </div>

            // We're going to define all the above functions in the Layout.
            // Convert this compnent to functional
            // signup & login become logIn(new) and logIn(return)
            // sa ve and load stay passed in
            // user name and loggedIn become props passed from Layout
            // Layout becomes class extension with a signup component that appears conditionally
        }
        return (
            <div>
                {userContents}
            </div>
        );
    };
};

export default User;