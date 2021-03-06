import React from  "react";
import "./style.css";

function Enemy(props) {
    return (
        <div
            className="bandit"
            style={{
                display: `${props.gridDisplay.display}`,
                gridColumnStart:`${props.gridDisplay.x}`, 
                gridRow:`${props.gridDisplay.y - 1}/span 2`,
                top:`${props.top}px`,
                left:`${props.left}px`,
                position:"relative",
                backgroundPositionX:`${props.frameX}px`,
                backgroundPositionY:`${props.frameY}px`,
                transform: `scaleX(${props.direction})`,
                zIndex: `${props.gridDisplay.y * 2}`
            }}
            id={props.id}
            alt={props.id}
            key={props.id}
        >
        </div>
    );
};

export default Enemy;