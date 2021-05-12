import { Vector } from "../../../vector";
import { Projectile } from "../projectile";

export abstract class ProjectileObject {
    constructor(protected projectile: Projectile, protected position: Vector, protected momentum: Vector) {}

    protected finalPositionUpdate(elapsedTime: number) {
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;
    }

    protected abstract update(elapsedTime: number): void;
}
