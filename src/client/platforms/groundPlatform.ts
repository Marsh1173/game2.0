import { Config } from "../../config";
import { sharing } from "webpack";
import { SerializedGroundPlatform } from "../../serialized/groundPlatform";
import { GroundPlatform } from "../../objects/groundPlatform";

export class ClientGroundPlatform extends GroundPlatform {
    constructor(info: SerializedGroundPlatform) {
        super(info.points);
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#1c262c";

        ctx.beginPath();
        ctx.moveTo(this.pointsAndAngles[0].pointPosition.x, this.pointsAndAngles[0].pointPosition.y + 10);
        for (var i: number = 1; i < this.pointsAndAngles.length; i++) {
            ctx.lineTo(this.pointsAndAngles[i].pointPosition.x, this.pointsAndAngles[i].pointPosition.y + 10);
        }
        ctx.lineTo(
            this.pointsAndAngles[this.pointsAndAngles.length - 1].pointPosition.x,
            this.pointsAndAngles[this.pointsAndAngles.length - 1].pointPosition.y + 100,
        );
        ctx.lineTo(this.pointsAndAngles[0].pointPosition.x, this.pointsAndAngles[0].pointPosition.y + 100);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#1b4a20";

        ctx.beginPath();
        ctx.moveTo(this.pointsAndAngles[0].pointPosition.x, this.pointsAndAngles[0].pointPosition.y);
        for (var i: number = 1; i < this.pointsAndAngles.length; i++) {
            ctx.lineTo(this.pointsAndAngles[i].pointPosition.x, this.pointsAndAngles[i].pointPosition.y);
        }
        for (var i: number = this.pointsAndAngles.length - 1; i >= 0; i--) {
            ctx.lineTo(this.pointsAndAngles[i].pointPosition.x, this.pointsAndAngles[i].pointPosition.y + 20);
        }
        ctx.closePath();
        ctx.fill();
    }
}

export function renderBuildings(ctx: CanvasRenderingContext2D) {}

export function renderBackground(ctx: CanvasRenderingContext2D, xSize: number, ySize: number) {
    var nightGradient: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 1000);
    nightGradient.addColorStop(0.2, "#132249");
    nightGradient.addColorStop(0.5, "#1b3067");
    //nightGradient.addColorStop(0.71, "#101512");
    ctx.fillStyle = nightGradient;
    ctx.fillRect(0, 0, xSize, ySize);

    var moonGradient: CanvasGradient = ctx.createRadialGradient(300, 200, 5, 300, 200, 200);
    moonGradient.addColorStop(0.5, "#b8c5d6ff");
    moonGradient.addColorStop(0.54, "#b8c5d633");
    moonGradient.addColorStop(1, "#b8c5d600");
    ctx.fillStyle = moonGradient;
    ctx.fillRect(0, 0, xSize, ySize);
}
