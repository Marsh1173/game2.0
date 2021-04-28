import { ClientPlayerAction } from "../object/newActors/clientActors/clientPlayer/clientPlayer";
import { PlayerJoin, PlayerLeave, ServerPlayerAction } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { AllInfo } from "./allinfo";

export interface PlayerLeavingMessage {
    type: "playerLeaving";
    id: number;
}

export interface InfoMessage {
    type: "info";
    info: AllInfo;
}

export type ServerMessage = PlayerLeave | PlayerJoin | InfoMessage | ServerPlayerAction;

export type ClientMessage = ClientPlayerAction;
