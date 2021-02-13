import { PlayerActionTypes } from "../objects/Actors/Players/playerActor";
import { SerializedPlayer } from "../serialized/player";
import { ChangeServerLavaFlyTarget, NewLavaFly } from "../server/serverActors/serverMobs/serverAirMobs/serverLavaFly";
import { Vector } from "../vector";
import { AllInfo } from "./allinfo";

export interface PlayerInfoMessage {
    type: "playerInfo";
    id: number;
    info: SerializedPlayer;
}

export interface PlayerLeavingMessage {
    type: "playerLeaving";
    id: number;
}

export interface InfoMessage {
    type: "info";
    info: AllInfo;
}

export interface ServerPlayerActions {
    type: "serverPlayerActions",
    id: number,
    moveRight: boolean,
    moveLeft: boolean,
    jump: boolean,

    focusPosition: Vector;
    position: Vector;
    momentum: Vector;
    health: number;
}

export type ServerMessage = PlayerInfoMessage |
    PlayerLeavingMessage |
    InfoMessage |
    ServerPlayerActions |
    ChangeServerLavaFlyTarget | NewLavaFly;

export interface ClientPlayerActions {
    type: "clientPlayerActions",
    id: number,
    moveRight: boolean,
    moveLeft: boolean,
    jump: boolean,
    
    focusPosition: Vector,
    position: Vector,
    momentum: Vector;
    health: number,
}

export interface ActionMessage { //NO LONGER USED
    type: "action";
    actionType: PlayerActionTypes;
    id: number;
}

export type ClientMessage = ActionMessage | ClientPlayerActions;
