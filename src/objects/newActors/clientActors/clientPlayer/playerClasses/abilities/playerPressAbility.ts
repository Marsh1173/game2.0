import { Game } from "../../../../../../client/game";
import { Vector } from "../../../../../../vector";
import { PlayerSword } from "../playerSword";
import { PlayerAbility, PlayerAbilityType } from "./playerAbility";

export abstract class PlayerPressAbility extends PlayerAbility {
    type: PlayerAbilityType = "press";

    constructor(game: Game, player: PlayerSword, totalCooldown: number, img: HTMLImageElement, totalCastTime: number, abilityArrayIndex: number) {
        super(game, player, totalCooldown, img, totalCastTime, abilityArrayIndex);
    }
}
