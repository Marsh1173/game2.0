import { Game } from "../../../server/game";
import { Vector } from "../../../vector";
import { Projectile } from "../projectile";

export abstract class ServerProjectile extends Projectile {
    constructor(position: Vector, momentum: Vector, protected game: Game) {
        super(position, momentum);
    }

    public abstract serialize(): SerializedProjectile;
}

export interface SerializedProjectile {}
