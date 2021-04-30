import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClientPlayer } from "../clientPlayer";

export class ClientSword extends ClientPlayer {
    constructor(
        id: number,
        position: Vector,
        momentum: Vector,
        health: number,
        ctx: CanvasRenderingContext2D,
        floor: ClientFloor,
        doodads: ClientDoodad[],
        color: string,
        name: string,
    ) {
        super(id, position, momentum, health, ctx, floor, doodads, color, name);
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
        this.model.updateTargetPosition(elapsedTime);
    }
}
