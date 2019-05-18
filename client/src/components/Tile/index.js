import React, { Component } from "react";
import highlight from "./Highlight3.png"

class Tile extends Component {
    state = {
        cursor: "none"
    };

    hoverOn() {
        this.setState({cursor:"inline"});
    };

    hoverOff() {
        this.setState({cursor:"none"});
    };

    render () {
        return (
            <div 
                key={this.props.id}
                id={this.props.id}
                className="gridSquare"
                style={{
                    gridColumnStart:`${this.props.column}`,
                    gridRowStart:`${this.props.row}`,
                }}
                onMouseEnter={() => this.hoverOn()}
                onMouseLeave={() => this.hoverOff()}
                onClick={this.props.move}
            >
                <img 
                    key={this.props.id + "img"} 
                    alt="map" 
                    src={this.props.imageSource} 
                    style={{
                        top:`${this.props.top}px`,
                        left:`${this.props.left}px`,
                        position:"relative",
                        // display: "inline"
                    }}
                />
                {/* <img
                    className="cursor"
                    key={this.props.id + "cursor"}
                    src={highlight}
                    alt=""
                    style={{
                        display:this.state.cursor,
                        position:"absolute",
                        // top:"0",
                        // left:"0",
                        zIndex:"1"
                    }}

                /> */}
            </div>
        );
    };
};

export default Tile;