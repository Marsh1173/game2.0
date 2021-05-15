import { Game } from "../../../../client/game";
import { Vector } from "../../../../vector";
import { ClientPlayer } from "../../../newActors/clientActors/clientPlayer/clientPlayer";
import { Controller } from "../controller";
import { PlayerAbility, PlayerAbilityType } from "./playerAbility";

export abstract class PlayerHoldAbility extends PlayerAbility {
    type: PlayerAbilityType = "hold";

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

    public abstract releaseFunc(): void;
    public updateFunc(elapsedTime: number) {
        if (this.castStage !== 0) return;
        super.updateFunc(elapsedTime);
    }
}
