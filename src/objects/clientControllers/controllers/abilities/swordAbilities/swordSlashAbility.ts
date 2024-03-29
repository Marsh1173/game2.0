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
import { SwordWhirlWindAbility } from "./swordWhirlwindAbility";

export class SwordSlashAbility extends PlayerPressAbility {
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
        super.pressFunc(globalMousePos);
        this.player.performClientAbility["slash"](globalMousePos);

        this.controller.sendServerSwordAbility("slash", true, globalMousePos);
    }
    castUpdateFunc(elapsedTime: number) {
        super.castUpdateFunc(elapsedTime);

        if (this.castStage > SwordSlashAbilityData.hitDetectFrame && this.castStage - elapsedTime < SwordSlashAbilityData.hitDetectFrame) {
            let actors: {
                actorType: ActorType;
                actorId: number;
                angle: number;
            }[] = [];

            let shape: Vector[] = rotateShape(SwordSlashHitShape, this.angle, this.player.position, false);

            this.globalActors.actors.forEach((actor) => {
                if (actor.getActorId() !== this.player.getActorId() && actor.ifInsideLargerShape(shape)) {
                    actors.push({
                        actorType: actor.getActorType(),
                        actorId: actor.getActorId(),
                        angle: this.angle,
                    });
                }
            });

            if (actors.length > 0) {
                this.game.gameRenderer.screenZoom(1.06);
                this.game.serverTalker.sendMessage({
                    type: "clientSwordMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientSwordSlashHit",
                        actors,
                    },
                });
                if (this.controller.abilityData[1] instanceof SwordWhirlWindAbility) {
                    this.controller.abilityData[1].cooldown--;
                }
            }
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
}

export const SwordSlashHitShape: Vector[] = [
    { x: -10, y: -30 },
    { x: 7, y: -80 },
    { x: 100, y: -55 },
    { x: 110, y: 20 },
    { x: 75, y: 55 },
    { x: 10, y: 70 },
];

const SwordSlashAbilityData = {
    cooldown: 0.3,
    totalCastTime: 0.5,
    hitDetectFrame: 0.05,
};
