import React from "react";
import Map from "../Map";
import User from "../User";
import Data from "../Data";
import "./style.css";

function Layout(props) {
    return (
        <div id="layout">
            <div className="borders"></div>
            <div id="map-area">
                <Map></Map>
            </div>
            <div className="borders"></div>
            <div className="borders"></div>
            <div id="info">
                <User></User>
                <Data></Data>
            </div>
            <div className="borders"></div>
        </div>
    )

};

export default Layout;