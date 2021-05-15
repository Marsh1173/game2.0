import { Game } from "../../../../client/game";
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
}
