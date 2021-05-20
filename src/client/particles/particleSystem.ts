import { LinkedList, Node } from "../../linkedList";
import { Vector } from "../../vector";
import { Game } from "../game";
import { safeGetElementById } from "../util";
import { DummySlashEffect2 } from "./particleClasses/dummySlashEffect2";
import { DummyWhirlwindEffect } from "./particleClasses/dummyWhirlwindEffect";
import { ParticleBase } from "./particleClasses/particleBaseClass";
import { ParticleGroup } from "./particleGroups/particleGroup";
import { Sparks } from "./particleGroups/sparks";

export type particleType = "slash";
export type particleGroupType = "spark";

export class ParticleSystem {
    //protected particleGroups: ParticleGroup[] = [];
    //protected particles: ParticleBase[] = [];
    protected particleGroups: LinkedList<ParticleGroup> = new LinkedList();
    protected particles: LinkedList<ParticleBase> = new LinkedList();

    constructor(protected readonly particleCtx: CanvasRenderingContext2D, protected readonly game: Game) {}

    public updateAndRender(elapsedTime: number) {
        if (!this.particleGroups.ifEmpty()) {
            let group: Node<ParticleGroup> | null = this.particleGroups.head;
            let lastGroup: Node<ParticleGroup> | null = null;
            while (group !== null) {
                group.data.updateAndRender(elapsedTime);

                if (group.data.ifDead) {
                    if (lastGroup) {
                        lastGroup.next = group.next;
                    } else {
                        this.particleGroups.head = group.next;
                    }
                    group = group.next;
                } else {
                    lastGroup = group;
                    group = group.next;
                }
            }
        }

        if (!this.particles.ifEmpty()) {
            let particle: Node<ParticleBase> | null = this.particles.head;
            let lastParticle: Node<ParticleBase> | null = null;
            while (particle !== null) {
                particle.data.updateAndRender(elapsedTime);

                if (particle.data.ifDead) {
                    if (lastParticle) {
                        lastParticle.next = particle.next;
                    } else {
                        this.particles.head = particle.next;
                    }
                    particle = particle.next;
                } else {
                    lastParticle = particle;
                    particle = particle.next;
                }
            }
        }
    }

    public addSparks(position: Vector) {
        this.particleGroups.insertAtBegin(new Sparks(this.particleCtx, position));
    }

    public addDummySlashEffect2(position: Vector, angle: number, flipX: boolean) {
        this.particles.insertAtBegin(new DummySlashEffect2(this.particleCtx, position, angle, flipX));
    }

    public addDummyWhirlwindEffect(position: Vector, flipX: boolean): DummyWhirlwindEffect {
        let tempPtr: DummyWhirlwindEffect = new DummyWhirlwindEffect(this.particleCtx, position, flipX);
        this.particles.insertAtBegin(tempPtr);
        return tempPtr;
    }
}
