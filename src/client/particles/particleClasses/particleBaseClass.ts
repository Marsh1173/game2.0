import { Vector } from "../../../vector";

export abstract class ParticleBase {
    public ifDead: boolean = false;
    protected currentLife: number;

    constructor(protected readonly ctx: CanvasRenderingContext2D, protected position: Vector, protected lifeTime: number) {
        this.currentLife = this.lifeTime + 0;
    }

    public updateAndRender(elapsedTime: number) {
        if (this.currentLife > 0) {
            this.currentLife -= elapsedTime;
            if (this.currentLife < 0) {
                this.currentLife = 0;
                this.ifDead = true;
            } else {
                this.render();
            }
        }
    }

    protected abstract render(): void;
}
