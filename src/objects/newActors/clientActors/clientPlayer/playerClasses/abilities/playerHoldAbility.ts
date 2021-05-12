import { Game } from "../../../../../../client/game";
import { Vector } from "../../../../../../vector";
import { PlayerSword } from "../playerSword";
import { PlayerAbility, PlayerAbilityType } from "./playerAbility";

export abstract class PlayerHoldAbility extends PlayerAbility {
    type: PlayerAbilityType = "hold";

    constructor(game: Game, player: PlayerSword, totalCooldown: number, img: HTMLImageElement, totalCastTime: number, abilityArrayIndex: number) {
        super(game, player, totalCooldown, img, totalCastTime, abilityArrayIndex);
    }

    public abstract releaseFunc(): void;
    public updateFunc(elapsedTime: number) {
        if (this.castStage !== 0) return;
        super.updateFunc(elapsedTime);
    }
}
