import { ClientLavaFly } from "../client/clientActors/clientMobs/clientAirMobs/clientLavaFly";
import { ClientPlayerActor } from "../client/clientActors/clientPlayers/clientPlayerActor";
import { ServerLavaFly } from "../server/serverActors/serverMobs/serverAirMobs/serverLavaFly";
import { ServerPlayerActor } from "../server/serverActors/serverPlayers/serverPlayerActor";
import { Actor, ActorType } from "./Actors/actor";

import * as ClientGame from "../client/game";
import * as ServerGame from "../server/game";
import { Vector } from "../vector";

export abstract class ActorMethods {
    constructor(protected actor: Actor, protected actorHealth: number) {}

    public abstract receiveDamage(
        quantity: number,
        originActorId: number,
        originActorType: ActorType,
        health: number | undefined,
        knockback: Vector | undefined,
        position: Vector | undefined,
        momentum: Vector | undefined,
    ): boolean;
}

export class ClientActorMethods extends ActorMethods {
    constructor(actor: ClientLavaFly | ClientPlayerActor, actorHealth: number) {
        super(actor, actorHealth);
    }

    public updatePositionAndMomentumFromServer(position: Vector, momentum: Vector) {
        this.actor.momentum.x = momentum.x + 0;
        this.actor.momentum.y = momentum.y + 0;
        this.actor.position.x = position.x + 0;
        this.actor.position.y = position.y + 0;

        //this.actor.model.registerPositionUpdate([position difference])
    }

    public receiveDamage(
        quantity: number,
        originActorId: number,
        originActorType: ActorType,
        health: number,
        knockback: Vector | undefined,
        position: Vector,
        momentum: Vector,
    ): boolean {
        this.actorHealth = health;
        this.actor.setLastHitBy(originActorId, originActorType);
        this.updatePositionAndMomentumFromServer(position, momentum);
        //if (this.checkIfAlive()) this.actor.model.registerDamage(quantity);
        //particles
        if (knockback) this.actor.attemptReceiveKnockback(knockback);
        return false;
    }
}

export class ServerActorMethods extends ActorMethods {
    constructor(actor: ServerLavaFly | ServerPlayerActor, actorHealth: number) {
        super(actor, actorHealth);
    }

    public receiveDamage(
        quantity: number,
        originActorId: number,
        originActorType: ActorType,
        health: undefined,
        knockback: Vector | undefined,
        position: undefined,
        momentum: undefined,
    ): boolean {
        this.actorHealth -= quantity;
        this.actor.setLastHitBy(originActorId, originActorType);

        /*ServerGame.Game.broadcastMessage({
            type: "serverActorMessage",
            messageType: {
                type: "serverActorReceiveDamage",
                originActorType: originActorType,
                originActorId: originActorId,
                actorType: this.actor.getActorType(),
                actorId: this.actor.id,
                health: this.actorHealth, // i don't know if it's a pointer or what yet
                damage: quantity,
                knockback,
                position: this.actor.position,
                momentum: this.actor.momentum,
            },
        });*/

        if (this.actorHealth <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
