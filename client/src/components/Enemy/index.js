import React from  "react";
// import "./style.css";

function Enemy(props) {
    return (
        <div
            style={{
                gridColumnStart:`${props.enemyGrid[0]}`, 
                gridRow:`${props.enemyGrid[1]-1}/span 2`,
                top:`${props.top}px`,
                left:`${props.left}px`,
                position:"relative",
                backgroundPositionX:`${props.frame}px`,
                transform: `scaleX(${props.direction})`
            }}
            id="bandit1"
            alt="bandit1"
            key="bandit1"

        >
        </div>
    );
};

export default Enemy;