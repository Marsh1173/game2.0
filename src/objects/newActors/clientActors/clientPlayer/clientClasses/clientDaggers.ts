import { Game } from "../../../../../client/game";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer";

export class ClientDaggers extends ClientPlayer {
    classType: ClassType = "daggers";

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "daggersPlayer");
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.moveActionsNextFrame.moveLeft || this.moveActionsNextFrame.moveRight);
        this.model.updateModel(elapsedTime);
    }
}
