import { Vector } from "../../../vector";
import { ParticleBase } from "../particleClasses/particleBaseClass";

export abstract class ParticleGroup {
    protected particles: ParticleBase[] = [];

    public ifDead: boolean = false;

    constructor(protected readonly ctx: CanvasRenderingContext2D, protected position: Vector) {}

    public abstract updateAndRender(elapsedTime: number): void;
}
