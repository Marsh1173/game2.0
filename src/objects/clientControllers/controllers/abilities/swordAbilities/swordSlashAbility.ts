import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { rotateShape, Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
import { ClientActor, renderShape } from "../../../../newActors/clientActors/clientActor";
import { ClientSword } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { Controller } from "../../controller";
import { SwordController } from "../../swordController";
import { PlayerPressAbility } from "../playerPressAbility";

export class SwordSlashAbility extends PlayerPressAbility {
    private slashAngle: number = 0;

    constructor(game: Game, protected readonly player: ClientSword, protected readonly controller: SwordController, abilityArrayIndex: number) {
        super(
            game,
            player,
            controller,
            SwordSlashAbilityData.cooldown + 0,
            assetManager.images["slashIcon"],
            SwordSlashAbilityData.totalCastTime + 0,
            abilityArrayIndex,
        );
    }

    pressFunc(globalMousePos: Vector) {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.controller.setGlobalCooldown(this.globalCooldownTime);
        this.cooldown = this.totalCooldown + 0;
        this.player.performClientAbility["slash"](globalMousePos);
        this.slashAngle = findAngle(this.player.position, globalMousePos);
        //boradcast
        this.casting = true;

        this.controller.sendServerSwordAbility("slash", true, globalMousePos);
    }
    castUpdateFunc(elapsedTime: number) {
        this.castStage += elapsedTime;

        if (this.castStage > SwordSlashAbilityData.hitDetectFrame && this.castStage - elapsedTime < SwordSlashAbilityData.hitDetectFrame) {
            let actors: {
                actorType: ActorType;
                actorId: number;
                angle: number;
            }[] = [];

            let shape: Vector[] = rotateShape(SwordSlashHitShape, this.slashAngle, this.player.position, false);

            this.globalActors.actors.forEach((actor) => {
                if (actor.getActorId() !== this.player.getActorId() && actor.ifInsideLargerShape(shape)) {
                    actors.push({
                        actorType: actor.getActorType(),
                        actorId: actor.getActorId(),
                        angle: findAngle(this.player.position, actor.position),
                    });
                }
            });

            if (actors.length > 0) {
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    msg: {
                        type: "clientSwordSlashHit",
                        actors,
                        originId: this.player.getActorId(),
                    },
                });
            }
        }
        if (this.castStage >= SwordSlashAbilityData.totalCastTime) {
            this.stopFunc();
        }
    }
    stopFunc() {
        if (this.casting) {
            this.controller.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;
            this.slashAngle = 0;
        }
    }
}

export interface ClientSwordSlashHit {
    type: "clientSwordSlashHit";
    actors: {
        actorType: ActorType;
        actorId: number;
        angle: number;
    }[];
    originId: number;
}

const SwordSlashHitShape: Vector[] = [
    { x: -10, y: -30 },
    { x: 50, y: -60 },
    { x: 100, y: 0 },
    { x: 70, y: 50 },
    { x: 10, y: 70 },
];

const SwordSlashAbilityData = {
    cooldown: 0.4,
    totalCastTime: 0.5,
    hitDetectFrame: 0.15,
};
