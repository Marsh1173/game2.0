import { Vector } from "../../../../vector";
import { ServerDoodad } from "../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../terrain/floor/serverFloor";
import { TestMobObject } from "../../actorObjects/mobObjects/testMobObject";
import { ServerActor } from "../serverActor";

export type SerializedMob = SerializedTestMob;

export class ServerMob extends ServerActor {
    actorObject: TestMobObject;

    constructor(id: number, floor: ServerFloor, doodads: ServerDoodad[]) {
        super("serverTestMob", id, { x: 700, y: 500 }, 10, floor);
        this.actorObject = new TestMobObject(this, this.position, this.momentum, this.floor, doodads);
    }

    update(elapsedTime: number) {
        this.actorObject.update(elapsedTime);
    }

    serialize(): SerializedTestMob {
        return {
            id: this.id,
            position: this.position,
            momentum: this.momentum,
            health: this.health,
        };
    }
}

export interface SerializedTestMob {
    id: number;
    position: Vector;
    momentum: Vector;
    health: number;
}
