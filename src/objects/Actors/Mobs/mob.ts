import { Config } from "../../../config";
import { Size } from "../../../size";
import { Vector } from "../../../vector";
import { Actor } from "../actor";
import { PlayerActor } from "../Players/playerActor";

export abstract class Mob extends Actor {
    protected homePosition: Vector;
    public targetPlayer: PlayerActor | undefined = undefined;

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        protected health: number,
        public maxHealth: number,
        public deathTime: number,
        protected mass: number,
        public size: Size,
    ) {
        super(config, id, position, team, health, maxHealth, deathTime, mass, size);

        //sets home position to their spawnpoint
        this.homePosition = { x: this.position.x + 0, y: this.position.y + 0 };
    }
}
