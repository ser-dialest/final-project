import React, { Component } from  "react";
import map from "./mapArray";
import "./style.css";
import Tile from "../Tile";
import Player from "../Player";
// import aStar from "easy-astar";
const aStar = require("easy-astar").easyAStar;

class Map extends Component {

    state = {
        mapTravelCost: map.map( row => row.map( column => column.travelCost)),
        moving: false,
        inBattle: false,
        playerPhase: false,
        // camera center
        origin: [10, 7],
        // Where player is on the screen
        playerGrid: [10, 7],
        // Where player is on the map
        playerMap: [10, 7],
        // How far player has moved between squares
        playerPos: [0, 0],
        // Whether he faces left or right (1 = right, -1 = left)
        playerDirection: 1,
        // What frame of animation he is in (shift of background)
        playerFrame: 0,
        // How far tile has moved from side
        tilePos: [0, 0],
        player: {
            speed: 4
        }
    }

    // moving starts with this.move(destinationX, destinationY)
    // this.move calculates travel distance to target (maybe unnecesary), calls path (a function which will be recalled in a cycle with step)
    // Matt says that's probably wrong or unnecessary once the a* goes in
    // path calculates the direction we're moving and then executes animation function, step
    // step determines if the camera or player moves and handles the animation before kicking back to path, which determines the remaining distance and direction of the next step
    // repeat until delta = [0,0]

    // 
    step(direction, path) {
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
                    if (t % (framesPerTick*4) === 0) {
                        this.setState({ playerFrame: this.state.playerFrame + 48 });
                    }
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
                this.setState({
                    origin: origin, 
                    playerGrid: playerGrid, 
                    playerMap: playerStep, 
                    tilePos: [0,0], 
                    playerPos: [0,0] }, 
                    () => this.direction(path)
                );
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

    move(mapX, mapY) {
        // check if it is a walkable tile
        if (this.state.mapTravelCost[mapX-1][mapY-1] === 0) {
            // use easy-astar npm to generate array of coordinates to goal
            const startPos = {x:this.state.playerMap[0], y:this.state.playerMap[1]};
            const endPos = {x:mapX,y:mapY};
            const aStarPath = aStar((x, y)=>{
                if (this.state.mapTravelCost[x-1][y-1] === 0) {
                    return true; // 0 means road
                } else {
                    return false; // 1 means wall
                }
            }, startPos, endPos);
            let path = aStarPath.map( element => [element.x, element.y]);
            this.setState({moving: true}, () => this.direction(path));
        };
    }

    direction(path) {
        // direction array based on unit circle
        if (path.length > 1) {
            let direction = [path[1][0] - path[0][0], path[1][1] - path[0][1]];            
            path.shift();
            if (direction[0] === 1) {
                this.setState({playerDirection: 1}, () => this.step(direction, path))
            } else if (direction[0] === -1) {
                this.setState({playerDirection: -1}, () => this.step(direction, path))
            } else {
                this.step(direction, path);
            }
        }
        else {
            this.setState({moving: false, playerFrame: 0});
        }
    };

    // determine if it can be moved to within a turn
    moveRange(start, speed) {
        let range = [];
        let walkableMap = this.state.mapTravelCost;
        for (let x = speed; x >= -speed; x--) {
            let yVariance= Math.abs(Math.abs(x)-Math.abs(speed));
            for (let y = yVariance; y >= -yVariance; y--) {
                let test = [start[0] + x, start[1] + y];
                // check if out of bounds
                if (test[0] < 0 || test[0] > 49 || test[1] < 0 || test[1] > 49) { continue };
                // check if walkable
                if (walkableMap[test[0]-1][test[1]-1] === 1) { continue };
                // easyAStar objects
                const startPos = {x:start[0], y:start[1]};
                const endPos = {x:test[0],y:test[1]};
                let testPath = aStar((x, y)=>{
                    if (walkableMap[x-1][y-1] === 0) {
                        return true; // 0 means road
                    } else {
                        return false; // 1 means wall
                    }
                }, startPos, endPos);
                if (speed >= (testPath.length-1)) {
                    range.push(test);
                }
            }
        }
        return range;
    }

    render() {
        // x and y are reversed somehow. I will have to look at it when I update the map.
        const width = 19;
        const height = 13;

        const viewable = [];
        let range = []
        range = this.moveRange([7,7], 3);
        if (this.state.playerPhase) {
            range = this.moveRange(this.state.playerMap, this.state.player.speed);
        }

        for (let x = 0;  x < width; x++) {
            for (let y = 0; y < height; y++) {
                let mapX = x + this.state.origin[0] - ((width - 1) / 2);
                let mapY = y + this.state.origin[1] - ((height - 1) /2);
                let id = "x" + (x + 1) + "y" + (y + 1);
                let moveFunc;
                if (!this.state.moving && !this.state.inBattle) {
                    moveFunc = () => this.move(mapX, mapY);
                }
                

                viewable.push(
                    <Tile 
                        id={id}
                        key={id}
                        className="tile"
                        column={x+1}
                        row={y+1}
                        top={this.state.tilePos[1]}
                        left={this.state.tilePos[0]}
                        imageSource={map[mapX-1][mapY-1].image}
                        move={moveFunc}
                    >
                    </Tile>                 
                ); 
            }
        }

        return (
            <div id="map">
                {viewable}
                <Player
                    playerGrid={this.state.playerGrid}
                    top={this.state.playerPos[1]}
                    left={this.state.playerPos[0]}
                    frame={this.state.playerFrame}
                    direction={this.state.playerDirection}
                >
                </Player>
            </div>
        )
    }
};

export default Map;