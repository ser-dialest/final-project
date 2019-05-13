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
                style={{gridColumnStart:`${this.props.column}`, gridRowStart:`${this.props.row}`}}
                onMouseEnter={() => this.hoverOn()}
                onMouseLeave={() => this.hoverOff()}
                onClick={this.props.move}

            >
                <img 
                    key={this.props.id + "img"} 
                    alt="map" 
                    src={this.props.imageSource} 
                />
                <img
                    className="cursor"
                    key={this.props.id + "cursor"}
                    src={highlight}
                    alt=""
                    style={{display:this.state.cursor}}

                />
            </div>
        );
    };
};

export default Tile;