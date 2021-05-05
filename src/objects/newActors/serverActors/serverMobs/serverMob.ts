import { Game } from "../../../../server/game";
import { Vector } from "../../../../vector";
import { ServerDoodad } from "../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../terrain/floor/serverFloor";
import { TestMobObject } from "../../actorObjects/mobObjects/testMobObject";
import { getStartingHealth, ServerActor } from "../serverActor";

export type SerializedMob = SerializedTestMob;

export class ServerMob extends ServerActor {
    actorObject: TestMobObject;

    constructor(game: Game, id: number) {
        super(game, "testMob", id, { x: 700, y: 500 }, { health: getStartingHealth("testMob"), maxHealth: getStartingHealth("testMob") });
        this.actorObject = new TestMobObject(game.getGlobalObjects(), this, this.position, this.momentum);
    }
    getStartingHealth(): number {
        return 50;
    }

    update(elapsedTime: number) {
        this.actorObject.update(elapsedTime);
    }

    serialize(): SerializedTestMob {
        return {
            id: this.id,
            position: this.position,
            momentum: this.momentum,
            healthInfo: this.healthInfo,
        };
    }
}

export interface SerializedTestMob {
    id: number;
    position: Vector;
    momentum: Vector;
    healthInfo: { health: number; maxHealth: number };
}
