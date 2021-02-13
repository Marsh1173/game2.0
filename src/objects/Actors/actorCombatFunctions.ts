import { findDistance, Vector } from "../../vector";
import { Actor } from "./actor";

export function attemptReceiveDamage(this: Actor, quantity: number, id: number) {
    if(this.actorEffects.isDead === 0 &&
        this.actorEffects.isDead === 0) {
            this.receiveDamage(quantity, id)
    }
}
export function receiveDamage(this: Actor, quantity: number, id: number) {
    this.health -= quantity;
    if (this.health <= 0) {
        this.attemptDie();
    }
}

export function attemptReceiveHeal(this: Actor, quantity: number) {
    if(this.actorEffects.isDead === 0) this.receiveHeal(quantity);
}
export function receiveHeal(this: Actor, quantity: number) {
    this.health += quantity;
    if (this.health > this.maxHealth) {
        this.health = this.maxHealth;
    }
}

export function attemptDie(this: Actor) {
    this.die();
}
export function die(this: Actor) {
    this.actorEffects.isDead = this.deathTime + 0;
}

export function resurrect(this: Actor) {

}