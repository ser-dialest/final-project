import React, { Component } from  "react";
import map from "./mapArray";
import "./style.css";
import Tile from "../Tile";
import Player from "../Player"

class Map extends Component {

    state = {
        origin: [10, 7],
        playerGrid: [10, 7],
        playerMap: [10, 7],
        tilePos: [0, 0],
        playerPos: [0, 0],
        moving: false
    }

    step(direction, delta) {
        // position of player after step
        let playerStep = [this.state.playerMap[0] + direction[0], this.state.playerMap[1] + direction[1]];
        // calculation variables
        let playerGrid = [];
        let origin = []
        let mapMove;
        // determine where camera position is relative to the x-axis
        if (playerStep[0] <= 10) {
            origin.push(10);
            playerGrid.push(playerStep[0]);
            if (direction[0] !== 0) {
                if (origin[0] === this.state.origin[0]) {mapMove = false}
                else { mapMove = true };
            }
        }
        else if (playerStep[0] >= 38) {
            origin.push(38);
            playerGrid.push(19-(48-(playerStep[0]+1)));
            if (direction[0] !== 0) {
                if (origin[0] === this.state.origin[0]) {mapMove = false}
                else { mapMove = true };
            }
        }
        else {
            origin.push(playerStep[0]);
            playerGrid.push(10);
            if (direction[0] !== 0) {
                mapMove = true;
            }
        }
        // determine where camera position is relative to the y-axis
        if (playerStep[1] <= 7) {
            origin.push(7);
            playerGrid.push(playerStep[1]);
            if (direction[1] !== 0) {
                if (origin[1] === this.state.origin[1]) {mapMove = false}
                else { mapMove = true };
            }
        }
        else if (playerStep[1] >= 41) {
            origin.push(41);
            playerGrid.push(13-(48-(playerStep[1]+1)));
            if (direction[1] !== 0) {
                if (origin[1] === this.state.origin[1]) {mapMove = false}
                else { mapMove = true };
            }
        }
        else {
            origin.push(playerStep[1]);
            playerGrid.push(7);
            if (direction[1] !== 0) { mapMove = true; }
        }
        
        const playerWalking = (timestamp) => {
            if (t < animationLength) {
                t++;

                if (t % framesPerTick === 0) {
                    if (mapMove) {
                        this.setState({tilePos: [this.state.tilePos[0]-(direction[0]*pixelsPerTick), this.state.tilePos[1]-(direction[1]*pixelsPerTick)]}, 
                            () => requestAnimationFrame(playerWalking)
                        );
                    }
                    else {
                        this.setState({playerPos: [this.state.playerPos[0]+(direction[0]*pixelsPerTick), this.state.playerPos[1]+(direction[1]*pixelsPerTick)]}, 
                            () => requestAnimationFrame(playerWalking)
                        );
                    }
                }
                else { requestAnimationFrame(playerWalking) }
            }
            else {
                // lock in new map position
                this.setState({origin: origin, playerGrid: playerGrid, playerMap: playerStep, tilePos: [0,0], playerPos: [0,0] }, () => {
                    delta[0] -= direction[0];
                    delta[1] -= direction[1];
                    this.path(delta);
                });
            }
        };

        // animation variables
        let t = 0;
        let tileWidth = 48;
        let pixelsPerTick = 4;
        let framesPerTick = 2;
        let animationLength = (tileWidth/pixelsPerTick)*framesPerTick ; 
        
        requestAnimationFrame(playerWalking)
    }

    move(gridX, gridY, mapX, mapY) {
        let delta = [mapX - this.state.playerMap[0], mapY - this.state.playerMap[1]];
        this.setState({moving: true}, () => this.path(delta));
    }

    path(delta) {
        // direction array based on unit circle
        if (delta[0] !== 0 || delta[1] !== 0) {
            let direction = [];
            if (Math.abs(delta[0]) >= Math.abs(delta[1])) {
                if (delta[0] > 0) { direction = [1, 0] } // east
                else { direction = [-1, 0] } // west
            }
            else {
                if (delta[1] > 0) { direction = [0, 1] } // south
                else { direction = [0, -1] } // north
            }
            this.step(direction, delta);
        }
        else {
            this.setState({moving: false});
        }
    };

    render() {
        // x and y are reversed somehow. I will have to look at it when I update the map.
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
                let moveFunc;
                if (!this.state.moving) {
                    moveFunc = () => this.move(gridX, gridY, mapX, mapY);
                }

                viewable.push(
                    <Tile 
                    id={id}
                    key={id}
                    className="tile"
                    column={gridX}
                    row={gridY}
                    top={this.state.tilePos[1]}
                    left={this.state.tilePos[0]}
                    imageSource={map[mapX-1][mapY-1]}
                    move={moveFunc}
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
                    top={this.state.playerPos[1]}
                    left={this.state.playerPos[0]}
                >
                </Player>
            </div>
        )
    }
};

export default Map;