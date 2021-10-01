import { Size } from "../size";
import { Vector } from "../vector";
import { defaultActorConfig } from "./newActors/actorConfig";

class DebugPlayer {
    private readonly playerSize: Size = defaultActorConfig.playerSize;
    constructor(public readonly position: Vector, private readonly ctx: CanvasRenderingContext2D) {}

    public render() {
        this.ctx.strokeStyle = "cyan";
        this.ctx.lineWidth = 2;

        this.ctx.strokeRect(
            this.position.x - this.playerSize.width / 2,
            this.position.y - this.playerSize.height / 2,
            this.playerSize.width,
            this.playerSize.height,
        );
    }

    public updatePosition(position: Vector) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
}
