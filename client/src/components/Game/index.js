import React, { Component } from  "react";
import Map from "../Map";
import "./style.css";

class Game extends Component {
    render() {
        return (
            <div id="map-area">
                <Map></Map>
            </div>
        );
    }
};

export default Game;