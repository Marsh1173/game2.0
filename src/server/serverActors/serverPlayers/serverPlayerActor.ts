import { Config } from "../../../config";
import { findAngle } from "../../../findAngle";
import { ActorType, DamageArray } from "../../../objects/Actors/actor";
import { ActorEffectName, EffectFinishCause } from "../../../objects/Actors/effects";
import { LavaFly } from "../../../objects/Actors/Mobs/airMob/lavaFly";
import { PlayerActionType, PlayerActor, WeaponType } from "../../../objects/Actors/Players/playerActor";
import { GroundPlatform } from "../../../objects/groundPlatform";
import { Platform } from "../../../objects/platform";
import { serialize, SerializedPlayerActor } from "../../../serialized/playerActor";
import { Vector } from "../../../vector";
import { Game } from "../../game";
import { createServerEffect, serverClearEffect, serverGiveEffect } from "../serverEffectFunctions";

export interface NewPlayerActor {
    type: "newPlayerActor";
    id: number;
    info: SerializedPlayerActor;
}

export class ServerPlayerActor extends PlayerActor {
    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public color: string,
        name: string,
        weapon: WeaponType,
    ) {
        super(config, id, position, team, color, name, 100, 0, weapon);
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

    private index: number = 0;
    protected leftClick() {
        if (this.index < 3) {
            this.giveEffect("lavafly", 1, "dot");
        } else if (this.index < 5) {
            this.clearEffect("dot", "forced");
        } else if (this.index < 8) {
            this.giveEffect("lavafly", 1, "halfFallSpeed");
        } else if (this.index < 10) {
            this.clearEffect("dot", "forced");
        } else {
            this.clearAllEffects();
        }
        this.index++;
    }

    protected die() {
        /*Game.broadcastMessage({
            type: "serverDeadPlayer",
            playerId: this.id,
        });*/
        super.die();
    }

    public resurrect(position: Vector) {
        /*Game.broadcastMessage({
            type: "serverResurrectPlayer",
            playerId: this.id,
            position: position,
        });*/
        super.resurrect(position);
    }

    protected deathTimerReachZero() {
        this.resurrect(this.config.playerStart);
        super.deathTimerReachZero();
    }

    public updateServerPlayerActor(elapsedTime: number, platforms: Platform[], groundPlatform: GroundPlatform, players: PlayerActor[]) {
        if (!this.checkIfAlive()) {
            this.actorDeathData.counter -= elapsedTime;
            if (this.checkIfDeathTimerIsZero()) {
                this.resurrect(this.config.playerStart);
            }
        }
        super.updatePlayerActor(elapsedTime, platforms, groundPlatform, players);
    }
}

export interface ServerPlayerAction {
    type: "serverPlayerAction";
    id: number;
    actionType: PlayerActionType;
    isStarting: boolean;
    position: Vector;
    momentum: Vector;
}

export interface ServerBasicAttackResults {
    type: "serverBasicAttackResults";
    damageArray: DamageArray;
}

export interface ServerUpdatePlayerFocus {
    type: "serverPlayerUpdateFocus";
    playerAngles: {
        id: number;
        angle: number;
    }[];
}

export interface ServerDeadPlayer {
    type: "serverDeadPlayer";
    playerId: number;
}

export interface ServerResurrectPlayer {
    type: "serverResurrectPlayer";
    playerId: number;
    position: Vector;
}
