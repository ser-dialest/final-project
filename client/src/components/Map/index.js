import React from  "react";
import Tile from "../Tile";
import ActionMenu from "../ActionMenu"
import Player from "../Player";
import Enemy from "../Enemy";
import map from "./mapArray";
import playerRange from "./tiles/PlayerRange3.png";
import target from "./tiles/Target3.png";
import "./style.css";
// import aStar from "easy-astar";

function Map(props) {

    const width = 19;
    const height = 13;
    const viewable = [];
    let actionMenu = "none";
    let attackButton = "none";

    // Block that defines every tile in the map
    for (let x = 0;  x < width; x++) {
        for (let y = 0; y < height; y++) {
            let mapX = x + props.camera[0] - ((width - 1) / 2);
            let mapY = y + props.camera[1] - ((height - 1) /2);
            let id = "x" + (x + 1) + "y" + (y + 1);
            let clickFunc;
            let imageSource = map[mapX-1][mapY-1].image;
            // Only accept commands if we aren't moving
            if (!props.moving) {
                // Free move as not in battle
                if (!props.inBattle) {
                    clickFunc = () => props.move(mapX, mapY);
                } else if (props.playerPhase) {
                    // this is the player's turn
                    // if no one has been selected, selecting is all you can do
                    if (!props.selection) {
                        if ((x+1) === props.playerGrid[0] && (y+1) === props.playerGrid[1]) { 
                            clickFunc = () => props.selectionTrue()
                        }
                    } else {
                        // When you're choosing where to go
                        if (!props.actionMenu) {
                            // When you're targeting an enemy
                            if (props.targeting) {
                                props.targetable.forEach(index => {
                                    if (props.inRange([mapX, mapY], [props.bandits[index].map])) {
                                        imageSource = target;
                                        clickFunc = () => props.attack(index);
                                    } else {
                                        clickFunc = () => props.outOfRange();
                                    }
                                });
                            } else if (props.inRange([mapX, mapY], props.playerRange)) {
                                imageSource = playerRange;
                                clickFunc = () => props.checkAttack(mapX, mapY);
                            } else { 
                                clickFunc = () => props.selectionFalse();
                            }
                        } else {
                            // The action menu is up (Attack Wait Back)
                            actionMenu = "flex";
                            if (props.canAttack) { attackButton = "inline"};
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
                    top={props.tilePos[1]}
                    left={props.tilePos[0]}
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
    props.bandits.forEach( each => {
        i++;
        enemies.push(
            <Enemy
                gridDisplay={props.gridDisplay(each.map)}
                top={props.npcPos[1]}
                left={props.npcPos[0]}
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
    if (props.playerDirection === -1) { positionModifier = -24}

    return (
        <div id="map">
            {viewable}
            <Player
                playerGrid={props.playerGrid}
                top={props.playerPos[1]}
                left={props.playerPos[0] + positionModifier}
                frameX={props.playerFrameX}
                frameY={props.playerFrameY}
                direction={props.playerDirection}
            >
            </Player>
            {enemies}
            <ActionMenu
                display={actionMenu}
                attackButton={attackButton}
                attack={() => props.attackAction()}
                wait={() => props.waitAction()}
                back={() => props.backAction()}
            ></ActionMenu>
        </div>
    )
};

export default Map;