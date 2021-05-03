import { Vector } from "../../../../../vector";
import { ServerDoodad } from "../../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../../terrain/floor/serverFloor";
import { ClassType, ServerPlayer } from "../serverPlayer";

export class ServerDaggers extends ServerPlayer {
    classType: ClassType = "daggers";

    constructor(id: number, floor: ServerFloor, doodads: ServerDoodad[], color: string, name: string, level: number, spec: number) {
        super(id, floor, doodads, color, name, level, spec);
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
    }
}
