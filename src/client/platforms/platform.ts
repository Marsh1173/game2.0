import { SerializedPlatform } from "../../serialized/platform";
import { Platform } from "../../objects/platform";
import { Config } from "../../config";
import { sharing } from "webpack";

export class ClientPlatform extends Platform {
    constructor(config: Config, info: SerializedPlatform) {
        super(info.size, info.position, config);
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.fillStyle = this.config.platformColor;
        ctx.shadowColor = this.config.platformColor;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        ctx.shadowColor = "#3d3d3d";
        ctx.fillStyle = "#3d3d3d";
        let breakCount: number = Math.floor(this.size.width / 250);
        for (let i = 1; i < breakCount; i++) {
            ctx.fillRect(this.position.x + (i * this.size.width) / breakCount, this.position.y + 5, 3, this.size.height - 10);
        }

        ctx.restore();
    }
}
