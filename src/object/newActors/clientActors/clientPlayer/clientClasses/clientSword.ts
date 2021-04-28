import { Vector } from "../../../../../vector";
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
        color: string,
        name: string,
    ) {
        super(id, position, momentum, health, ctx, floor, color, name);
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
        this.model.updateTargetPosition(elapsedTime);
    }
}
