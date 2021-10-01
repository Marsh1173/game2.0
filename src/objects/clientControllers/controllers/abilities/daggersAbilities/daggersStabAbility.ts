import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle, rotateShape } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
import { ClientDaggers } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { DaggersController } from "../../daggersController";
import { PlayerPressAbility } from "../playerPressAbility";

export class DaggersStabAbility extends PlayerPressAbility {
    constructor(game: Game, protected readonly player: ClientDaggers, protected readonly controller: DaggersController, abilityArrayIndex: number) {
        super(
            game,
            player,
            controller,
            DaggersStabAbilityData.cooldown + 0,
            assetManager.images["stabIcon"],
            DaggersStabAbilityData.totalCastTime + 0,
            abilityArrayIndex,
        );
    }

    pressFunc(globalMousePos: Vector) {
        super.pressFunc(globalMousePos);
        this.player.performClientAbility["stab"](globalMousePos);

        this.controller.sendServerDaggersAbility("stab", true, globalMousePos);
    }

    castUpdateFunc(elapsedTime: number) {
        super.castUpdateFunc(elapsedTime);

        if (this.castStage > DaggersStabAbilityData.hitDetectFrame && this.castStage - elapsedTime < DaggersStabAbilityData.hitDetectFrame) {
            let actors: {
                actorType: ActorType;
                actorId: number;
                angle: number;
            }[] = [];

            let shape: Vector[] = rotateShape(DaggersStabHitShape, this.angle, this.player.position, false);

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
                    type: "clientDaggersMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientDaggersStabHit",
                        actors,
                    },
                });
            }
        }
    }
}

export interface ClientDaggersStabHit {
    type: "clientDaggersStabHit";
    actors: {
        actorType: ActorType;
        actorId: number;
        angle: number;
    }[];
}

export const DaggersStabHitShape: Vector[] = [
    { x: -10, y: -40 },
    { x: 130, y: -30 },
    { x: 130, y: 30 },
    { x: -10, y: 40 },
];

const DaggersStabAbilityData = {
    cooldown: 0.3,
    totalCastTime: 0.5,
    hitDetectFrame: 0.1,
};
