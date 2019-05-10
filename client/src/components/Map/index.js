import React, { Component } from  "react";
import grass from "./tiles/Grass3.png";
import mountain from "./tiles/Mountain3.png";
import building from "./tiles/Building3.png";
import forest from "./tiles/Forest3.png";
import "./style.css";

class Map extends Component {
    state = {
        origin: [6,8],
        map: [
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, grass, grass, grass, mountain, mountain, mountain, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, grass, mountain, mountain, mountain, mountain, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [grass, grass, mountain, mountain, mountain, grass, grass, grass, forest, forest, forest, forest, grass, grass, grass, grass],
            [grass, grass, grass, grass, mountain, grass, grass, grass, grass, forest, forest, forest, forest, grass, grass, grass],
            [grass, grass, grass, grass, grass, mountain, mountain, grass, grass, grass, forest, forest, grass, grass, grass, grass],
            [mountain, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [mountain, mountain, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [mountain, mountain, mountain, grass, grass, grass, grass, grass, grass, grass, building, grass, building, grass, grass, grass],
            [mountain, mountain, mountain, grass, grass, grass, grass, building, building, grass, grass, grass, grass, grass, grass, forest],
            [grass, mountain, mountain, mountain, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, forest],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, forest, forest],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, grass, forest, forest, forest, forest],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass, forest, forest, forest, forest, forest, forest, forest],
            [grass, grass, grass, grass, grass, forest, forest, forest, forest, forest, forest, forest, forest, forest, forest, forest],
        ]
    }

    render() {
        let x = this.state.origin[0];
        let y = this.state.origin[1];
        let width = 8;
        let xMax = x + width;
        let yMax = y + width;

        const viewable = [];

        while (y < yMax) {
            while (x < xMax) {
                let id = "x" + x + "y" + y;
                viewable.push(<img id={id} src={this.state.map[y][x]} gridColumnStart={x+1} gridRowStart={y+1} />);
                x++;
            }
            x = this.state.origin[0];
            y++;
        }

        return (
            <div id="map">
                {viewable}
            </div>
        )
    }
};

export default Map;