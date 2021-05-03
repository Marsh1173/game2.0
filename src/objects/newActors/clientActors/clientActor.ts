import { Vector } from "../../../vector";
import { ClientFloor } from "../../terrain/floor/clientFloor";
import { Actor, ActorType } from "../actor";
import { Model } from "./models/model";

export abstract class ClientActor extends Actor {
    protected abstract model: Model;

    constructor(actorType: ActorType, id: number, position: Vector, momentum: Vector, health: number, maxHealth: number, floor: ClientFloor) {
        super(actorType, id, position, momentum, health, maxHealth, floor);
    }

    public render() {
        this.model.render();
    }
    public renderHealth() {
        this.model.renderHealth();
    }

    public updatePositionAndMomentumFromServer(position: Vector, momentum: Vector) {
        this.model.processPositionUpdateDifference({ x: position.x - this.position.x, y: position.y - this.position.y });

        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    }
}
