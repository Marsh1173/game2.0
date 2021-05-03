import { ModuleFilenameHelpers } from "webpack";
import { Config, defaultConfig } from "../../config";
import { Vector } from "../../vector";
import { assetManager } from "./assetmanager";
import { Game } from "../game";
import { safeGetElementById } from "../util";
import { ClientPlayer } from "../../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { convertCompilerOptionsFromJson } from "typescript";

export class GameRenderer {
    private readonly canvasDiv = safeGetElementById("canvasDiv");
    private readonly groundExcess = safeGetElementById("groundExcess");
    private readonly moon = safeGetElementById("moon");

    private readonly actorCanvas = safeGetElementById("actorCanvas") as HTMLCanvasElement;
    public readonly actorCtx = this.actorCanvas.getContext("2d")!;

    private readonly backgroundCanvas = safeGetElementById("backgroundCanvas") as HTMLCanvasElement;
    public readonly backgroundCtx = this.backgroundCanvas.getContext("2d")!;

    private readonly buildingLayerOneCanvas = safeGetElementById("buildingLayerOneCanvas") as HTMLCanvasElement;
    public readonly buildingLayerOneCtx = this.buildingLayerOneCanvas.getContext("2d")!;

    protected backgroundScreenPos: Vector = { x: 0, y: 0 };

    constructor(protected readonly config: Config, protected game: Game, protected gamePlayer: ClientPlayer, protected screenPos: Vector) {
        this.setCanvasAttributes(this.backgroundCanvas);
        this.setCanvasAttributes(this.buildingLayerOneCanvas);
        this.setCanvasAttributes(this.actorCanvas);

        this.updateHTML();

        this.canvasDiv.style.maxHeight = String(defaultConfig.ySize) + "px";
        this.groundExcess.style.top = String(defaultConfig.ySize) + "px";

        //this.drawBackgroundCanvases(); draws pillars
    }

    public updateAndRender(elapsedTime: number) {
        this.updateSliderX();
        this.updateSliderY();
        //this.attemptUpdateHTML();

        this.renderBackground();

        this.renderActorCTX();
    }

    private renderActorCTX() {
        this.actorCtx.clearRect(0, 0, this.config.xSize, this.config.ySize);
        this.actorCtx.setTransform(1, 0, 0, 1, this.screenPos.x, this.screenPos.y);

        this.renderActors();

        //renderFocusShape({ x: this.mousePos.x - this.screenPos.x, y: this.mousePos.y - this.screenPos.y }, this.actorCtx, this.playerActors); //DEBUGGING
    }

    private renderActors = renderActors;

    private updateSliderX() {
        const windowWidth: number = window.innerWidth;

        //check if screen is bigger than field
        if (this.config.xSize < windowWidth) {
            this.screenPos.x = 0;
        } else {
            let temp = this.screenPos.x + (-this.gamePlayer.position.x + windowWidth / 2 - this.screenPos.x) / 10;
            //make a temp position to check where it would be updated to
            if (this.screenPos.x < temp + 0.1 && this.screenPos.x > temp - 0.1) {
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

        let temp = this.screenPos.y + ((-this.gamePlayer.position.y + windowHeight / 2) / 2 - this.screenPos.y) / 10;
        //make a temp position to check where it would be updated to
        if (this.screenPos.y < temp + 0.1 && this.screenPos.y > temp - 0.1) {
            return; //so it's not updating even while idle
        }
        this.screenPos.y = temp;
    }

    private attemptUpdateHTML() {
        if (
            this.backgroundScreenPos.x > this.screenPos.x + 1 ||
            this.backgroundScreenPos.x < this.screenPos.x - 1 ||
            this.backgroundScreenPos.y > this.screenPos.y + 1 ||
            this.backgroundScreenPos.y < this.screenPos.y - 1
        ) {
            this.updateHTML();
        }
    }

    private updateHTML() {
        this.buildingLayerOneCanvas.style.transform = "translate(" + this.screenPos.x + "px, " + this.screenPos.y + "px)";
        this.backgroundCanvas.style.transform = "translate(" + this.screenPos.x / 10 + "px, " + this.screenPos.y / 10 + "px)"; // expensive, maybe theres a better way to do it?
        this.backgroundScreenPos.x = this.screenPos.x + 0;
        this.backgroundScreenPos.y = this.screenPos.y + 0;
    }

    private setCanvasAttributes(canvas: HTMLCanvasElement) {
        canvas.style.width = this.config.xSize + "px";
        canvas.style.height = this.config.ySize + "px";
        canvas.width = this.config.xSize;
        canvas.height = this.config.ySize;
    }

    private drawBackgroundCanvases() {
        this.renderBackground();

        /*let img1 = assetManager.images["pillars"];
        this.buildingLayerOneCtx.drawImage(img1, 600, this.config.ySize - (img1.height * 2) / 3, (img1.width * 2) / 3, (img1.height * 2) / 3);

        let img2 = assetManager.images["pillarSpiral"];
        this.buildingLayerOneCtx.drawImage(img2, 1500, this.config.ySize - img2.height - 50, img2.width, img2.height);*/
    }

    private renderBackground(this: GameRenderer) {
        this.moon.style.left = String(300 + this.screenPos.x / 20) + "px";
    }
}

function renderActors(this: GameRenderer) {
    this.game.players.forEach((player) => {
        //player.render();
    });
}

export function renderShape(ctx: CanvasRenderingContext2D, shape: Vector[]) {
    ctx.beginPath();
    ctx.moveTo(shape[0].x, shape[0].y);
    for (var i: number = 1; i < shape.length; i++) {
        ctx.lineTo(shape[i].x, shape[i].y);
    }
    ctx.fill();
}
