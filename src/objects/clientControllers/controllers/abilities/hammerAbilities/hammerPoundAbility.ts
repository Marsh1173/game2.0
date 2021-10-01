import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ClientHammer } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientHammer";
import { HammerController } from "../../hammerController";
import { PlayerPressAbility } from "../playerPressAbility";

export class HammerPoundAbility extends PlayerPressAbility {
    constructor(game: Game, protected readonly player: ClientHammer, protected readonly controller: HammerController, abilityArrayIndex: number) {
        super(game, player, controller, HammerPoundAbilityData.cooldown + 0, assetManager.images["poundIcon"], 0, abilityArrayIndex);
    }

    updateFunc(elapsedTime: number) {
        if (this.castStage !== 0) return;
        super.updateFunc(elapsedTime);
    }

    pressFunc() {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.controller.setNegativeGlobalCooldown();
        this.cooldown = this.totalCooldown + 0;
        this.casting = true;
    }

    castUpdateFunc(elapsedTime: number) {
        if (this.player.actorObject.standing) {
            this.stopFunc();
        }
    }

    stopFunc() {
        if (this.casting) {
            this.game.gameRenderer.screenZoom(1.2, 10);
            this.controller.setGlobalCooldown(this.globalCooldownTime * 2);
        }
        super.stopFunc();
    }
}

const HammerPoundAbilityData = {
    cooldown: 4,
    totalPoundingTime: 2,
};
