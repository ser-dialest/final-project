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
        origin: [10, 7],
        playerGrid: [10, 7],
        playerMap: [10, 7]
    }

    move(gridX, gridY, mapX, mapY) {
        this.setState({playerMap: [mapX, mapY]});
        let playerGrid = [];
        let origin = []
        // console.log(gridX, gridY, mapX, mapY);
        // determine where camera position is relative to the x-axis
        if (mapX < 10) {
            origin.push(10);
            playerGrid.push(mapX);
        }
        else if (mapX > 38) {
            origin.push(38);
            playerGrid.push(19-(48-(mapX+1)));
        }
        else {
            origin.push(mapX);
            playerGrid.push(10);
        }
        // determine where camera position is relative to the y-axis
        if (mapY < 7) {
            origin.push(7);
            playerGrid.push(mapY);
        }
        else if (mapY > 41) {
            origin.push(41);
            playerGrid.push(13-(48-(mapY+1)));
        }
        else {
            origin.push(mapY);
            playerGrid.push(7);
        }
        console.log(playerGrid, origin);
        this.setState({origin: origin, playerGrid: playerGrid});
        // this.setState({player: [column, row]}, 
        //     () => {
        //         if (column >= 9 && column <= 39 && row >= 6 && row <= 42) {
        //             this.setState({origin: [column, row]});
        //         };
        //     }
        // );

        // function cameraMove(column, row) {
        //     if (column >= 9 && column <= 39 && row >= 6 && row <= 42) {    
        //         this.setState({origin: [column, row]});
        //     };
        // };
        
    };

    render() {
        // Cartesian counters
        let x = 0;
        let y = 0;
        // map center
        let x1 = this.state.origin[0];
        let y1 = this.state.origin[1];
        // map size
        let width = 19;
        let height = 13;
        let widthHalf = (width - 1) / 2;
        let heightHalf = (height -1) /2;

        const viewable = [];

        while (x < width) {
            while (y < height) {
                let gridX = x+1;
                let gridY = y+1
                let mapX = x+x1-widthHalf;
                let mapY = y+y1-heightHalf;
                let id = "x" + gridX + "y" + gridY;
                
                viewable.push(
                    <Tile 
                    id={id}
                    key={id}
                    column={gridX}
                    row={gridY}
                    imageSource={map[mapX-1][mapY-1]}
                    move={() => this.move(gridX, gridY, mapX, mapY)}
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
                    playerGrid={this.state.playerGrid}
                >
                </Player>
            </div>
        )
    }
};

export default Map;