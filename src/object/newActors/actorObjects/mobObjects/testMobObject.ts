import { Vector } from "../../../../vector";
import { Floor } from "../../../terrain/floor/floor";
import { Actor } from "../../actor";
import { defaultActorConfig } from "../../actorConfig";
import { ActorObject } from "../actorObject";

export class TestMobObject extends ActorObject {
    constructor(baseActor: Actor, position: Vector, momentum: Vector, floor: Floor) {
        super(baseActor, position, momentum, { width: defaultActorConfig.playerSize.width, height: defaultActorConfig.playerSize.height }, 5, floor);
    }

    public update(elapsedTime: number) {}
}
