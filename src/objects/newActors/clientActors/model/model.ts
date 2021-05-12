import { Game } from "../../../../client/game";
import { Vector } from "../../../../vector";
import { ClientPlayer } from "../clientPlayer/clientPlayer";
import { SideType } from "../models/model";
import { HealthBarModel } from "./healthBar";
import { Joint } from "./joint";

export abstract class Model {
    protected readonly healthBar: HealthBarModel;

    constructor(
        protected readonly game: Game,
        protected readonly player: ClientPlayer,
        protected ctx: CanvasRenderingContext2D,
        protected position: Vector,
        healthBarType: SideType,
    ) {
        this.healthBar = new HealthBarModel(this.ctx, this.position, this.player.getHealthInfo(), { width: 50, height: 6 }, healthBarType);
    }

    public registerDamage(quantity: number) {
        this.healthBar.registerDamage(quantity);
    }
    public registerHeal(quantity: number) {
        this.healthBar.registerHeal(quantity);
    }

    public abstract render(): void;

    public abstract update(elapsedTime: number): void;
}

export interface ModelAnimation {
    totalTime: number;
    loop: boolean;
}

export interface AnimationInfo {
    imgRotationEquation: number[][] | undefined;
    localPosXEquation: number[][] | undefined;
    localPosYEquation: number[][] | undefined;
    angleFromEquation: number[][] | undefined;
    angleToEquation: number[][] | undefined;
}
