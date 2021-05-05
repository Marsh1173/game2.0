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
    ): boolean;

    public abstract registerHeal(quantity: number): void;

    //protected abstract registerDeath(): void;

    public registerDamageDone(quantity: number): void {}
    public registerKillDone(): void {}
}
