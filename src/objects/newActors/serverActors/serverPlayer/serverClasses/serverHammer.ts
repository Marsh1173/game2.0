import { Game } from "../../../../../server/game";
import { Vector } from "../../../../../vector";
import { ServerDoodad } from "../../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../../terrain/floor/serverFloor";
import { defaultActorConfig } from "../../../actorConfig";
import { ClassType, ServerPlayer } from "../serverPlayer";

export class ServerHammer extends ServerPlayer {
    classType: ClassType = "hammer";

    constructor(game: Game, id: number, color: string, name: string, level: number, spec: number) {
        super(game, id, color, name, level, spec, "hammerPlayer");
    }

    updateInput(elapsedTime: number) {}

    getStartingHealth(): number {
        if (this.level >= 6) {
            return defaultActorConfig.playerMaxHealth + 30;
        } else {
            return defaultActorConfig.playerMaxHealth;
        }
    }

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
    }
}
