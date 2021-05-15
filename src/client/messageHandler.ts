import { ServerMessage } from "../api/message";
import { ActorType } from "../objects/newActors/actor";
import { ClientActor } from "../objects/newActors/clientActors/clientActor";
import { Game } from "./game";

export function handleMessage(this: Game, msg: ServerMessage) {
    let player;

    switch (msg.type) {
        case "serverPlayerAction":
            if (msg.playerId === this.id) return;
            player = this.globalClientActors.players.find((player) => player.getActorId() === msg.playerId);
            if (player) {
                player.updatePositionAndMomentumFromServer(msg.position, msg.momentum);
                player.moveActionsNextFrame[msg.actionType] = msg.starting;
            }
            break;
        case "info":
            this.constructGame(msg.info);
            break;
        case "playerLeave":
            this.playerLeave(msg.id);
            break;
        case "playerJoin":
            this.newClientPlayer(msg.playerInfo);
            break;
        case "playerAllowChooseSpec":
        //open window

        case "playerChangeSpec":
            //player set level
            //
            break;
        case "playerLevelSet":
            //players set level
            //particles
            //this.controller.setRequiredXP
            break;
        case "playerSetXP":
            //this.controller.setXP
            break;
        case "serverHealMessage":
            let healedActor: ClientActor = this.findActor(msg.actorId, msg.actorType);
            this.particleSystem.addSparks(healedActor.position);
            healedActor.registerHeal(msg.newHealth);
            break;
        case "serverDamageMessage":
            let damagedActor: ClientActor = this.findActor(msg.actorId, msg.actorType);
            let damageOriginActor: ClientActor = this.findActor(msg.originId, msg.originType);
            damagedActor.registerDamage(damageOriginActor, msg.newHealth, msg.knockback, msg.translationData);
            break;
        case "playerChangeFacing":
            if (msg.id === this.id) return;
            player = this.globalClientActors.players.find((player) => player.getActorId() === msg.id);
            if (player) {
                player.updateFacingFromServer(msg.facingRight);
            }
            break;
        case "serverSwordMessage":
            if (msg.originId === this.id) return;
            let swordPlayer = this.globalClientActors.swordPlayers.find((player) => player.getActorId() === msg.originId);
            if (swordPlayer) {
                if (msg.msg.starting) swordPlayer.performClientAbility[msg.msg.ability](msg.msg.mousePos);
                else swordPlayer.releaseClientAbility[msg.msg.ability]();
            }

            break;
        default:
            throw new Error("Unrecognized message from server");
    }
}

export function findActor(this: Game, actorId: number, actorType: ActorType): ClientActor {
    switch (actorType) {
        case "daggersPlayer":
            let daggerPlayer = this.globalClientActors.daggerPlayers.find((player) => player.getActorId() === actorId);
            if (daggerPlayer) return daggerPlayer;
            break;
        case "swordPlayer":
            let swordPlayer = this.globalClientActors.swordPlayers.find((player) => player.getActorId() === actorId);
            if (swordPlayer) return swordPlayer;
            break;
        case "hammerPlayer":
            let hammerPlayer = this.globalClientActors.hammerPlayers.find((player) => player.getActorId() === actorId);
            if (hammerPlayer) return hammerPlayer;
            break;
        default:
            throw new Error("Unknown actor type in messageHandler's findActor");
    }
    throw new Error("Actor " + actorId + " " + actorType + " not found in messageHandler's findActor");
}
