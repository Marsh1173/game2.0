import { Vector } from "../../vector";
import { ProjectileObject } from "./projectileObjects/projectileObject";

export abstract class Projectile {
    protected abstract projectileObject: ProjectileObject;

    constructor(protected position: Vector, protected momentum: Vector) {}

    public abstract update(elapsedTime: number): void;
}
