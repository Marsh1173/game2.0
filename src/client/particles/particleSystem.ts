import { LinkedList, Node } from "../../linkedList";
import { Vector } from "../../vector";
import { Game } from "../game";
import { safeGetElementById } from "../util";
import { ParticleBase } from "./particleClasses/particleBaseClass";
import { ParticleGroup } from "./particleGroups/particleGroup";
import { Sparks } from "./particleGroups/sparks";

export type particleType = "slash";
export type particleGroupType = "spark";

export class ParticleSystem {
    //protected particleGroups: ParticleGroup[] = [];
    protected particles: ParticleBase[] = [];
    protected particleGroups: LinkedList<ParticleGroup> = new LinkedList();

    constructor(protected readonly particleCtx: CanvasRenderingContext2D, protected readonly game: Game) {}

    public updateAndRender(elapsedTime: number) {
        let i: number = 0;
        /*for (i = 0; i < this.particleGroups.length; i++) {
            this.particleGroups[i].updateAndRender(elapsedTime);
            if (this.particleGroups[i].ifDead) {
                i--;
                this.particleGroups.splice(i, 1);
                console.log("deleted");
            }
        }*/

        for (i = 0; i < this.particles.length; i++) {
            this.particles[i].updateAndRender(elapsedTime);
            if (this.particles[i].ifDead) {
                i--;
                this.particles.splice(i, 1);
            }
        }

        if (!this.particleGroups.ifEmpty()) {
            var group: Node<ParticleGroup> | null = this.particleGroups.head;
            var lastGroup: Node<ParticleGroup> | null = null;
            while (group !== null) {
                group.data.updateAndRender(elapsedTime);

                if (group.data.ifDead) {
                    if (lastGroup) {
                        lastGroup.next = group.next;
                    }
                    group = group.next;
                } else {
                    lastGroup = group;
                    group = group.next;
                }
            }
        }
    }

    public addSparks(position: Vector) {
        this.particleGroups.insertAtBegin(new Sparks(this.particleCtx, position));
    }
}
