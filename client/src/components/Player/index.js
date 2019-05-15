import React from  "react";
import "./style.css";

// import sprite from "./Player3.png";

function Player(props) {
    return (
        <div
            style={{gridColumnStart:`${props.playerGrid[0]}`, 
                gridRow:`${props.playerGrid[1]-1}/span 2`,
            }}
            id="player"
            alt="player"
            key="player"
        >
        </div>
    );
};

export default Player;
  