import { Config } from "../../config";
import { Size } from "../../size";
import { Vector } from "../../vector";
import { Platform } from "../platform";

var actorId: number = 0;

export function getNextActorId(): number {
    actorId++;
    return actorId;
}

export abstract class Actor {

    public ifIsDead: boolean = false;
    public momentum: Vector = {x: 0, y: 0};
    public size: Size = {"width": 0, "height": 0};

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
    ) {

    }

    private updatePosition(elapsedTime: number) {
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;
    }
    private checkSideCollision(elapsedTime: number) {
        let verticalSize: number = (this.size.height / 2);
        let horizontalSize: number = (this.size.width / 2);

        if (this.position.y < verticalSize) {
            this.position.y = verticalSize;
            this.momentum.y = Math.max(this.momentum.y, 0);
        } else if (this.position.y + verticalSize > this.config.ySize) {
            this.position.y = this.config.ySize - verticalSize;
            this.momentum.y = Math.min(this.momentum.y, 0);
        }
        if (this.position.x < horizontalSize) {
            this.position.x = horizontalSize;
            this.momentum.x = 0;
        } else if (this.position.x + horizontalSize > this.config.xSize) {
            this.position.x = this.config.xSize - horizontalSize;
            this.momentum.x = 0;
        }
    }

    public receiveDamage() {

    }

    public receiveHeal() {

    }

    public die() {

    }

    public update(elapsedTime: number) {

        this.updatePosition(elapsedTime);

        this.checkSideCollision(elapsedTime);

    }
}