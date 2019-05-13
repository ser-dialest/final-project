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

    move(id) {
        let column = Number(id.substring(1, id.indexOf("y")));
        let row = Number(id.substring(id.indexOf("y")+1));
        console.log(column, row);
        this.setState({origin: [column, row]});
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
                let id = "x" + (x+x1) + "y" + (y+y1);
                viewable.push(
                    <Tile 
                    id={id}
                    column={x+1}
                    row={y+1}
                    imageSource={map[x+x1][y+y1]}
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
            </div>
        )
    }
};

export default Map;