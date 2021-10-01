import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle, rotateShape } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ActorType } from "../../../../newActors/actor";
import { ClientDaggers } from "../../../../newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { DaggersController } from "../../daggersController";
import { PlayerPressAbility } from "../playerPressAbility";

export class DaggersLungeAbility extends PlayerPressAbility {
    constructor(game: Game, protected readonly player: ClientDaggers, protected readonly controller: DaggersController, abilityArrayIndex: number) {
        super(
            game,
            player,
            controller,
            DaggersLungeAbilityData.cooldown + 0,
            assetManager.images["lungeIcon"],
            DaggersLungeAbilityData.totalCastTime + 0,
            abilityArrayIndex,
        );
    }

    attemptFunc(): boolean {
        if (this.cooldown === 0) return true;
        return false;
    }

    pressFunc(globalMousePos: Vector) {
        this.controller.setCurrentCastingAbility(this.abilityArrayIndex);
        this.cooldown = this.totalCooldown + 0;
        this.angle = findAngle(this.player.position, globalMousePos);
        this.casting = true;
        //no super call because it doesn't set the global cooldown

        this.player.performClientAbility["lunge"](globalMousePos);
        this.controller.sendServerDaggersAbility("lunge", true, globalMousePos);
    }

    castUpdateFunc(elapsedTime: number) {
        super.castUpdateFunc(elapsedTime);
    }

    public getIconCooldownPercent(): number {
        if (this.cooldown !== 0) {
            return this.cooldown / this.totalCooldown;
        } else {
            return 0;
        }
    }
}

const DaggersLungeAbilityData = {
    cooldown: 3,
    totalCastTime: 0.2,
};
