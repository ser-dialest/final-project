import React from  "react";
// import "./style.css";

function ActionMenu(props) {
    return (
        <div
            style={{
                bottom:`0px`,
                right:`0px`,
                position:"absolute",
                display: `${props.display}`,
                flexDirection: `column`,
                zIndex: 1000
            }}
            id="action-menu"
            key="action-menu"
        >
            <button>Attack</button>
            <button onClick={props.wait}>Wait</button>
            <button onClick={props.back}>Back</button>
        </div>
    );
};

export default ActionMenu;
  