import { Vector } from "../../../../vector";
import { HealthBarType, Model } from "./model";

export class TestMobModel extends Model {
    constructor(ctx: CanvasRenderingContext2D, position: Vector, momentum: Vector, healthBarType: HealthBarType) {
        super(ctx, position, momentum, healthBarType);
    }

    render() {}
}
