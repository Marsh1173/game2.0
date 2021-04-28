import { createTextChangeRange } from "typescript";
import { SingleEntryPlugin } from "webpack";
import { Config } from "../../../../config";
import { ActorType } from "../../../../objects/Actors/actor";
import { ActorEffectName, EffectFinishCause } from "../../../../objects/Actors/effects";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { serialize } from "../../../../serialized/lavaFly";
import { findDistance, Vector } from "../../../../vector";
import { Game } from "../../../game";
import { serverGiveEffect, serverClearEffect, createServerEffect } from "../../serverEffectFunctions";
import { ServerPlayerActor } from "../../serverPlayers/serverPlayerActor";

export class ServerLavaFly extends LavaFly {
    private updateTargetCounter: number = 0;
    private updateTargetCooldown: number = 0.3 + Math.random() / 2;

    private attackCounter: number = 0;
    private attackCooldown: number = 0.6 + Math.random() / 2;
    private attackDamage: number = 1;
    private attackRange: number = 80;

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public momentum: Vector = { x: 0, y: 0 },
    ) {
        super(config, id, position, team, 10, momentum);
    }

    public serialize = serialize;

    //effects
    protected updateEffects(elapsedTime: number) {
        super.updateEffects(elapsedTime);
        this.actorEffectData.forEach((value, key) => {
            if (value.duration <= 0) this.clearEffect(key, "timerFinish");
        });
    }
    public giveEffect(originActorType: ActorType, originId: number, effectName: ActorEffectName) {
        /*Game.broadcastMessage({
            type: "serverActorEffect",
            effect: {
                type: "serverGiveActorEffect",
                originActorType,
                originId,
                targetActorType: this.getActorType(),
                targetId: this.id,
                effectName,
            },
        });*/
        super.giveEffect(originActorType, originId, effectName);
    }
    public clearEffect(effectName: ActorEffectName, finishCause: EffectFinishCause) {
        /*Game.broadcastMessage({
            type: "serverActorEffect",
            effect: {
                type: "serverClearActorEffect",
                targetActorType: this.getActorType(),
                targetId: this.id,
                effectName,
                finishCause,
            },
        });*/
        super.clearEffect(effectName, finishCause);
    }
    protected createEffect = createServerEffect;

    protected attackTargetPlayer(quantity: number) {
        if (this.targetPlayer) {
            this.targetPlayer.attemptReceiveDamage(quantity, this.id);
            /*Game.broadcastMessage({
                type: "serverLavaFlyAttack",
                id: this.id,
                quantity: quantity,
            });*/
        }
    }

    private updateTargetPlayer(players: ServerPlayerActor[]) {
        let ifChanged: boolean = false;

        if (this.targetPlayer && findDistance(this.position, this.targetPlayer.position) > 400) {
            // deaggro if they're out of range
            this.targetPlayer = undefined;
            ifChanged = true;
        }

        for (let i: number = 0; i < players.length; i++) {
            if (
                (this.targetPlayer && players[i].id == this.targetPlayer.id) ||
                findDistance(this.position, players[i].position) > 400 ||
                !players[i].checkIfAlive()
            ) {
                continue;
            }
            if (this.targetPlayer == undefined) {
                this.targetPlayer = players[i];
                ifChanged = true;
            } else if (findDistance(this.position, players[i].position) < findDistance(this.position, this.targetPlayer.position)) {
                this.targetPlayer = players[i];
                ifChanged = true;
            }
        }

        if (ifChanged) {
            /*if (this.targetPlayer) {
                Game.broadcastMessage({
                    type: "changeServerLavaFlyTarget",
                    id: this.id,
                    position: this.position,
                    momentum: this.momentum,
                    playerid: this.targetPlayer.id,
                });
            } else {
                Game.broadcastMessage({
                    type: "changeServerLavaFlyTarget",
                    id: this.id,
                    position: this.position,
                    momentum: this.momentum,
                    playerid: undefined,
                });
            }*/
        }
    }

    private updateIfCanAttack(elapsedTime: number) {
        if (this.targetPlayer) {
            if (this.attackCounter <= 0) {
                this.attackTargetPlayer(this.attackDamage);
                this.attackCounter = this.attackCooldown;
            } else if (findDistance(this.position, this.targetPlayer.position) < this.attackRange) {
                this.attackCounter -= elapsedTime;
            }
        } else if (this.attackCounter != this.attackCooldown) {
            this.attackCounter = this.attackCooldown;
        }
    }

    public serverLavaFlyUpdate(elapsedTime: number, players: ServerPlayerActor[], lavaFlies: ServerLavaFly[]) {
        this.updateIfCanAttack(elapsedTime);

        this.updateTargetCounter += elapsedTime;
        if (this.updateTargetCounter > this.updateTargetCooldown) {
            //this.updateTargetPlayer(players); SHOULD BE REACTIVATED IF YOU WANT THE LAVAFLIES TO ATTACK
            this.updateTargetCounter = 0;
        }

        if (this.health <= 0) {
            this.attemptDie();
        }

        super.lavaFlyUpdate(elapsedTime, lavaFlies);
    }
}

export interface ServerLavaFlyMessage {
    type: "serverlavaflyMessage";
    messageType: ServerLavaFlyAttack | NewLavaFly;
}

export interface NewLavaFly {
    type: "newLavaFly";
    id: number;
    position: Vector;
    team: number;
}
export interface ChangeServerLavaFlyTarget {
    type: "changeServerLavaFlyTarget";
    id: number;
    position: Vector;
    momentum: Vector;
    playerid: number | undefined;
}
export interface ServerDeadLavaFlyArray {
    type: "serverDeadLavaFlyArray";
    lavaFlyIds: number[];
}

export interface ServerLavaFlyAttack {
    type: "serverLavaFlyAttack";
    id: number;
    quantity: number;
}
