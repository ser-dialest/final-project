import React from  "react";
import "./style.css";

function Player(props) {
    let zModifier;
    if (props.frameX !== 0) {zModifier = 1}
    else {zModifier = 0}

    return (
        <div
            style={{
                gridColumnStart:`${props.playerGrid[0]}`, 
                gridRow:`${props.playerGrid[1]-1}/span 2`,
                top:`${props.top}px`,
                left:`${props.left}px`,
                position:"relative",
                backgroundPositionX:`${props.frameX}px`,
                backgroundPositionY:`${props.frameY}px`,
                transform: `scaleX(${props.direction})`,
                zIndex: `${props.playerGrid[1]*2 + zModifier}`,
                display: `${props.gameOver ? "none" : "inline-block"}`
            }}
            id="player"
            alt="player"
            key="player"

        >
        </div>
    );
};

export default Player;
  