import { PlayerActions } from "../objects/player";
import { SerializedPlayer } from "../serialized/player";
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
    ServerPlayerActions;

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
    actionType: PlayerActions;
    id: number;
}

export type ClientMessage = ActionMessage | ClientPlayerActions;
