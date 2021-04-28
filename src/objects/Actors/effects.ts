import { Actor, ActorType, ActorUpdateStats } from "./actor";

//test examples
export type ActorEffectName = "halfSlow" | "halfFallSpeed" | "dot";
//so the actor knows if they should execute the end function or not;
export type EffectFinishCause = "forced" | "timerFinish";

export interface ServerActorEffectMessage {
    type: "serverActorEffect";
    effect: ServerGiveActorEffect | ServerClearActorEffect;
}

export interface ActorEffect {
    effectName: ActorEffectName;
    originActorType: ActorType;
    originId: number;
    duration: number;
    secondaryTimer: number;
    updateFunction: ((actor: Actor, elapsedTime: number, actorEffect: ActorEffect, updateStats: ActorUpdateStats) => void) | undefined;
    startFunction: ((actor: Actor) => boolean) | undefined;
    endFunction: ((actor: Actor) => boolean) | undefined;
    renderFunction: ((actor: Actor) => void) | undefined;
    particleSystem: undefined;
}

export interface ServerGiveActorEffect {
    type: "serverGiveActorEffect";
    originActorType: ActorType;
    originId: number;
    targetActorType: ActorType;
    targetId: number;
    effectName: ActorEffectName;
}

export interface ServerClearActorEffect {
    type: "serverClearActorEffect";
    targetActorType: ActorType;
    targetId: number;
    effectName: ActorEffectName;
    finishCause: EffectFinishCause;
}

//global effect stats
export const effectStats = {
    dot: {
        duration: 5,
        secondaryTimerLength: 0.5,
        damage: 2,
    },
    halfSlow: {
        duration: 3,
        percentage: 0.5,
    },
    halfFallSpeed: {
        duration: 3,
        percentage: 0.5,
    },
};
