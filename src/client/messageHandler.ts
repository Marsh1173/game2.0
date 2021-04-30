import { ServerMessage } from "../api/message";
import { Actor } from "../objects/Actors/actor";
import { assignDamageToActorArray, assignFocusUpdates, killActorArray } from "../objects/Actors/actorCombatFunctions";
import { ServerActorEffectMessage } from "../objects/Actors/effects";
import { PlayerActor } from "../objects/Actors/Players/playerActor";
import { ClientLavaFly } from "./clientActors/clientMobs/clientAirMobs/clientLavaFly";
import { ClientPlayerActor } from "./clientActors/clientPlayers/clientPlayerActor";
import { Game } from "./game";

export function handleMessage(this: Game, msg: ServerMessage) {
    let player;

    switch (msg.type) {
        case "serverPlayerAction":
            if (msg.playerId === this.id) return;
            player = this.players.find((player) => player.getActorId() === msg.playerId);
            if (player && player !== this.gamePlayer) {
                player.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                player.actionsNextFrame[msg.actionType] = msg.starting;
            }
            break;
        case "info":
            this.constructGame(msg.info);
            break;
        case "playerLeave":
            this.players = this.players.filter((player) => player.getActorId() !== msg.id);
            break;
        case "playerJoin":
            this.players.push(this.newClientPlayer(msg.playerInfo, this.gameRenderer.actorCtx));
            break;
        default:
            throw new Error("Unrecognized message from server");
    }
}
