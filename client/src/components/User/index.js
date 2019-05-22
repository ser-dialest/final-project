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
                <button>Save</button>
                <button>Load</button>
            </div>;
        } else {
            userContents = <div>
                <p>Log in or Sign up to save!</p>
                <br />
                <button>Log In</button>
                <button>Sign Up</button>
                <br />
            </div>
        }
        return (
            <div>
                {userContents}
            </div>
        );
    };
};

export default User;