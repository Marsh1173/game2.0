import { Vector } from "../../vector";
import { Floor } from "../terrain/floor/floor";
import { ActorObject } from "./actorObjects/actorObject";
import { TranslationName } from "./actorObjects/translations";
import { ServerActor } from "./serverActors/serverActor";

export type ActorType = "testMob" | "daggersPlayer" | "swordPlayer" | "hammerPlayer";
export type SwordSpec = "heavy" | "light";
export type DaggersSpec = "outlaw" | "assassination";
export type HammerSpec = "warden" | "paladin";

export abstract class Actor {
    protected abstract actorObject: ActorObject;
    protected abstract lastHitByActor: Actor;

    constructor(
        protected actorType: ActorType,
        protected id: number,
        public readonly position: Vector,
        public readonly momentum: Vector,
        protected healthInfo: { health: number; maxHealth: number },
    ) {}

    public getCollisionRange(): number {
        return this.actorObject.getCollisionRange();
    }

    public getActorType(): ActorType {
        return this.actorType;
    }
    public getActorId(): number {
        return this.id;
    }
    public getMaxHealth(): number {
        return this.healthInfo.maxHealth;
    }
    public getHealth(): number {
        return this.healthInfo.health;
    }
    public getHealthInfo(): { health: number; maxHealth: number } {
        return this.healthInfo;
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

    public abstract registerDamage(
        originActor: Actor,
        quantity: number,
        knockback: Vector | undefined,
        translationData: { name: TranslationName; angle: number } | undefined,
    ): { ifKilled: boolean; damageDealt: number };

    public abstract registerHeal(quantity: number): void;

    //protected abstract registerDeath(): void;

    public registerDamageDone(quantity: number): void {}
    public registerKillDone(): void {}

    public registerKnockback(force: Vector) {
        this.actorObject.registerKnockback(force);
    }

    /**
     * @param p1 start point of the line.
     * @param p2 end point of the line.
     * @returns returns true if the line intersects with the shape.
     */
    public checkIfCollidesWithLine(p1: Vector, p2: Vector): boolean {
        return this.actorObject.checkIfCollidesWithLine(p1, p2);
    }

    /**
     * @param largeShape Shape of the object in question.
     * @returns true if any point of this actorObject falls inside the object in question.
     */
    public ifInsideLargerShape(largeShape: Vector[]): boolean {
        if (this.actorObject.ifInsideLargerShape(largeShape)) {
            return true;
        }
        return false;
    }
    /**
     * @param smallShape Shape of the object in question.
     * @returns true if any point of the object in question falls inside this actorObject.
     */
    public ifInsideSmallerShape(smallShape: Vector[]): boolean {
        return this.actorObject.ifInsideSmallerShape(smallShape);
    }
}
