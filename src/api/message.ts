import { ClientSwordMessage } from "../objects/clientControllers/controllers/swordController";
import { ClientPlayerAction, ClientPlayerClick, ClientPlayerFacingUpdate } from "../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { ServerDamageMessage, ServerHealMessage } from "../objects/newActors/serverActors/serverActor";
import { ServerSwordMessage } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverSword";
import {
    PlayerAllowChooseSpec,
    PlayerChangeFacing,
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
    | ServerHealMessage
    | PlayerChangeFacing
    | ServerSwordMessage;

export type ClientMessage = ClientPlayerAction | ClientPlayerClick | ClientSwordMessage | ClientPlayerFacingUpdate;
