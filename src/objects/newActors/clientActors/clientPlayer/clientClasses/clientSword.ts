import { Game } from "../../../../../client/game";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer";

export class ClientSword extends ClientPlayer {
    classType: ClassType = "sword";

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "swordPlayer");
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
        this.model.updateModel(elapsedTime);
    }
}
