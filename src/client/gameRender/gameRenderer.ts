import { ModuleFilenameHelpers } from "webpack";
import { Config, defaultConfig } from "../../config";
import { Vector } from "../../vector";
import { assetManager } from "./assetmanager";
import { Game } from "../game";
import { safeGetElementById } from "../util";
import { ClientPlayer } from "../../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { convertCompilerOptionsFromJson } from "typescript";
import { Size } from "../../size";

export class GameRenderer {
    private readonly canvasDiv = safeGetElementById("canvasDiv");
    private readonly moon = safeGetElementById("moon");

    private readonly actorCanvas = safeGetElementById("actorCanvas") as HTMLCanvasElement;
    public readonly actorCtx = this.actorCanvas.getContext("2d")!;

    public readonly previousWindowSize: Size = { width: 0, height: 0 };

    constructor(protected readonly config: Config, protected game: Game, protected gamePlayer: ClientPlayer, protected screenPos: Vector) {
        this.setCanvasAttributes(this.actorCanvas);
        this.attemptUpdateCanvasSizes();
    }

    public updateAndRender(elapsedTime: number) {
        this.updateSliderX();
        this.updateSliderY();

        this.attemptUpdateCanvasSizes();

        this.renderActorCTX();
    }

    private renderActorCTX() {
        this.actorCtx.clearRect(-this.screenPos.x - 10, -this.screenPos.y - 10, window.innerWidth + 20, window.innerHeight + 20);
        this.actorCtx.setTransform(1, 0, 0, 1, Math.floor(this.screenPos.x), Math.floor(this.screenPos.y));
    }

    private updateSliderX() {
        const windowWidth: number = window.innerWidth;

        //check if screen is bigger than field
        if (this.config.xSize < windowWidth) {
            this.screenPos.x = 0;
        } else {
            let temp = this.screenPos.x + (-this.gamePlayer.position.x + windowWidth / 2 - this.screenPos.x) / 10;
            //make a temp position to check where it would be updated to
            if (this.screenPos.x < temp + 0.5 && this.screenPos.x > temp - 0.5) {
                return; //so it's not updating even while idle
            }

            if (temp > 0) {
                // if they're too close to the left wall
                if (this.screenPos.x === 0) return;
                this.screenPos.x = 0;
            } else if (temp < -(this.config.xSize - windowWidth)) {
                // or the right wall
                if (this.screenPos.x === -(this.config.xSize - windowWidth)) return;
                this.screenPos.x = -(this.config.xSize - windowWidth);
            } else {
                this.screenPos.x = temp; // otherwise the predicted position is fine
            }
        }
    }

    private updateSliderY() {
        const windowHeight: number = window.innerHeight;

        let temp = -this.gamePlayer.position.y + (windowHeight * 2) / 3;
        //make a temp position to check where it would be updated to

        if (this.screenPos.y < temp + 1 && this.screenPos.y > temp - 1) {
            return; //so it's not updating even while idle
        }

        this.screenPos.y = (temp + this.screenPos.y * 9) / 10;
    }

    private attemptUpdateCanvasSizes() {
        if (window.innerWidth !== this.previousWindowSize.width || window.innerHeight !== this.previousWindowSize.height) {
            this.previousWindowSize.height = window.innerHeight;
            this.previousWindowSize.width = window.innerWidth;
            this.updateCanvasSize(this.actorCanvas);
        }
    }

    private updateCanvasSize(canvas: HTMLCanvasElement) {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.width = this.previousWindowSize.width;
        canvas.height = this.previousWindowSize.height;
    }

    private setCanvasAttributes(canvas: HTMLCanvasElement) {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        /*canvas.style.width = this.config.xSize + "px";
        canvas.style.height = this.config.ySize + "px";
        canvas.width = this.config.xSize;
        canvas.height = this.config.ySize;*/
    }
}
