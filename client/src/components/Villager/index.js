import React from  "react";
import "./style.css";

function Villager(props) {
    return (
        <div
            className="villager"
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
            id="Villager"
            alt="Villager"
            key="Villager"
        >
        </div>
    );
};

export default Villager;