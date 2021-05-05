import { GlobalObjects } from "../../../../client/game";
import { Shape, Vector } from "../../../../vector";
import { Doodad } from "../../../terrain/doodads/doodad";
import { Floor } from "../../../terrain/floor/floor";
import { Actor } from "../../actor";
import { defaultActorConfig } from "../../actorConfig";
import { ActorObject } from "../actorObject";
import { playerCrouchingShape } from "../playerObject";

export class TestMobObject extends ActorObject {
    constructor(globalObjects: GlobalObjects, baseActor: Actor, position: Vector, momentum: Vector) {
        super(globalObjects, baseActor, position, momentum, { width: defaultActorConfig.playerSize.width, height: defaultActorConfig.playerSize.height }, 5);
    }

    public getGlobalShape(): Shape {
        return playerCrouchingShape;
    }

    public getCollisionRange(): number {
        throw new Error("test mob object collision range has not been decided yet");
    }
    public registerGroundAngle(angle: number, standing: boolean): void {
        return;
    }

    public update(elapsedTime: number) {}
}
