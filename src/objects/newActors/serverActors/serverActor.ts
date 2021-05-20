import { Game } from "../../../server/game";
import { Vector } from "../../../vector";
import { ServerFloor } from "../../terrain/floor/serverFloor";
import { Actor, ActorType } from "../actor";
import { ActorObject } from "../actorObjects/actorObject";
import { TranslationName } from "../actorObjects/translations";
import { SerializedMob } from "./serverMobs/serverMob";
import { SerializedPlayer } from "./serverPlayer/serverPlayer";

export function getStartingHealth(actorType: ActorType, level: number = 0): number {
    switch (actorType) {
        case "testMob":
            return 50;
        case "daggersPlayer":
            return 100;
        case "swordPlayer":
            return 100;
        case "hammerPlayer":
            if (level >= 6) {
                return 130;
            }
            return 100;
    }
}

export abstract class ServerActor extends Actor {
    protected lastHitByActor: ServerActor;

    constructor(protected readonly game: Game, actorType: ActorType, id: number, position: Vector, healthInfo: { health: number; maxHealth: number }) {
        super(actorType, id, position, { x: 0, y: 0 }, healthInfo);
        this.lastHitByActor = this;
    }

    public abstract serialize(): SerializedPlayer | SerializedMob;
    protected abstract getStartingHealth(): number;

    public registerDamage(
        originActor: ServerActor,
        quantity: number,
        knockback: Vector | undefined,
        translationData: { name: TranslationName; angle: number } | undefined,
    ): { ifKilled: boolean; damageDealt: number } {
        this.healthInfo.health = Math.max(this.healthInfo.health - quantity, 0);
        originActor.registerDamageDone(quantity);

        if (this.healthInfo.health === 0) {
            this.registerHeal(this.healthInfo.maxHealth); // DEBUGGING
            return { ifKilled: true, damageDealt: quantity };
        } else {
            if (translationData) this.actorObject.startTranslation(translationData.angle, translationData.name);
            if (knockback) this.registerKnockback(knockback);
            Game.broadcastMessage({
                type: "serverDamageMessage",
                actorId: this.id,
                actorType: this.actorType,
                originId: originActor.id,
                originType: originActor.actorType,
                newHealth: this.healthInfo.health,
                knockback,
                translationData,
                position: this.position,
                momentum: this.momentum,
            });
            return { ifKilled: false, damageDealt: quantity };
        }
    }

    public registerHeal(quantity: number): void {
        this.healthInfo.health = Math.min(this.healthInfo.health + quantity, this.healthInfo.maxHealth);
        Game.broadcastMessage({
            type: "serverHealMessage",
            actorId: this.id,
            actorType: this.actorType,
            newHealth: this.healthInfo.health,
        });
    }
}

export interface ServerDamageMessage {
    type: "serverDamageMessage";
    actorId: number;
    actorType: ActorType;
    originId: number;
    originType: ActorType;
    newHealth: number;
    knockback: Vector | undefined;
    translationData: { name: TranslationName; angle: number } | undefined;
    position: Vector;
    momentum: Vector;
}

export interface ServerHealMessage {
    type: "serverHealMessage";
    actorId: number;
    actorType: ActorType;
    newHealth: number;
}
