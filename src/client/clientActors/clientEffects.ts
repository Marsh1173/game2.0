import { Actor, ActorType, ActorUpdateStats } from "../../objects/Actors/actor";
import { ActorEffect, ActorEffectName, effectStats } from "../../objects/Actors/effects";

export function createClientEffect(effectName: ActorEffectName, originActorType: ActorType, originId: number): ActorEffect {
    return ClientEffect[effectName](originActorType, originId);
}

//export const WeaponRender: Record<Weapon, (player: Player, ctx: CanvasRenderingContext2D) => void> = {
//WeaponRender[this.weaponEquipped](this, ctx);
const ClientEffect: Record<ActorEffectName, (originActorType: ActorType, originId: number) => ActorEffect> = {
    dot: (originActorType: ActorType, originId: number) => {
        return {
            effectName: "dot",
            originActorType,
            originId,
            duration: effectStats.dot.duration,
            secondaryTimer: 0,
            updateFunction: clientDotUpdate,
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
            updateFunction: clientHalfFallSpeedUpdate,
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
function clientDotUpdate(actor: Actor, elapsedTime: number, actorEffect: ActorEffect, updateStats: ActorUpdateStats) {}

function clientHalfFallSpeedUpdate(actor: Actor, elapsedTime: number, actorEffect: ActorEffect, updateStats: ActorUpdateStats) {
    updateStats.fallingSpeedPercentage *= effectStats.halfFallSpeed.percentage;
}
