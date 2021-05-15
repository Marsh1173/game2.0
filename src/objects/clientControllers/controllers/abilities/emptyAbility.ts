import { Game } from "../../../../client/game";
import { assetManager } from "../../../../client/gameRender/assetmanager";
import { Vector } from "../../../../vector";
import { ClientPlayer } from "../../../newActors/clientActors/clientPlayer/clientPlayer";
import { Controller } from "../controller";
import { PlayerPressAbility } from "./playerPressAbility";

function getEmptyAbilityIcon(index: number): HTMLImageElement {
    if (index === 2) {
        return assetManager.images["lvl6"];
    } else if (index === 3) {
        return assetManager.images["lvl10"];
    } else {
        return assetManager.images["emptyIcon"];
    }
}
export class EmptyAbility extends PlayerPressAbility {
    constructor(game: Game, player: ClientPlayer, controller: Controller, abilityArrayIndex: number) {
        super(game, player, controller, 0, getEmptyAbilityIcon(abilityArrayIndex), 0, abilityArrayIndex);
    }

    pressFunc(globalMousePos: Vector) {}
    castUpdateFunc(elapsedTime: number) {}
    stopFunc() {}
}
