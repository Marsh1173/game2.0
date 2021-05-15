import { Game, GlobalClientActors } from "../../../../client/game";
import { Vector } from "../../../../vector";
import { defaultActorConfig } from "../../../newActors/actorConfig";
import { ClientPlayer } from "../../../newActors/clientActors/clientPlayer/clientPlayer";
import { Controller } from "../controller";

export type PlayerAbilityType = "press" | "hold";

export abstract class PlayerAbility {
    public abstract type: PlayerAbilityType;

    public cooldown: number = 0;
    protected readonly globalCooldownTime: number;

    protected castStage: number = 0;
    protected casting: boolean = false;

    protected globalActors: GlobalClientActors;

    /**
     * @param totalCastTime is referenced by the ability to know when to call stopFunc or releaseFunc
     */
    constructor(
        protected readonly game: Game,
        protected readonly player: ClientPlayer,
        protected readonly controller: Controller,
        public readonly totalCooldown: number,
        public img: HTMLImageElement,
        protected readonly totalCastTime: number,
        protected readonly abilityArrayIndex: number,
    ) {
        this.globalActors = this.game.getGlobalActors();

        this.globalCooldownTime = defaultActorConfig.globalCooldown;
    }

    public attemptFunc(): boolean {
        if (this.controller.globalCooldown === 0 && this.cooldown === 0) return true;
        return false;
    }
    public updateFunc(elapsedTime: number) {
        if (this.cooldown > 0) {
            if (this.cooldown > this.totalCooldown) {
                this.cooldown = this.totalCooldown + 0;
            }
            this.cooldown -= elapsedTime;
            if (this.cooldown < 0) {
                this.cooldown = 0;
            }
        }
    }
    public abstract pressFunc(globalMousePos: Vector): void;
    public abstract castUpdateFunc(elapsedTime: number): void;
    public abstract stopFunc(): void;

    protected resetAbility() {
        this.castStage = 0;
    }
}
