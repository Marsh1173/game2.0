import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { rotateShape, Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
import { ClientActor, renderShape } from "../../../../newActors/clientActors/clientActor";
import { ClientHammer } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientHammer";
import { Controller } from "../../controller";
import { HammerController } from "../../hammerController";
import { PlayerPressAbility } from "../playerPressAbility";

export class HammerSwingAbility extends PlayerPressAbility {
    constructor(game: Game, protected readonly player: ClientHammer, protected readonly controller: HammerController, abilityArrayIndex: number) {
        super(
            game,
            player,
            controller,
            HammerSwingAbilityData.cooldown + 0,
            assetManager.images["swingIcon"],
            HammerSwingAbilityData.totalCastTime + 0,
            abilityArrayIndex,
        );
    }

    pressFunc(globalMousePos: Vector) {
        super.pressFunc(globalMousePos);
        this.player.performClientAbility["swing"](globalMousePos);

        this.controller.sendServerHammerAbility("swing", true, globalMousePos);
    }
    castUpdateFunc(elapsedTime: number) {
        super.castUpdateFunc(elapsedTime);

        if (this.castStage > HammerSwingAbilityData.hitDetectFrame && this.castStage - elapsedTime < HammerSwingAbilityData.hitDetectFrame) {
            let actors: {
                actorType: ActorType;
                actorId: number;
                angle: number;
            }[] = [];

            let shape: Vector[] = rotateShape(HammerSwingHitShape, this.angle, this.player.position, false);

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
                this.game.gameRenderer.screenZoom(1.1, 7);
                this.game.serverTalker.sendMessage({
                    type: "clientHammerMessage",
                    originId: this.player.getActorId(),
                    position: this.player.position,
                    momentum: this.player.momentum,
                    msg: {
                        type: "clientHammerSwingHit",
                        actors,
                    },
                });
            }
        }
    }
}

export interface ClientHammerSwingHit {
    type: "clientHammerSwingHit";
    actors: {
        actorType: ActorType;
        actorId: number;
        angle: number;
    }[];
}

export const HammerSwingHitShape: Vector[] = [
    { x: -10, y: -30 },
    { x: 7, y: -80 },
    { x: 100, y: -55 },
    { x: 110, y: 20 },
    { x: 75, y: 55 },
    { x: 10, y: 70 },
];

const HammerSwingAbilityData = {
    cooldown: 0.5,
    totalCastTime: 0.8,
    hitDetectFrame: 0.2,
};
