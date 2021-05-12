import { ClientPlayerAction, ClientPlayerClick } from "../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { ClientSwordMessage } from "../objects/newActors/clientActors/clientPlayer/playerClasses/playerSword";
import { ServerDamageMessage, ServerHealMessage } from "../objects/newActors/serverActors/serverActor";
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
    | PlayerAllowChooseSpec
    | ServerDamageMessage
    | ServerHealMessage;

export type ClientMessage = ClientPlayerAction | ClientPlayerClick | ClientSwordMessage;
