import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { findDistance, Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
import { defaultActorConfig } from "../../../../newActors/actorConfig";
import { ClientActor } from "../../../../newActors/clientActors/clientActor";
import { ClientSword } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { Controller } from "../../controller";
import { SwordController } from "../../swordController";
import { PlayerHoldAbility } from "../playerHoldAbility";

export class SwordWhirlWindAbility extends PlayerHoldAbility {
    constructor(game: Game, protected readonly player: ClientSword, protected readonly controller: SwordController, abilityArrayIndex: number) {
        super(
            game,
            player,
            controller,
            SwordWhirlWindAbilityData.cooldown,
            assetManager.images["whirlwindIcon"],
            SwordWhirlWindAbilityData.totalCastTime,
            abilityArrayIndex,
        );
    }

    pressFunc(globalMousePos: Vector) {
        this.controller.setNegativeGlobalCooldown();
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.player.performClientAbility["whirlwind"](globalMousePos);
        this.casting = true;

        this.cooldown = 3;

        this.controller.sendServerSwordAbility("whirlwind", true, { x: 0, y: 0 });
        //broadcast starting
    }
    castUpdateFunc(elapsedTime: number) {
        this.castStage += elapsedTime;

        if (
            this.castStage % SwordWhirlWindAbilityData.hitDetectTimer >= 0.1 &&
            (this.castStage - elapsedTime) % SwordWhirlWindAbilityData.hitDetectTimer < 0.1
        ) {
            this.cooldown++;
            let actors: {
                actorType: ActorType;
                actorId: number;
                angle: number;
            }[] = [];

            this.globalActors.actors.forEach((actor) => {
                let posDifference = findDistance(this.player.position, actor.position);
                if (actor.getActorId() !== this.player.getActorId() && posDifference < actor.getCollisionRange() + SwordWhirlWindAbilityData.hitRange) {
                    actors.push({ actorType: actor.getActorType(), actorId: actor.getActorId(), angle: findAngle(this.player.position, actor.position) });
                }
            });

            if (actors.length !== 0) {
                this.game.gameRenderer.screenZoom(1.06, 3);
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientSwordWhirlwindHit",
                        actors,
                    },
                });
            }
        }

        if (this.castStage >= SwordWhirlWindAbilityData.totalCastTime) {
            this.stopFunc();
        }
    }
    releaseFunc() {
        this.stopFunc();
    }
    stopFunc() {
        if (this.casting) {
            this.player.releaseClientAbility["whirlwind"]();
            this.controller.resetGlobalCooldown();
            this.controller.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;

            this.controller.sendServerSwordAbility("whirlwind", false, { x: 0, y: 0 });
            //boradcast ending
        }
    }

    updateFunc(elapsedTime: number) {
        if (this.cooldown > SwordWhirlWindAbilityData.cooldown) {
            this.cooldown = SwordWhirlWindAbilityData.cooldown + 0;
        }

        if (this.cooldown < 0) {
            this.cooldown = 0;
        }
    }

    getIconCooldownPercent(): number {
        if (this.cooldown === 0) return this.controller.globalCooldown / defaultActorConfig.globalCooldown;
        else return this.cooldown / SwordWhirlWindAbilityData.cooldown;
    }
}

export const SwordWhirlWindAbilityData = {
    cooldown: 5,
    totalCastTime: 1,
    hitDetectTimer: 0.2,
    hitRange: 140,
};

export interface ClientSwordWhirlwindHit {
    type: "clientSwordWhirlwindHit";
    actors: {
        actorType: ActorType;
        actorId: number;
        angle: number;
    }[];
}
