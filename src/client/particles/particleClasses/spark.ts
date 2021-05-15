import { Vector } from "../../../vector";
import { ParticleBase } from "./particleBaseClass";

export class Spark extends ParticleBase {
    constructor(ctx: CanvasRenderingContext2D, position: Vector, lifeTime: number) {
        super(ctx, position, lifeTime);
    }

    render() {
        this.ctx.globalAlpha = this.currentLife / this.lifeTime;
        this.ctx.fillRect(this.position.x - 3, this.position.y - 3, 6, 6);
    }
}
