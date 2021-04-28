import { Vector } from "../../../../vector";

export abstract class Model {
    protected targetPosition: Vector = { x: 0, y: 0 };

    constructor(protected ctx: CanvasRenderingContext2D, protected position: Vector, protected momentum: Vector) {}

    public abstract render(): void;

    public processPositionUpdateDifference(posDifference: Vector) {
        this.targetPosition.x = posDifference.x + 0;
        this.targetPosition.y = posDifference.y + 0;

        console.log(posDifference);
    }

    public updateTargetPosition(elapsedTime: number) {
        if (this.targetPosition.x === 0 && this.targetPosition.y === 0) return;

        if (this.targetPosition.x > 3) {
            this.targetPosition.x -= 10 * elapsedTime;
        } else if (this.targetPosition.x < -3) {
            this.targetPosition.x += 10 * elapsedTime;
        } else {
            this.targetPosition.x = 0;
        }

        if (this.targetPosition.y > 3) {
            this.targetPosition.y -= 10 * elapsedTime;
        } else if (this.targetPosition.y < -3) {
            this.targetPosition.y += 10 * elapsedTime;
        } else {
            this.targetPosition.y = 0;
        }
    }
}
