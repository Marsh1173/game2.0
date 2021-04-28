import { Vector } from "../../../../vector";
import { Model } from "./model";

export class TestMobModel extends Model {
    constructor(ctx: CanvasRenderingContext2D, position: Vector, momentum: Vector) {
        super(ctx, position, momentum);
    }

    render() {}
}
