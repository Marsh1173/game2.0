import { ClientDaggersMessage } from "../objects/clientControllers/controllers/daggersController";
import { ClientHammerMessage } from "../objects/clientControllers/controllers/hammerController";
import { ClientSwordMessage } from "../objects/clientControllers/controllers/swordController";
import { ClientPlayerAction, ClientPlayerClick, ClientPlayerFacingUpdate } from "../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { ServerDamageMessage, ServerHealMessage, ServerStartTranslation } from "../objects/newActors/serverActors/serverActor";
import { ServerDaggersMessage } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverDaggers";
import { ServerHammerMessage } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverHammer";
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
import { ServerDebugMessage } from "../server/serverDebugging";
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
    | ServerStartTranslation
    | ServerSwordMessage
    | ServerDaggersMessage
    | ServerHammerMessage
    | ServerDebugMessage;

export type ClientMessage = ClientPlayerAction | ClientPlayerClick | ClientSwordMessage | ClientDaggersMessage | ClientHammerMessage | ClientPlayerFacingUpdate;
