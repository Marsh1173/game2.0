import { ClientPlayerJump, ClientPlayerMoveLeft, ClientPlayerMoveRight, ClientPlayerStopMoveLeft, ClientPlayerStopMoveRight } from "../client/clientActors/clientPlayers/ClientPlayerActorActionFunctions";
import { PlayerActionTypes } from "../objects/Actors/Players/playerActor";
import { SerializedPlayer } from "../serialized/player";
import { ChangeServerLavaFlyTarget, NewLavaFly } from "../server/serverActors/serverMobs/serverAirMobs/serverLavaFly";
import { NewPlayerActor, ServerPlayerJump, ServerPlayerMoveLeft, ServerPlayerMoveRight, ServerPlayerStopMoveLeft, ServerPlayerStopMoveRight } from "../server/serverActors/serverPlayers/serverPlayerActor";
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

export type ServerMessage = PlayerInfoMessage |
    PlayerLeavingMessage |
    InfoMessage |
    ChangeServerLavaFlyTarget | NewLavaFly |
    NewPlayerActor |
    ServerPlayerJump |
    ServerPlayerMoveLeft | ServerPlayerStopMoveLeft |
    ServerPlayerMoveRight | ServerPlayerStopMoveRight;


export interface ActionMessage { //NO LONGER USED
    type: "action";
    actionType: PlayerActionTypes;
    id: number;
}

export type ClientMessage = ActionMessage |
    ClientPlayerJump |
    ClientPlayerMoveLeft | ClientPlayerStopMoveLeft |
    ClientPlayerMoveRight | ClientPlayerStopMoveRight;
