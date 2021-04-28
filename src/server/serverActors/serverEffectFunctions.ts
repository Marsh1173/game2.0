import { Actor, ActorType, ActorUpdateStats } from "../../objects/Actors/actor";
import { ActorEffect, ActorEffectName, EffectFinishCause, effectStats } from "../../objects/Actors/effects";
import { Game } from "../game";

export function serverGiveEffect(this: Actor, originActorType: ActorType, originId: number, effectName: ActorEffectName) {
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
    this.giveEffect(originActorType, originId, effectName);
}
export function serverClearEffect(this: Actor, effectName: ActorEffectName, finishCause: EffectFinishCause) {
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

    this.clearEffect(effectName, finishCause);
}

export function createServerEffect(effectName: ActorEffectName, originActorType: ActorType, originId: number): ActorEffect {
    return ServerEffect[effectName](originActorType, originId);
}

const ServerEffect: Record<ActorEffectName, (originActorType: ActorType, originId: number) => ActorEffect> = {
    dot: (originActorType: ActorType, originId: number) => {
        return {
            effectName: "dot",
            originActorType,
            originId,
            duration: effectStats.dot.duration,
            secondaryTimer: effectStats.dot.secondaryTimerLength,
            updateFunction: ServerDotUpdate,
            startFunction: undefined,
            endFunction: undefined,
            renderFunction: undefined,
            particleSystem: undefined,
        };
    },
    halfFallSpeed: (originActorType: ActorType, originId: number) => {
        return {
            effectName: "halfFallSpeed",
            originActorType,
            originId,
            duration: effectStats.halfFallSpeed.duration,
            secondaryTimer: 0,
            updateFunction: serverHalfFallSpeedUpdate,
            startFunction: undefined,
            endFunction: undefined,
            renderFunction: undefined,
            particleSystem: undefined,
        };
    },
    halfSlow: (originActorType: ActorType, originId: number) => {
        return {
            effectName: "halfSlow",
            originActorType,
            originId,
            duration: effectStats.halfSlow.duration,
            secondaryTimer: 0,
            updateFunction: undefined,
            startFunction: undefined,
            endFunction: undefined,
            renderFunction: undefined,
            particleSystem: undefined,
        };
    },
};
/*export interface ActorEffect {
    effectName: ActorEffectName;
    originActorType: ActorType;
    originId: number;
    duration: number;
    secondaryTimer: number | undefined;
    updateFunction: ((actor: Actor) => void) | undefined;
    startFunction: ((actor: Actor) => boolean) | undefined;
    endFunction: ((actor: Actor) => boolean) | undefined;
    renderFunction: ((actor: Actor) => void) | undefined;
    particleSystem: undefined;
}*/
function ServerDotUpdate(actor: Actor, elapsedTime: number, actorEffect: ActorEffect, updateStats: ActorUpdateStats) {
    actorEffect.duration -= elapsedTime;
    actorEffect.secondaryTimer -= elapsedTime;
    if (actorEffect.secondaryTimer <= 0) {
        actor.attemptReceiveDamage(effectStats.dot.damage, actorEffect.originId);
        actorEffect.secondaryTimer = effectStats.dot.secondaryTimerLength;
    }
}

function serverHalfFallSpeedUpdate(actor: Actor, elapsedTime: number, actorEffect: ActorEffect, updateStats: ActorUpdateStats) {
    actorEffect.duration -= elapsedTime;
    updateStats.fallingSpeedPercentage *= effectStats.halfFallSpeed.percentage;
}
