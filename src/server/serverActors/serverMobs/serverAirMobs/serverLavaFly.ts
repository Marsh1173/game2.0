import { createTextChangeRange } from "typescript";
import { SingleEntryPlugin } from "webpack";
import { Config } from "../../../../config";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { findDistance, Vector } from "../../../../vector";
import { Game } from "../../../game";
import { ServerPlayer } from "../../../player";

export interface NewLavaFly {
    type: "newLavaFly";
    id: number;
    position: Vector;
    team: number;
}
export interface ChangeServerLavaFlyTarget {
    type: "changeServerLavaFlyTarget";
    id: number;
    position: Vector;
    momentum: Vector,
    playerid: number | undefined;
}


export class ServerLavaFly extends LavaFly {

    private updateTargetCounter: number = 0;
    private updateTargetCooldown: number = 0.3 + Math.random() / 2;

    
    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
        public momentum: Vector = {x: 0, y: 0},
    ) {
        super(config, id, position, team, health, momentum);

    }

    private updateTargetPlayer(players: ServerPlayer[]) {

        let ifChanged: boolean = false;
        
        if(this.targetPlayer && findDistance(this.position, this.targetPlayer.position) > 400) { // deaggro if they're out of range
            this.targetPlayer = undefined;
            ifChanged = true;
        }

        for (let i: number = 0; i < players.length; i++) {
            if((this.targetPlayer && players[i].id == this.targetPlayer.id) || findDistance(this.position, players[i].position) > 400) {
                continue;
            }
            if (this.targetPlayer == undefined) {
                this.targetPlayer = players[i];
                ifChanged = true;
            } else if(findDistance(this.position, players[i].position) < findDistance(this.position, this.targetPlayer.position)) {
                this.targetPlayer = players[i];
                ifChanged = true;
            }
        }

        
        if(ifChanged) {
            if(this.targetPlayer) {
                Game.broadcastMessage({
                    type: "changeServerLavaFlyTarget",
                    id: this.id,
                    position: this.position,
                    momentum: this.momentum,
                    playerid: this.targetPlayer.id,
                });
            } else {
                Game.broadcastMessage({
                    type: "changeServerLavaFlyTarget",
                    id: this.id,
                    position: this.position,
                    momentum: this.momentum,
                    playerid: undefined,
                });
            }
        }

    }
    
    public serverLavaFlyUpdate(elapsedTime: number, players: ServerPlayer[], lavaFlies: ServerLavaFly[]) {

        this.updateTargetCounter += elapsedTime;
        if (this.updateTargetCounter > this.updateTargetCooldown) {
            this.updateTargetPlayer(players);
            this.updateTargetCounter = 0;
        }


        super.lavaFlyUpdate(elapsedTime, lavaFlies);
    }

}