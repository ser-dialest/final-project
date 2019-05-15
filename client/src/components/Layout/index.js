import React from "react";
import Map from "../Map";
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
            <div id="info"></div>
            <div className="borders"></div>
        </div>
    )

};

export default Layout;