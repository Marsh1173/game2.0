import { Vector } from "../../../vector";
import { ServerFloor } from "../../terrain/floor/serverFloor";
import { Actor, ActorType } from "../actor";
import { ActorObject } from "../actorObjects/actorObject";
import { SerializedMob } from "./serverMobs/serverMob";
import { SerializedPlayer } from "./serverPlayer/serverPlayer";

export abstract class ServerActor extends Actor {
    constructor(actorType: ActorType, id: number, position: Vector, maxHealth: number, floor: ServerFloor) {
        super(actorType, id, position, { x: 0, y: 0 }, maxHealth, maxHealth, floor);
    }

    public abstract serialize(): SerializedPlayer | SerializedMob;
}
