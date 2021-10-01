import { Game } from "../../../../client/game";
import { findAngle } from "../../../../findAngle";
import { Vector } from "../../../../vector";
import { ClientPlayer } from "../../../newActors/clientActors/clientPlayer/clientPlayer";
import { Controller } from "../controller";
import { PlayerAbility, PlayerAbilityType } from "./playerAbility";

export abstract class PlayerPressAbility extends PlayerAbility {
    type: PlayerAbilityType = "press";

    constructor(
        game: Game,
        player: ClientPlayer,
        controller: Controller,
        totalCooldown: number,
        img: HTMLImageElement,
        totalCastTime: number,
        abilityArrayIndex: number,
    ) {
        super(game, player, controller, totalCooldown, img, totalCastTime, abilityArrayIndex);
    }
    pressFunc(globalMousePos: Vector) {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.controller.setGlobalCooldown(this.globalCooldownTime);
        this.cooldown = this.totalCooldown + 0;
        this.angle = findAngle(this.player.position, globalMousePos);
        this.casting = true;
    }
    castUpdateFunc(elapsedTime: number) {
        this.castStage += elapsedTime;

        if (this.castStage >= this.totalCastTime) {
            this.stopFunc();
        }
    }
    stopFunc() {
        if (this.casting) {
            this.controller.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;
            this.angle = 0;
        }
    }
}
