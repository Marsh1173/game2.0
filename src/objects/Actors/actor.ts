import e = require("express");
import { isMappedTypeNode, Map } from "typescript";
import { Config } from "../../config";
import { Size } from "../../size";
import { Vector } from "../../vector";
import { Platform } from "../platform";
import { attemptDie, attemptReceiveHeal, attemptReceiveKnockback, receiveHeal, receiveDamage, receiveKnockback } from "./actorCombatFunctions";
import {
    basicDistanceHitBox,
    basicIsInsideHitBox,
    basicOneDHitBox,
    basicThreeDHitBox,
    basicTwoDHitBox,
    checkRectangleCollision,
    checkSideCollision,
    registerGravity,
} from "./actorSpatialFunctions";
import { ActorEffect, ActorEffectName, EffectFinishCause } from "./effects";

var actorId: number = 0;
export function getNextActorId(): number {
    actorId++;
    return actorId;
}

export type ActorType = "player" | "lavafly";

export interface DamageArray {
    damage: Damage;
    lavaFlyArray: KnockbackVector[];
    playerActorArray: KnockbackVector[];
}
export interface Damage {
    quantity: number;
    id: number; // id of the person who did the damage
    team: number;
}
export interface KnockbackVector {
    id: number; // id of actor who will be knocked back
    angle: number;
    force: number;
}

export interface ActorUpdateStats {
    fallingSpeedPercentage: number;
    moveSpeedPercentage: number;
    ifRooted: boolean;
    ifStunned: boolean;
    ifSilenced: boolean;
    ifPlatformCollision: boolean;
    ifGroundCollision: boolean;
}

export abstract class Actor {
    protected fallingAcceleration: number = 3500;

    public momentum: Vector = { x: 0, y: 0 };
    public standing: boolean = false;
    protected lastHitById: number;
    protected lastHitByActorType: ActorType;

    protected actorEffectData = new Map<ActorEffectName, ActorEffect>();

    //refreshed every update, affected by actor effects
    //e.g., a slowing effect will update the moveSpeedPercentage
    public readonly updateStats: ActorUpdateStats = {
        fallingSpeedPercentage: 1,
        moveSpeedPercentage: 1,
        ifRooted: false,
        ifStunned: false,
        ifSilenced: false,
        ifPlatformCollision: true,
        ifGroundCollision: true,
    }; //include any changes in the resetUpdateStats()

    protected actorDeathData = {
        isDead: false,
        counter: 0,
    };

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
        this.lastHitById = this.id;
        this.lastHitByActorType = this.getActorType();
    }

    public abstract getActorType(): ActorType;
    public checkIfAlive(): boolean {
        return !this.actorDeathData.isDead;
    }
    public checkIfHealthIsZero(): boolean {
        return this.health <= 0;
    }
    public checkIfDeathTimerIsZero(): boolean {
        return this.actorDeathData.counter <= 0;
    }

    public getShape(): Vector[] {
        return [
            { x: this.position.x - this.size.width / 2, y: this.position.y - this.size.height / 2 },
            { x: this.position.x + this.size.width / 2, y: this.position.y - this.size.height / 2 },
            { x: this.position.x + this.size.width / 2, y: this.position.y + this.size.height / 2 },
            { x: this.position.x - this.size.width / 2, y: this.position.y + this.size.height / 2 },
        ];
    }

    protected updatePosition(elapsedTime: number) {
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;
    }
    //spatial functions
    protected attemptRegisterGravity(elapsedTime: number) {
        this.registerGravity(elapsedTime);
    }
    private registerGravity = registerGravity;
    protected checkSideCollision = checkSideCollision;
    protected attemptCheckRectangleCollision(elapsedTime: number, platforms: Platform[]) {
        if (this.updateStats.ifPlatformCollision) {
            platforms.forEach((platform) => {
                this.checkRectangleCollision(elapsedTime, platform);
            });
        }
    }
    private checkRectangleCollision = checkRectangleCollision;
    //ground collision
    //momentum dampening if we even include it

    //effects
    protected resetUpdateStats() {
        this.updateStats.fallingSpeedPercentage = 1;
        this.updateStats.moveSpeedPercentage = 1;
        this.updateStats.ifRooted = false;
        this.updateStats.ifStunned = false;
        this.updateStats.ifSilenced = false;
        this.updateStats.ifPlatformCollision = true;
        this.updateStats.ifGroundCollision = true;
    }
    protected updateEffects(elapsedTime: number) {
        this.actorEffectData.forEach((value, key) => {
            if (value.updateFunction) value.updateFunction(this, elapsedTime, value, this.updateStats);
        });
    }
    protected abstract createEffect(effectName: ActorEffectName, originActorType: ActorType, originId: number): ActorEffect;
    public giveEffect(originActorType: ActorType, originId: number, effectName: ActorEffectName) {
        console.log("adding effect " + effectName + " to " + this.id);
        if (this.actorEffectData.has(effectName)) console.log("already has that effect");

        this.actorEffectData.set(effectName, this.createEffect(effectName, originActorType, originId));

        let effect = this.actorEffectData.get(effectName);
        if (effect && effect.startFunction) {
            effect.startFunction(this);
        }
    }
    public clearEffect(effectName: ActorEffectName, finishCause: EffectFinishCause) {
        console.log("clearing effect " + effectName + " from " + this.id + (finishCause === "forced" ? " forcibly" : " naturally"));
        if (finishCause === "timerFinish") {
            let effect = this.actorEffectData.get(effectName);
            if (effect && effect.endFunction) {
                effect.endFunction(this);
            }
        }
        if (!this.actorEffectData.delete(effectName)) {
            console.log("does not have that effect");
        }
    }
    public clearAllEffects() {
        this.actorEffectData.forEach((value, key) => {
            this.clearEffect(key, "forced");
        });
    }

    //combat functions

    public setLastHitBy(id: number, actorType: ActorType) {
        this.lastHitById = id;
        //this.lastHitByActorType: actorType;
    }
    public getLastHitBy = (): { id: number; actorType: ActorType } => {
        return {
            id: this.lastHitById,
            actorType: this.lastHitByActorType,
        };
    };

    public attemptReceiveDamage(quantity: number, id: number) {
        if (this.checkIfAlive()) {
            this.receiveDamage(quantity, id);
        }
    }
    protected receiveDamage = receiveDamage;

    public attemptDie = attemptDie;
    protected die() {
        //this.cancelActions()
        this.clearAllEffects();
        this.actorDeathData.isDead = true;
        this.actorDeathData.counter = this.deathTime;
    }

    protected deathTimerReachZero() {}

    public attemptReceiveHeal = attemptReceiveHeal;
    protected receiveHeal = receiveHeal;

    public attemptReceiveKnockback = attemptReceiveKnockback;
    protected receiveKnockback = receiveKnockback;

    //hit box registering functions
    public oneDHitBox = basicOneDHitBox;
    public twoDHitBox = basicTwoDHitBox;
    public threeDHitBox = basicThreeDHitBox;
    public distanceHitBox = basicDistanceHitBox;
    public isInsideHitBox = basicIsInsideHitBox;

    protected update(elapsedTime: number) {}
}
