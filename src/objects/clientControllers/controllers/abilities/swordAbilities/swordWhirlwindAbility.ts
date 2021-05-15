import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { findDistance, Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
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

    public pressFunc(globalMousePos: Vector) {
        this.controller.setNegativeGlobalCooldown();
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.player.performClientAbility["whirlwind"](globalMousePos);
        this.cooldown = this.totalCooldown / 2;
        this.casting = true;

        this.controller.sendServerSwordAbility("whirlwind", true, { x: 0, y: 0 });
        //broadcast starting
    }
    public castUpdateFunc(elapsedTime: number) {
        this.castStage += elapsedTime;
        this.cooldown += elapsedTime;

        if (
            this.castStage % SwordWhirlWindAbilityData.hitDetectTimer >= 0.1 &&
            (this.castStage - elapsedTime) % SwordWhirlWindAbilityData.hitDetectTimer < 0.1
        ) {
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
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    msg: {
                        type: "clientSwordWhirlwindHit",
                        actors,
                        originId: this.player.getActorId(),
                    },
                });
            }
        }

        if (this.castStage >= SwordWhirlWindAbilityData.totalCastTime) {
            this.stopFunc();
        }
    }
    public releaseFunc() {
        this.stopFunc();
    }
    public stopFunc() {
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
}

export const SwordWhirlWindAbilityData = {
    cooldown: 3,
    totalCastTime: 1.5,
    hitDetectTimer: 0.3,
    hitRange: 80,
};

export interface ClientSwordWhirlwindHit {
    type: "clientSwordWhirlwindHit";
    actors: {
        actorType: ActorType;
        actorId: number;
        angle: number;
    }[];
    originId: number;
}
