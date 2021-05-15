import { Game } from "../../../client/game";
import { defaultConfig } from "../../../config";
import { findAngle } from "../../../findAngle";
import { Size } from "../../../size";
import { rootKeepSign, Vector } from "../../../vector";
import { defaultActorConfig } from "../../newActors/actorConfig";
import { Floor } from "./floor";

export class ClientFloor extends Floor {
    private gameHeight: number = defaultConfig.ySize;

    constructor(
        protected game: Game,
        pointsAndAngles: { point: number; angle: number; slope: number }[],
        pointCount: number,
        resultWidth: number,
        public ctx: CanvasRenderingContext2D,
    ) {
        super(pointCount, resultWidth, pointsAndAngles);
    }

    public render(screenPos: Vector, screenSize: Size) {
        this.ctx.fillStyle = "#1b4a20"; //"white";

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.pointsAndAngles[0].point);
        for (let i: number = 1; i < this.pointCount; i++) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point);
        }
        for (let i: number = this.pointCount - 1; i >= 0; i--) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point + 15);
        }
        this.ctx.fill();

        this.ctx.fillStyle = "#1c262c";

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.gameHeight + 10);
        for (let i: number = 0; i < this.pointCount; i++) {
            this.ctx.lineTo(i * this.resultWidth, this.pointsAndAngles[i].point + 15);
        }
        this.ctx.lineTo((this.pointCount - 1) * this.resultWidth, this.gameHeight + 10);
        this.ctx.fill();

        this.ctx.fillRect(-screenPos.x, this.gameHeight + 5, screenSize.width, screenSize.height - screenPos.y);
    }
}
