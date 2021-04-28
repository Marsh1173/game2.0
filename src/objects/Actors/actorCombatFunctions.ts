import { findAngle } from "../../findAngle";
import { findDistance, Vector } from "../../vector";
import { Actor, Damage, KnockbackVector } from "./actor";
import { PlayerActor } from "./Players/playerActor";

export function attemptReceiveKnockback(this: Actor, forceVector: Vector) {
    this.receiveKnockback(forceVector);
}

export function receiveKnockback(this: Actor, forceVector: Vector) {
    let newXForce = forceVector.x / this.mass;
    let newYForce = forceVector.y / this.mass;

    if ((newXForce > 0 && newXForce > this.momentum.x) || (newXForce < 0 && newXForce < this.momentum.x)) this.momentum.x = newXForce;
    if ((newYForce > 0 && newYForce > this.momentum.y) || (newYForce < 0 && newYForce < this.momentum.y)) this.momentum.y = newYForce;
}

export function receiveDamage(this: Actor, quantity: number, id: number): boolean {
    this.health -= quantity;
    //this.lastHitById = id;
    if (this.health <= 0) {
        return true;
    } else {
        return false;
    }
}

export function attemptReceiveHeal(this: Actor, quantity: number) {
    if (!this.actorDeathData.isDead) this.receiveHeal(quantity);
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
/*export function die(this: Actor) {
    this.actorEffects.isDead += 0.01;
}*/

export function assignDamageToActorArray(actors: Actor[], actorAssignments: KnockbackVector[], damage: Damage) {
    var actorIndex: number = 0;
    var ifExists: boolean = true;
    while (actorAssignments.length !== 0) {
        if (!ifExists) break;
        ifExists = false;
        actorIndex = 0;

        while (actorIndex < actors.length && actorAssignments.length !== 0) {
            if (actors[actorIndex].id === actorAssignments[0].id) {
                ifExists = true;
                actors[actorIndex].attemptReceiveDamage(damage.quantity, damage.id); // damage.team
                //actors[actorIndex].attemptReceiveKnockback(actorAssignments[0].angle, actorAssignments[0].force);
                actorAssignments.shift();
            }

            actorIndex++;
        }
    }
}

export function killActorArray(actors: Actor[], ids: number[]) {
    var actorIndex: number = 0;
    var ifExists: boolean = true;
    while (ids.length !== 0) {
        if (!ifExists) break;
        ifExists = false;
        actorIndex = 0;

        while (actorIndex < actors.length && ids.length !== 0) {
            if (actors[actorIndex].id === ids[0]) {
                ifExists = true;
                actors[actorIndex].attemptDie();
                //actors.splice(actorIndex, 1);
                ids.shift();
            }
            actorIndex++;
        }
    }
}

export function assignFocusUpdates(players: PlayerActor[], playerAngles: { id: number; angle: number }[], gamePlayerId: number) {
    var playerIndex: number = 0;
    var ifExists: boolean = true;
    while (playerAngles.length !== 0) {
        if (!ifExists) break;
        ifExists = false;
        playerIndex = 0;

        while (playerIndex < players.length && playerAngles.length !== 0) {
            if (players[playerIndex].id === playerAngles[0].id) {
                ifExists = true;

                if (playerAngles[0].id !== gamePlayerId) {
                    players[playerIndex].changeFocusPositionAngle(playerAngles[0].angle);
                }

                playerAngles.shift();
            }
            playerIndex++;
        }
    }
}
