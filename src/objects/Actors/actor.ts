import { Config } from "../../config";
import { Size } from "../../size";
import { Vector } from "../../vector";
import { Platform } from "../platform";
import { attemptDie, attemptReceiveDamage, attemptReceiveHeal, die, receiveDamage, receiveHeal, resurrect } from "./actorCombatFunctions";
import { checkRectangleCollision, checkSideCollision, registerGravity } from "./actorSpatialFunctions";

var actorId: number = 0;
export function getNextActorId(): number {
    actorId++;
    return actorId;
}

export type ActorEffects = "isDead" | "isShielded";

export abstract class Actor {

    public size: Size = {"width": 0, "height": 0};
    protected maxHealth: number;
    protected deathTime: number = 5;
    protected fallingAcceleration: number = 3500;

    public momentum: Vector = {x: 0, y: 0};
    protected standing: boolean = false;

    protected actorEffects: Record<ActorEffects, number> = {
        isDead: 0,
        isShielded: 0,
    }

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
    ) {
        this.maxHealth = health + 0;
    }

    private updatePosition(elapsedTime: number) {
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;
    }
    //spatial functions
    protected registerGravity = registerGravity;
    protected checkSideCollision = checkSideCollision;
    protected checkRectangleCollision = checkRectangleCollision;

    //combat functions
    public attemptReceiveDamage = attemptReceiveDamage;
    protected receiveDamage = receiveDamage;
    public attemptReceiveHeal = attemptReceiveHeal;
    protected receiveHeal = receiveHeal;
    public attemptDie = attemptDie;
    protected die = die;
    protected resurrect = resurrect;

    protected update(elapsedTime: number) {

        this.updatePosition(elapsedTime);
    }
}