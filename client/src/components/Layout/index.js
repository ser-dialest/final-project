// HEY  JEFFREY LOOK AT ME
// WHEN AN ENEMY MOVES, HIS POSITION CAN NO LONGER BE TIED TO NPCPOS OR EVERYONE WILL MOVE
// DEPENDENCE ON THAT MUST BE CONDITIONAL
// IN THIS ITERATION, ONLY ONE ENEMY WILL MOVE AT A TIME,
// SO WE CAN GET AWAY WITH THERE JUST BEING ONE ENEMYPOS VARIABLE IN STATE
// THANK GOD FOR INDICES

import React, { Component } from "react";
import Map from "../Map";
import User from "../User";
import Data from "../Data";
import SignUp from "../SignUp";
import "./style.css";
import map from "../Map/mapArray";
import axios from "axios";
const aStar = require("easy-astar").easyAStar;

class Layout extends Component {
    constructor(props) {
        super(props);

        this.logInSuccess = this.logInSuccess.bind(this);
        this.hideSignIn = this.hideSignIn.bind(this);

        this.attack = this.attack.bind(this);
        this.attackAction = this.attackAction.bind(this);
        this.backAction = this.backAction.bind(this);
        this.checkAttack = this.checkAttack.bind(this);
        this.gridDisplay = this.gridDisplay.bind(this);
        this.move = this.move.bind(this);
        this.outOfRange = this.outOfRange.bind(this);
        this.selectionFalse = this.selectionFalse.bind(this);
        this.selectionTrue = this.selectionTrue.bind(this);
        this.waitAction = this.waitAction.bind(this);

        this.state = {
            loggedIn: true,
            userName: "dialest",
            signingIn: "none",
            createUser: false,
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
            aggroBandits: [],
            targetable: [],
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
                }
            ],
        }
    }

    componentDidMount() {
        this.startBattleRange();
    }

    // FUNCTIONS FOR USERS:
    // signIn, LogInSuccess, hideSignIn, save, load

    signIn(signUp) {
        this.setState({signingIn: "flex", createUser: signUp})
    }

    logInSuccess(data) {
        // receive user data
        localStorage.setItem("token", data.token);
        this.setState({ loggedIn: true, userName: data.username, signingIn: "none" });
    }

    hideSignIn(event) {
        event.preventDefault();
        this.setState({ signingIn: "none" });
    }

    save() {
        if (!this.state.moving) {
            let submission = {};
            submission.state = JSON.stringify(this.state);
            submission.token = localStorage.getItem("token");
            let url="api/users/save";
            axios.post( url, submission).then(response => {
                console.log(response);
            })
        }
    }

    load() {
        if (!this.state.moving) {
            let submission = {};
            submission.token = localStorage.getItem("token");
            let url="api/users/load";
            axios.post( url, submission).then(response => {
                let r = JSON.parse(response.data)
                this.setState({
                    centerGrid: r.centerGrid,
                    mapTravelCost: r.mapTravelCost,
                    startBattleRange: r.startBattleRange,
                    moving: r.moving,
                    inBattle: r.inBattle,
                    playerPhase: r.playerPhase,
                    selection: r.selection,
                    actionMenu: r.actionMenu,
                    canAttack: r.canAttack,
                    targeting: r.targeting,
                    camera: r.camera,
                    playerGrid: r.playerGrid,
                    playerMap: r.playerMap,
                    confirmOrigin: r.confirmOrigin,
                    confirmPlayerGrid: r.confirmPlayerGrid,
                    confirmPlayerMap: r.confirmPlayerMap,
                    playerRange: r.playerRange,
                    playerPos: r.playerPos,
                    playerDirection: r.playerDirection,
                    playerFrameX: r.playerFrameX,
                    playerFrameY: r.playerFrameY,
                    tilePos: r.tilePos,
                    aggroBandits: r.aggroBandits,
                    targetable: r.targetable,
                    player: r.player,
                    npcPos: r.npcPos,
                    bandits: r.bandits
                }) 
            })
        }
    }

    // FUNCTIONS FOR DETERMINING AND SEARCHING RANGES AND LOCATIONS
    // inRange, findRange, walkableRange, startBattleRange, adjacent, dontTreadOnMe, gridDisplay, canAttack

    inRange(position, range) {
        let found = false;
        for (let i = 0; i < range.length; i++) {
            if (position[0] === range[i][0] && position[1] === range[i][1]) { found = true }
        }
        return found;
    }

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

    startBattleRange() {
        let startBattleRange = [[1,0]];
        this.state.bandits.forEach( each => {
            this.findRange(each.map, 5).forEach(coordinate => startBattleRange.push(coordinate))
        });
        this.setState({ startBattleRange: startBattleRange});
    }

    adjacent(position) {
        return [
            [ position[0]+1, position[1] ],
            [ position[0]-1, position[1] ],
            [ position[0], position[1]+1 ],
            [ position[0], position[1]-1 ]
        ]
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

    checkAttack(mapX, mapY) {
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

    // FUNCTIONS FOR THE ACTION MENU
    // backAction, waitAction, attackAction

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

    // FUNCTIONS THAT HANDLE TURN TRANSITIONS AND BATTLE STATE
    // startBattle, selecting, selectionFalse, outOfRange, endTurn

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

    selectionTrue() {
        this.setState({ 
            selection: true, 
            playerRange: this.walkableRange(this.state.playerMap, this.state.player.speed)
        });
    }

    selectionFalse() {
        this.setState({ selection: false });
    }

    outOfRange() {
        this.setState({ targeting: false, actionMenu: true });
    }

    endTurn(index) {
        // reset all turn order state variables
        if (this.state.playerPhase) {
            let aggroBandits = this.state.aggroBandits;
            const bandits = this.state.bandits;
            bandits[index].hp -= this.state.player.attack;
            let newMap = this.state.mapTravelCost;
            
            if (bandits[index].hp <= 0) { 
                // death animation
                // remove from aggro bandits
                let deadAggro = aggroBandits.findIndex(element => element === index);
                aggroBandits.splice(deadAggro, 1);
                // repair map
                // I don't rmember why it has to be -1
                newMap[bandits[index].map[0]-1][bandits[index].map[1]-1] = 0;
                // remove from state.bandits
                bandits.splice(index, 1);
            }
            // aggroBandits.length === 0, inBattle = false
            this.setState({ bandits: bandits, aggroBandits: aggroBandits }, () => {
                if (this.state.aggroBandits.length === 0) {
                    this.setState({ 
                        inBattle: false, 
                        playerPhase: false,
                        selection: false,
                        actionMenu: false,
                        canAttack: false,
                        targeting: false,
                        mapTravelCost: newMap
                    }, () => this.startBattleRange());
                } else {
                    this.setState({ 
                        playerPhase: true, // this will be false when enemies can go
                        selection: false,
                        actionMenu: false,
                        canAttack: false,
                        targeting: false,
                        mapTravelCost: newMap
                    }, () => console.log(this.state));
                };
            });
        }
        // initiate enemy turn
        // this.state.aggroBandits.forEach( index => {
        // astar to player
        // remove last step in path array (so the player doesn't get stepped on)
        // Move adjacent to player or max of 4 steps on astar path
        // if adjacent, attack
    }

    // FUNCTIONS FOR MOVEMENT: 
    // move, direction, step

    // moving starts with this.move(destinationX, destinationY)
    // this.move calculates travel distance to target (maybe unnecesary)
    // and calls path (a function which will be recalled in a cycle with step)
    // Matt says that's probably wrong or unnecessary once the a* goes in
    // path calculates the direction we're moving and then executes animation function, step
    // step determines if the camera or player moves and handles the animation before kicking back to path, 
    // which determines the remaining distance and direction of the next step
    // repeat until delta = [0,0]

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

    // FUNCTIONS FOR ATTACKING
    // attack

    attack(index) {
        // attack animation 
        const swing = (timestamp) => {
            if (t < animationLength) {
                t++;
                if (t === framesPerTick*2 || t === framesPerTick*8) { this.setState({ playerFrameX: 0, playerFrameY: -96 }); }
                if (t === framesPerTick*3 || t === framesPerTick*5 || t === framesPerTick*7) { this.setState({ playerFrameX: -72 }); }
                if (t === framesPerTick*4 || t === framesPerTick*6) { this.setState({ playerFrameX: -144 }); }
                if (t === framesPerTick*9) { this.setState({ playerFrameX: 0, playerFrameY: 0 }); }
                requestAnimationFrame(swing);
            }
            else { this.setState({ moving: false }, () => this.endTurn(index) )}
        }

        // animation parameters
        let t = 0;
        let animationLength = 109;
        let framesPerTick = 12;

        // mark as moving during animation to forbid input
        this.setState({ moving: true }, () => {
            if (this.state.bandits[index].map[0] < this.state.playerMap[0]) {
                this.setState({ playerDirection: -1}, () => requestAnimationFrame(swing));
            } else if (this.state.bandits[index].map[0] > this.state.playerMap[0]) {
                this.setState({ playerDirection: 1}, () => requestAnimationFrame(swing));
            } else { requestAnimationFrame(swing) }
        });
    }

    render() {
        return (
            <div id="page">
                <SignUp
                    display={this.state.signingIn}
                    createUser={this.state.createUser}
                    logInSuccess={this.logInSuccess}
                    hide={this.hideSignIn}
                >
                </SignUp>
                <div id="layout">
                    <div className="borders"></div>
                    <div id="map-area">
                        <Map
                            actionMenu={this.state.actionMenu}
                            bandits={this.state.bandits}
                            camera={this.state.camera}
                            canAttack={this.state.canAttack}
                            inBattle={this.state.inBattle}
                            moving={this.state.moving}
                            npcPos={this.state.npcPos}
                            playerDirection={this.state.playerDirection}
                            playerFrameX={this.state.playerFrameX}
                            playerFrameY={this.state.playerFrameY}
                            playerGrid={this.state.playerGrid}
                            playerPhase={this.state.playerPhase}
                            playerPos={this.state.playerPos}
                            playerRange={this.state.playerRange}
                            selection={this.state.selection}
                            targetable={this.state.targetable}
                            targeting={this.state.targeting}
                            tilePos={this.state.tilePos}

                            attack={this.attack}
                            attackAction={this.attackAction}
                            backAction={this.backAction}
                            checkAttack={this.checkAttack}
                            gridDisplay={this.gridDisplay}
                            inRange={this.inRange}
                            move={this.move}
                            outOfRange={this.outOfRange}
                            selectionFalse={this.selectionFalse}
                            selectionTrue={this.selectionTrue}
                            waitAction={this.waitAction}
                        ></Map>
                    </div>
                    <div className="borders"></div>
                    <div className="borders"></div>
                    <div id="info">
                        <User
                            loggedIn={this.state.loggedIn}
                            userName={this.state.userName}
                            signUp={() => this.signIn(true)}
                            logIn={() => this.signIn(false)}
                            save={() => this.save()}
                            load={() => this.load()}
                        ></User>
                        <Data></Data>
                    </div>
                    <div className="borders"></div>
                </div>
            </div>
        )
    }
};

export default Layout;