import { Config } from "../../../config";
import { PlayerActionTypes, PlayerActor } from "../../../objects/Actors/Players/playerActor";
import { Platform } from "../../../objects/platform";
import { serialize, SerializedPlayerActor } from "../../../serialized/playerActor";
import { Vector } from "../../../vector";

export interface NewPlayerActor {
    type: "newPlayerActor";
    id: number;
    info: SerializedPlayerActor;
}

export class ServerPlayerActor extends PlayerActor {


    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        protected color: string,
        name: string,
    ) {
        super(config, id, position, team, color, name);

    }

    public serialize = serialize;

    public updateServerPlayerActor(elapsedTime: number, platforms: Platform[], players: PlayerActor[]) {


        super.updatePlayerActor(elapsedTime, platforms, players);
    }
}



export interface ServerPlayerJump {
    type: "serverPlayerJump",
    id: number,
    position: Vector,
    momentum: Vector,
}

export interface ServerPlayerMoveRight {
    type: "serverPlayerMoveRight",
    id: number,
    position: Vector,
    momentum: Vector,
}

export interface ServerPlayerMoveLeft {
    type: "serverPlayerMoveLeft",
    id: number,
    position: Vector,
    momentum: Vector,
}

export interface ServerPlayerStopMoveRight {
    type: "serverPlayerStopMoveRight",
    id: number,
    position: Vector,
    momentum: Vector,
}

export interface ServerPlayerStopMoveLeft {
    type: "serverPlayerStopMoveLeft",
    id: number,
    position: Vector,
    momentum: Vector,
}