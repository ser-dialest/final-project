// HEY  JEFFREY LOOK AT ME
// WHEN AN ENEMY MOVES, HIS POSITION CAN NO LONGER BE TIED TO NPCPOS OR EVERYONE WILL MOVE
// DEPENDENCE ON THAT MUST BE CONDITIONAL
// IN THIS ITERATION, ONLY ONE ENEMY WILL MOVE AT A TIME,
// SO WE CAN GET AWAY WITH THERE JUST BEING ONE ENEMYPOS VARIABLE IN STATE
// THANK GOD FOR INDICES




import React, { Component } from  "react";
import Tile from "../Tile";
import ActionMenu from "../ActionMenu"
import Player from "../Player";
import Enemy from "../Enemy";
import map from "./mapArray";
import playerRange from "./tiles/PlayerRange3.png";
import target from "./tiles/Target3.png";
import "./style.css";
// import aStar from "easy-astar";
const aStar = require("easy-astar").easyAStar;

class Map extends Component {

    state = {
        centerGrid: {x: 10, y: 7},
        mapTravelCost: map.map( row => row.map( column => column.travelCost)),
        startBattleRange: [],
        moving: false,
        inBattle: false,
        playerPhase: false,
        selection: false,
        actionMenu: false,
        canAttack: false,
        targeting: false,
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
        // What frameX of animation he is in (shift of background)
        playerFrameX: 0,
        playerFrameY: 0,
        // How far tile has moved from side
        tilePos: [0, 0],
        player: {
            hp: 8,
            maxHP: 10, 
            speed: 4,
            attack: 3,
            exp: 0,
            level: 1
        },
        npcPos: [0, 0],
        bandits: [
            {   
                hp: 10,
                speed: 4,
                attack: 3,
                map: [15, 12],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [18, 5],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [40, 17],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [25, 25],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [4, 42],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [37, 26],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
            {
                hp: 10,
                speed: 4,
                attack: 3,
                map: [20, 19],
                range: [],
                direction: 1,
                frameX: 0,
                frameY: 0,
            },
        ],
        aggroBandits: [],
        targetable: []
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
                        this.setState({ playerFrameX: this.state.playerFrameX + 72 });
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
        let walkable = this.dontTreadOnMe();
        if (walkable[mapX-1][mapY-1] === 0) {
            // use easy-astar npm to generate array of coordinates to goal
            const startPos = {x:this.state.playerMap[0], y:this.state.playerMap[1]};
            const endPos = {x:mapX,y:mapY};
            const aStarPath = aStar((x, y)=>{
                if (walkable[x-1][y-1] === 0) {
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
        // If not in battle, check to see if in range for battle to start
        if (!this.state.inBattle && this.inRange(this.state.playerMap, this.state.startBattleRange)) {
            this.startBattle();
        } else {
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
                this.setState({moving: false, playerFrameX: 0});
            }
        };
    };

    findRange(start, speed) {
        let range = [];
        for (let x = speed; x >= -speed; x--) {
            let yVariance= Math.abs(Math.abs(x)-Math.abs(speed));
            for (let y = yVariance; y >= -yVariance; y--) {
                let test = [start[0] + x, start[1] + y];
                if (test[0] < 1 || test[0] > 50 || test[1] < 1 || test[1] > 50) { continue };
                range.push(test);
            }
        }
        return range;
    }


    // determine if it can be moved to within a turn
    walkableRange(start, speed) {
        let range = this.findRange(start, speed);
        let walkableRange = []
        let walkableMap = this.state.mapTravelCost;
        range.forEach(test => {
            if (walkableMap[test[0]-1][test[1]-1] === 0) {
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
                    walkableRange.push(test);
                }
            }
        });
        return walkableRange;
    }

    inRange(position, range) {
        let found = false;
        for (let i = 0; i < range.length; i++) {
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
        this.setState({ actionMenu: false, selection: false});
    }

    attackAction() {
        this.setState({ actionMenu: false, targeting: true, });
    }

    attack(index) {
        // animation 
        const swing = (timestamp) => {
            if (t < animationLength) {
                t++;

                if (t === framesPerTick*2 || t === framesPerTick*8) { this.setState({ playerFrameX: 0, playerFrameY: -96 }); }
                if (t === framesPerTick*3 || t === framesPerTick*5 || t === framesPerTick*7) { this.setState({ playerFrameX: -72 }); }
                if (t === framesPerTick*4 || t === framesPerTick*6) { this.setState({ playerFrameX: -144 }); }
                if (t === framesPerTick*9) { this.setState({ playerFrameX: 0, playerFrameY: 0 }); }

                // if (t % (framesPerTick*4) === 0) {
                //     this.setState({ playerFrameX: this.state.playerFrameX + 72 });
                // }
            }
            requestAnimationFrame(swing);
        }


        let t = 0;
        let animationLength = 109;
        let framesPerTick = 12;
        requestAnimationFrame(swing);
        //           
        //         // lock in new map position
        //         this.setState({
        //             camera: camera, 
        //             playerGrid: playerGrid, 
        //             playerMap: playerStep, 
        //             tilePos: [0,0],
        //             npcPos: [0,0],
        //             () => this.direction(path)
        //         );
        //     }
        // };

        // // animation variables
        // let t = 0;
        // let tileWidth = 48;
        // let pixelsPerTick = 4;
        // let framesPerTick = 2;
        // let animationLength = (tileWidth/pixelsPerTick)*framesPerTick ; 
        
        // requestAnimationFrame(playerWalking)
        // }
        
        
        // sound
        // player attack
        if (this.state.playerPhase) {
            const bandits = this.state.bandits;
            bandits[index].hp -= this.state.player.attack;
            // if HP <= 0, death animation
            // remove from aggro bandits
            // remove from state.bandits
            // aggroBandits.length === 0, inBattle = false
            this.setState({ bandits: bandits }, () => console.log(this.state.bandits));
        // end player phase function
        }
    }

    endTurn() {
        // reset all turn order state variables
        // initiate enemy turn
        // this.state.aggroBandits.forEach( index => {
            // astar to player
            // remove last step in path array (so the player doesn't get stepped on)
            // Move adjacent to player or max of 4 steps on astar path
            // if adjacent, attack

        // })
    }

    dontTreadOnMe() {
        let walkable = this.state.mapTravelCost;
        this.state.bandits.forEach( each => {
            walkable[each.map[0]-1][each.map[1]-1] = 1;
        });
        return walkable;
    }

    // determine where (or if) an item is on screen 
    gridDisplay(itemPos) {
        let x = this.state.centerGrid.x + (itemPos[0] - this.state.camera[0]);
        let y = this.state.centerGrid.y + (itemPos[1] - this.state.camera[1]);
        let display = "inline-block";
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

    startBattleRange() {
        let startBattleRange = [[1,0]];
        this.state.bandits.forEach( each => {
            this.findRange(each.map, 5).forEach(coordinate => startBattleRange.push(coordinate))
        });
        this.setState({ startBattleRange: startBattleRange});
    }

    startBattle() {
        // play music
        let aggro = [];
        let aggroRange = this.findRange(this.state.playerMap, 5);
        this.state.bandits.forEach(each => {
            if (this.inRange(each.map, aggroRange)) {
                aggro.push(this.state.bandits.indexOf(each))
            }
        })

        this.setState({ inBattle: true, playerPhase: true, moving: false, aggroBandits: aggro });
    }

    adjacent(position) {
        return [
            [ position[0]+1, position[1] ],
            [ position[0]-1, position[1] ],
            [ position[0], position[1]+1 ],
            [ position[0], position[1]-1 ]
        ]
    }

    componentDidMount() {
        this.startBattleRange();
    }

    render() {
        const width = 19;
        const height = 13;
        const viewable = [];
        let actionMenu = "none";
        let attackButton = "none";

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
                                        playerRange: this.walkableRange(this.state.playerMap, this.state.player.speed)});
                                }
                            }
                        } else {
                            // When you're choosing where to go
                            if (!this.state.actionMenu) {
                                // When you're targeting an enemy
                                if (this.state.targeting) {
                                    this.state.targetable.forEach(index => {
                                        if (this.inRange([mapX, mapY], [this.state.bandits[index].map])) {
                                            imageSource = target;
                                            clickFunc = () => this.attack(index);
                                        } else {
                                            clickFunc = () => this.setState({ targeting: false, actionMenu: true });
                                        }
                                    });
                                } else if (this.inRange([mapX, mapY], this.state.playerRange)) {
                                    imageSource = playerRange;
                                    clickFunc = () => {
                                        // everything that happens when you have chosen to move in a place during battle
                                        // find if we are near the enemy and can attack
                                        let canAttack = false;
                                        let targetable = [];
                                        this.state.aggroBandits.forEach(aggroIndex => {
                                            let banditXY = this.state.bandits[aggroIndex].map;
                                            let banditAdjacent = this.adjacent(banditXY);
                                            if (this.inRange([mapX, mapY], banditAdjacent)) {
                                                canAttack = true;
                                                targetable.push(aggroIndex);
                                            }
                                        });
                                        this.setState({ 
                                            actionMenu: true,
                                            canAttack: canAttack,
                                            targetable: targetable,
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
                                if (this.state.canAttack) { attackButton = "inline"};
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
        this.state.bandits.forEach( each => {
            i++;
            enemies.push(
                <Enemy
                    gridDisplay={this.gridDisplay(each.map)}
                    top={this.state.npcPos[1]}
                    left={this.state.npcPos[0]}
                    frameX={each.frameX}
                    frameY={each.frameY}
                    direction={each.direction}
                    id={"bandit-" + i}
                    key={"bandit-" + i}
                >
                </Enemy>
            );
        });

        let positionModifier = 0
        if (this.state.playerDirection === -1) { positionModifier = -24}

        return (
            <div id="map">
                {viewable}
                <Player
                    playerGrid={this.state.playerGrid}
                    top={this.state.playerPos[1]}
                    left={this.state.playerPos[0] + positionModifier}
                    frameX={this.state.playerFrameX}
                    frameY={this.state.playerFrameY}
                    direction={this.state.playerDirection}
                >
                </Player>
                {enemies}
                <ActionMenu
                    display={actionMenu}
                    attackButton={attackButton}
                    attack={() => this.attackAction()}
                    wait={() => this.waitAction()}
                    back={() => this.backAction()}
                ></ActionMenu>
            </div>
        )
    }
};

export default Map;