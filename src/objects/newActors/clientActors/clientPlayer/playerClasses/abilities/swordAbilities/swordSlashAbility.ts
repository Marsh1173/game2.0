import { Game } from "../../../../../../../client/game";
import { assetManager } from "../../../../../../../client/gameRender/assetmanager";
import { Vector } from "../../../../../../../vector";
import { PlayerSword } from "../../playerSword";
import { PlayerPressAbility } from "../playerPressAbility";

export class SwordSlashAbility extends PlayerPressAbility {
    constructor(game: Game, player: PlayerSword, abilityArrayIndex: number) {
        super(game, player, SwordSlashAbilityData.cooldown + 0, assetManager.images["slashIcon"], SwordSlashAbilityData.totalCastTime + 0, abilityArrayIndex);
    }

    pressFunc(globalMousePos: Vector) {
        this.player.setCurrentCastingAbility(this.abilityArrayIndex);
        this.player.setGlobalCooldown(this.globalCooldownTime);
        this.cooldown = this.totalCooldown + 0;
        this.player.performClientAbility["slash"](globalMousePos);
        //boradcast
        this.casting = true;
    }
    castUpdateFunc(elapsedTime: number) {
        this.castStage += elapsedTime;

        if (this.castStage > SwordSlashAbilityData.hitDetectFrame && this.castStage - elapsedTime < SwordSlashAbilityData.hitDetectFrame) {
            console.log("slash hit detection");
        }
        if (this.castStage >= SwordSlashAbilityData.totalCastTime) {
            this.stopFunc();
        }
    }
    stopFunc() {
        if (this.casting) {
            this.player.resetCurrentCastingAbility();
            this.resetAbility();
            this.casting = false;
        }
    }
}

const SwordSlashAbilityData = {
    cooldown: 0.4,
    totalCastTime: 0.5,
    hitDetectFrame: 0.2,
};
