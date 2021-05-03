import { ClientPlayerAction } from "../objects/newActors/clientActors/clientPlayer/clientPlayer";
import {
    PlayerAllowChooseSpec,
    PlayerChangeSpec,
    PlayerJoin,
    PlayerLeave,
    PlayerLevelSet,
    PlayerSetXP,
    ServerPlayerAction,
} from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { AllInfo } from "./allinfo";

export interface PlayerLeavingMessage {
    type: "playerLeaving";
    id: number;
}

export interface InfoMessage {
    type: "info";
    info: AllInfo;
}

export type ServerMessage =
    | PlayerLeave
    | PlayerJoin
    | InfoMessage
    | ServerPlayerAction
    | PlayerChangeSpec
    | PlayerLevelSet
    | PlayerSetXP
    | PlayerAllowChooseSpec;

export type ClientMessage = ClientPlayerAction;
