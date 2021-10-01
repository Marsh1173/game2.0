import { findOrthonormalVector, Vector } from "../../../vector";
import { ParticleBase } from "./particleBaseClass";

const trailDelay: number = 7;
const trailWidth: number = 27;

export class LungeEffect extends ParticleBase {
    protected trailingPoint: Vector;

    constructor(ctx: CanvasRenderingContext2D, position: Vector, protected readonly color: string) {
        super(ctx, position, 0.4);
        this.trailingPoint = { x: position.x + 0, y: position.y + 0 };
    }

    public updateAndRender(elapsedTime: number) {
        super.updateAndRender(elapsedTime);
        this.trailingPoint.x = (this.position.x + this.trailingPoint.x * (trailDelay - 1)) / trailDelay;
        this.trailingPoint.y = (this.position.y + this.trailingPoint.y * (trailDelay - 1)) / trailDelay;
    }

    render() {
        this.ctx.globalAlpha = this.currentLife / 0.2;
        this.ctx.fillStyle = this.color;

        let normal: Vector = findOrthonormalVector(this.trailingPoint, this.position);
        let pt1: Vector = { x: normal.x * trailWidth, y: normal.y * trailWidth };
        let pt2: Vector = { x: normal.x * -trailWidth, y: normal.y * -trailWidth };

        this.ctx.beginPath();
        this.ctx.moveTo(this.trailingPoint.x, this.trailingPoint.y);
        this.ctx.lineTo(this.position.x + pt1.x, this.position.y + pt1.y);
        this.ctx.lineTo(this.position.x + pt2.x, this.position.y + pt2.y);
        this.ctx.fill();

        this.ctx.globalAlpha = 1;
    }
}
