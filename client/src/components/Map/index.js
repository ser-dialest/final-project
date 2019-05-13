import React, { Component } from  "react";
import map from "./mapArray";
import "./style.css";
import Tile from "../Tile";

class Map extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    };

    state = {
        origin: [0, 0]
    }

    render() {
        
        let x1 = this.state.origin[0];
        let y1 = this.state.origin[1];
        let width = 16;
        let height = 10;
        let x = 0;
        let y = 0;

        const viewable = [];

        while (x < width) {
            while (y < height) {
                let id = "x" + (x+1) + "y" + (y+1);
                viewable.push(
                    <Tile 
                    id={id}
                    column={x+1}
                    row={y+1}
                    imageSource={map[x+x1][y+y1]}
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
            </div>
        )
    }
};

export default Map;