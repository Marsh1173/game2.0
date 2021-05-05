import { Vector } from "../../../../vector";
import { SideType, Model } from "./model";

export class TestMobModel extends Model {
    constructor(ctx: CanvasRenderingContext2D, position: Vector, momentum: Vector, healthInfo: { health: number; maxHealth: number }, healthBarType: SideType) {
        super(ctx, position, momentum, healthInfo, healthBarType);
    }

    render() {}
}
