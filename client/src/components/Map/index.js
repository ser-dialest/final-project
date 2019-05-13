import React, { Component } from  "react";
import map from "./mapArray";
import "./style.css";
import Tile from "../Tile";
import Player from "../Player"

class Map extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    };

    state = {
        origin: [9, 6]
    }

    move(id) {
        let column = Number(id.substring(1, id.indexOf("y")));
        let row = Number(id.substring(id.indexOf("y")+1));
        console.log(column, row);
        if (column >= 9 && column <= 39 && row >= 6 && row <= 42) {     
            this.setState({origin: [column, row]});
        };
    };

    render() {
        console.log(this.state.origin);
        let x = 0;
        let y = 0;
        let x1 = this.state.origin[0];
        let y1 = this.state.origin[1];
        let width = 17;
        let height = 11;
        let widthHalf = (width - 1) / 2;
        let heightHalf = (height -1) /2;

        const viewable = [];

        while (x < width) {
            while (y < height) {
                let id = "x" + (x+x1-widthHalf) + "y" + (y+y1-heightHalf);
                viewable.push(
                    <Tile 
                    id={id}
                    column={x+1}
                    row={y+1}
                    imageSource={map[x+x1-widthHalf][y+y1-heightHalf]}
                    move={() => this.move(id)}
                    >
                    </Tile>                 
                ); 
                y++;
            }
            y = 0;
            x++;
        }

        return (
            <div id="map">
                {viewable}
                <Player
                    // column={this.state.origin[0]}
                    // row={this.state.origin[1]}
                >
                </Player>
            </div>
        )
    }
};

export default Map;