import { Vector } from "../../vector";
import { Floor } from "../terrain/floor/floor";
import { ActorObject } from "./actorObjects/actorObject";
import { TranslationName } from "./actorObjects/translations";

export type ActorType = "clientTestMob" | "clientPlayer" | "serverTestMob" | "serverPlayer";

export abstract class Actor {
    protected abstract actorObject: ActorObject;

    constructor(
        protected actorType: ActorType,
        protected id: number,
        public readonly position: Vector,
        public readonly momentum: Vector,
        protected health: number,
        protected maxHealth: number,
        protected floor: Floor,
    ) {}

    public getActorType(): ActorType {
        return this.actorType;
    }
    public getActorId(): number {
        return this.id;
    }
    public startTranslation(angle: number, translationName: TranslationName) {
        this.actorObject.startTranslation(angle, translationName);
    }
    public updatePositionAndMomentum(momentum: Vector, position: Vector) {
        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    }

    public abstract update(elapsedTime: number): void;
}
