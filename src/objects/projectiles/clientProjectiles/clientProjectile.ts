import { Game } from "../../../client/game";
import { Vector } from "../../../vector";
import { Projectile } from "../projectile";

export abstract class ClientProjectile extends Projectile {
    constructor(position: Vector, momentum: Vector, protected game: Game) {
        super(position, momentum);
    }

    public abstract render(): void;
}
