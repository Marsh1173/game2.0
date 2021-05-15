import { Random } from "../../../random";
import { Vector } from "../../../vector";
import { Spark } from "../particleClasses/spark";
import { ParticleGroup } from "./particleGroup";

export class Sparks extends ParticleGroup {
    particles: Spark[] = [];

    constructor(ctx: CanvasRenderingContext2D, position: Vector) {
        super(ctx, position);

        for (let i: number = 0; i < 10; i++) {
            let angle: number = Random.range(-Math.PI, Math.PI);
            let distance: number = Random.range(0, 30);
            let life: number = Random.range(0.6, 1);
            this.particles.push(new Spark(ctx, { x: position.x + distance * Math.cos(angle), y: position.y + distance * Math.sin(angle) }, life));
        }
    }

    updateAndRender(elapsedTime: number) {
        let ifExistsParticle: boolean = false;
        this.ctx.fillStyle = "green";
        this.particles.forEach((particle) => {
            particle.updateAndRender(elapsedTime);
            if (!particle.ifDead) ifExistsParticle = true;
        });
        if (!ifExistsParticle) this.ifDead = true;
        this.ctx.globalAlpha = 1;
    }
}
