import e = require("express");
import { Vector } from "../../../vector";
import { assetManager } from "../../gameRender/assetmanager";
import { ParticleBase } from "./particleBaseClass";

export class DummyWhirlwindEffect extends ParticleBase {
    protected readonly scale: number = 0.7;
    protected readonly baseImage: HTMLImageElement = assetManager.images["whirlwindEffectBase"];
    protected readonly topImage: HTMLImageElement = assetManager.images["whirlwindEffectTop"];

    protected topRotation: number = 0;
    protected baseRotation: number = 0;
    protected alpha: number = 0;

    protected ending: boolean = false;

    constructor(ctx: CanvasRenderingContext2D, position: Vector, protected readonly flipX: boolean) {
        super(ctx, position, 5);
    }

    updateAndRender(elapsedTime: number) {
        this.topRotation += elapsedTime * 45;
        this.baseRotation += elapsedTime * 10;
        if (this.ending) {
            this.alpha -= elapsedTime * 10;
            if (this.alpha <= 0) {
                this.ifDead = true;
                this.alpha = 0;
            }
        } else {
            if (this.alpha < 1) {
                this.alpha += elapsedTime * 5;
            }
        }
        super.updateAndRender(elapsedTime);
    }

    render() {
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.position.x, this.position.y);
        if (this.flipX) this.ctx.scale(this.scale, this.scale);
        else this.ctx.scale(-this.scale, this.scale);

        this.ctx.rotate(this.baseRotation);
        this.ctx.translate(-300, -300);

        this.ctx.drawImage(this.baseImage, 0, 0);

        this.ctx.translate(300, +300);
        this.ctx.rotate(-this.baseRotation);

        this.ctx.rotate(this.topRotation);
        this.ctx.translate(-300, -300);

        this.ctx.drawImage(this.topImage, 0, 0);

        this.ctx.translate(300, +300);
        this.ctx.rotate(-this.topRotation);

        if (this.flipX) this.ctx.scale(1 / this.scale, 1 / this.scale);
        else this.ctx.scale(-1 / this.scale, 1 / this.scale);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.ctx.globalAlpha = 1;
    }

    public prematureEnd() {
        this.ending = true;
    }
}
