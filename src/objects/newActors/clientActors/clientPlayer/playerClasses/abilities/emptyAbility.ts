import { Game } from "../../../../../../client/game";
import { assetManager } from "../../../../../../client/gameRender/assetmanager";
import { Vector } from "../../../../../../vector";
import { PlayerSword } from "../playerSword";
import { PlayerPressAbility } from "./playerPressAbility";

export class EmptyAbility extends PlayerPressAbility {
    constructor(game: Game, player: PlayerSword, abilityArrayIndex: number) {
        super(game, player, 0, assetManager.images["emptyIcon"], 0, abilityArrayIndex);
    }

    pressFunc(globalMousePos: Vector) {}
    castUpdateFunc(elapsedTime: number) {}
    stopFunc() {}
}
