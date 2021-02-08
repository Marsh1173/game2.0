import { SerializedPlatform } from "../serialized/platform";
import { Platform } from "../objects/platform";
import { Config } from "../config";
import { Player } from "../objects/player";
import { sharing } from "webpack";

export class ClientPlatform extends Platform {
    constructor(config: Config, info: SerializedPlatform) {
        super(info.size, info.position, config);
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.config.platformColor;
        ctx.shadowColor = this.config.platformColor;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
