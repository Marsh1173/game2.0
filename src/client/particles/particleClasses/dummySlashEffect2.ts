import { Vector } from "../../../vector";
import { assetManager } from "../../gameRender/assetmanager";
import { ParticleBase } from "./particleBaseClass";

export class DummySlashEffect2 extends ParticleBase {
    protected readonly scale: number = 0.5;
    protected readonly slashImage: HTMLImageElement = assetManager.images["slashEffectTest2"];

    constructor(ctx: CanvasRenderingContext2D, position: Vector, protected angle: number, protected readonly flipX: boolean) {
        super(ctx, position, 0.04);
    }

    render() {
        this.ctx.globalAlpha = this.currentLife / 0.04;
        this.ctx.translate(this.position.x, this.position.y);
        if (this.flipX) this.ctx.scale(this.scale, this.scale);
        else this.ctx.scale(-this.scale, this.scale);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-120, -190);

        this.ctx.drawImage(this.slashImage, 0, 0);

        this.ctx.translate(120, +190);
        this.ctx.rotate(-this.angle);
        if (this.flipX) this.ctx.scale(1 / this.scale, 1 / this.scale);
        else this.ctx.scale(-1 / this.scale, 1 / this.scale);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.ctx.globalAlpha = 1;
    }
}
