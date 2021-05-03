import { ServerMessage } from "../api/message";
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
        default:
            throw new Error("Unrecognized message from server");
    }
}
