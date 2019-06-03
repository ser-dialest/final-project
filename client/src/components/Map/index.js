import React, { Component } from  "react";
import Tile from "../Tile";
import ActionMenu from "../ActionMenu"
import Player from "../Player";
import Enemy from "../Enemy";
import map from "./mapArray";
import playerRange from "./tiles/PlayerRange3.png";
import "./style.css";
// import aStar from "easy-astar";
const aStar = require("easy-astar").easyAStar;

class Map extends Component {

    state = {
        centerGrid: {x: 10, y: 7},
        mapTravelCost: map.map( row => row.map( column => column.travelCost)),
        moving: false,
        inBattle: false,
        playerPhase: false,
        selection: false,
        actionMenu: false,
        // camera center
        camera: [10, 7],
        // Where player is on the screen
        playerGrid: [10, 7],
        // Where player is on the map
        playerMap: [10, 7],
        // Where the camera and player were before moving in battle
        confirmOrigin: [],
        confirmPlayerGrid: [],
        confirmPlayerMap: [],
        playerRange: [],
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
        },
        npcPos: [0, 0],
        bandits: {
            bandit1: {
                map: [15, 12],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit2: {
                map: [10, 5],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit3: {
                map: [40, 17],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit4: {
                map: [25, 25],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit5: {
                map: [4, 42],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit6: {
                map: [35, 26],
                range: [],
                direction: 1,
                frame: 0,
            },
            bandit7: {
                map: [20, 19],
                range: [],
                direction: 1,
                frame: 0,
            },
        }
    }

    // moving starts with this.move(destinationX, destinationY)
    // this.move calculates travel distance to target (maybe unnecesary)
    // and calls path (a function which will be recalled in a cycle with step)
    // Matt says that's probably wrong or unnecessary once the a* goes in
    // path calculates the direction we're moving and then executes animation function, step
    // step determines if the camera or player moves and handles the animation before kicking back to path, 
    // which determines the remaining distance and direction of the next step
    // repeat until delta = [0,0]

    // 
    step(direction, path) {
        // position of player after step
        let playerStep = [
            this.state.playerMap[0] + direction[0],
            this.state.playerMap[1] + direction[1]
        ];
        // calculation variables
        let playerGrid = [];
        let camera = [];
        let mapMove;
        // determine where camera position is relative to the x-axis
        if (playerStep[0] <= 10) {
            camera.push(10);
            playerGrid.push(playerStep[0]);
            if (direction[0] !== 0) {
                if (camera[0] === this.state.camera[0]) {mapMove = false}
                else {
                    mapMove = true;
                };
            }
        } else if (playerStep[0] >= 38) {
            camera.push(38);
            playerGrid.push(19-(48-(playerStep[0]+1)));
            if (direction[0] !== 0) {
                if (camera[0] === this.state.camera[0]) {mapMove = false}
                else {
                    mapMove = true;
                 };
            }
        } else {
            camera.push(playerStep[0]);
            playerGrid.push(10);
            if (direction[0] !== 0) { mapMove = true; }
        }
        // determine where camera position is relative to the y-axis
        if (playerStep[1] <= 7) {
            camera.push(7);
            playerGrid.push(playerStep[1]);
            if (direction[1] !== 0) {
                if (camera[1] === this.state.camera[1]) {mapMove = false}
                else {
                    mapMove = true;
                };
            }
        } else if (playerStep[1] >= 41) {
            camera.push(41);
            playerGrid.push(13-(48-(playerStep[1]+1)));
            if (direction[1] !== 0) {
                if (camera[1] === this.state.camera[1]) {mapMove = false}
                else {
                    mapMove = true;
                };
            }
        } else {
            camera.push(playerStep[1]);
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
                        this.setState({
                            tilePos: [
                                this.state.tilePos[0]-(direction[0]*pixelsPerTick),
                                this.state.tilePos[1]-(direction[1]*pixelsPerTick)
                            ],
                            npcPos: [
                                this.state.npcPos[0]-(direction[0]*pixelsPerTick),
                                this.state.npcPos[1]-(direction[1]*pixelsPerTick)
                            ]
                        },
                            () => requestAnimationFrame(playerWalking)
                        );
                    } else {
                        this.setState({playerPos: [
                            this.state.playerPos[0]+(direction[0]*pixelsPerTick),
                            this.state.playerPos[1]+(direction[1]*pixelsPerTick)
                        ]}, 
                            () => requestAnimationFrame(playerWalking)
                        );
                    }
                } else { requestAnimationFrame(playerWalking) }
            } else {                
                // lock in new map position
                this.setState({
                    camera: camera, 
                    playerGrid: playerGrid, 
                    playerMap: playerStep, 
                    tilePos: [0,0],
                    npcPos: [0,0],
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
            // determine direction player faces
            if (direction[0] === 1) {
                this.setState({playerDirection: 1}, () => this.step(direction, path))
            } else if (direction[0] === -1) {
                this.setState({playerDirection: -1}, () => this.step(direction, path))
            } else {
                this.step(direction, path);
            }
        } else {
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
                if (test[0] < 1 || test[0] > 50 || test[1] < 1 || test[1] > 50) { continue };
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

    inRange(position, range) {
        let found = false;
        for (let i = 0; i<range.length; i++) {
            if (position[0] === range[i][0] && position[1] === range[i][1]) { found = true }
        }
        return found;
    }

    // Write functions for those actions
    backAction() {
        this.setState({ 
            actionMenu: false, 
            camera: this.state.confirmOrigin, 
            playerGrid: this.state.confirmPlayerGrid, 
            playerMap: this.state.confirmPlayerMap});
    }

    waitAction() {
        this.setState({ actionMenu: false, selection: false})
    }

    // determine where (or if) an item is on screen 
    gridDisplay(itemPos) {
        let x = this.state.centerGrid.x + (itemPos[0] - this.state.camera[0]);
        let y = this.state.centerGrid.y + (itemPos[1] - this.state.camera[1]);
        let display = "inline";
        // magic numbers that are the edges of the display
        // X goes 1-19, y goes 2-13 to accomodate a display bug
        if ( x < 1 || x > 19 || y < 2 || y > 13) {display = "none"};
        let result = {
            x: x,
            y: y,
            display: display
        };
        return result;
    }

    render() {

        const width = 19;
        const height = 13;
        const viewable = [];
        let actionMenu = "none";

        // Block that defines every tile in the map
        for (let x = 0;  x < width; x++) {
            for (let y = 0; y < height; y++) {
                let mapX = x + this.state.camera[0] - ((width - 1) / 2);
                let mapY = y + this.state.camera[1] - ((height - 1) /2);
                let id = "x" + (x + 1) + "y" + (y + 1);
                let clickFunc;
                let imageSource = map[mapX-1][mapY-1].image;
                // Only accept commands if we aren't moving
                if (!this.state.moving) {
                    // Free move as not in battle
                    if (!this.state.inBattle) {
                        clickFunc = () => this.move(mapX, mapY);
                    } else if (this.state.playerPhase) {
                        // this is the player's turn
                        // if no one has been selected, selecting is all you can do
                        if (!this.state.selection) {
                            if ((x+1) === this.state.playerGrid[0] && (y+1) === this.state.playerGrid[1]) { 
                                clickFunc = () => {
                                    this.setState({ 
                                        selection: true, 
                                        playerRange: this.moveRange(this.state.playerMap, this.state.player.speed)});
                                }
                            }
                        } else {
                            // When you're choosing where to go
                            if (!this.state.actionMenu) {
                                if (this.inRange([mapX, mapY], this.state.playerRange)) {
                                    imageSource = playerRange;
                                    clickFunc = () => {
                                        this.setState({ 
                                            actionMenu: true, 
                                            confirmOrigin: this.state.camera, 
                                            confirmPlayerGrid: this.state.playerGrid, 
                                            confirmPlayerMap: this.state.playerMap 
                                        });
                                        this.move(mapX, mapY);
                                    }
                                } else { 
                                    clickFunc = () => this.setState({ selection: false });
                                }
                            } else {
                                // The action menu is up (Attack Wait Back)
                                actionMenu = "flex";
                            }
                        }
                    }
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
                        imageSource={imageSource}
                        click={clickFunc}
                    >
                    </Tile>
                ); 
            }
        }

        // Place enemies
        let enemies = [];
        let i = 0;
        for (let individual in this.state.bandits) {
            i++;
            enemies.push(
                <Enemy
                    gridDisplay={this.gridDisplay(this.state.bandits[individual].map)}
                    top={this.state.npcPos[1]}
                    left={this.state.npcPos[0]}
                    frame={this.state.bandits[individual].frame}
                    direction={this.state.bandits[individual].direction}
                    id={"bandit-" + i}
                >
                </Enemy>
            );
        };

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
                {enemies}
                <ActionMenu
                    display={actionMenu}
                    wait={() => this.waitAction()}
                    back={() => this.backAction()}
                ></ActionMenu>
            </div>
        )
    }
};

export default Map;