import { ModuleFilenameHelpers } from "webpack";
import { Config, defaultConfig } from "../../config";
import { Vector } from "../../vector";
import { assetManager } from "./assetmanager";
import { Game, GlobalClientActors, GlobalClientObjects } from "../game";
import { safeGetElementById } from "../util";
import { ClientPlayer } from "../../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { convertCompilerOptionsFromJson } from "typescript";
import { Size } from "../../size";

export class GameRenderer {
    private readonly canvasDiv = safeGetElementById("canvasDiv");
    //private readonly moon = safeGetElementById("moon");

    private readonly actorCanvas = safeGetElementById("actorCanvas") as HTMLCanvasElement;
    public readonly actorCtx = this.actorCanvas.getContext("2d")!;

    private targetScreenCenter: Vector;
    protected currentScreenCenter: Vector;
    //protected screenPos: Vector;
    public readonly previousWindowSize: Size = { width: 0, height: 0 };

    private targetZoom: number = 1;
    public currentZoom: number = 1;
    private zoomDelay: number = 5;

    public currentScreenPos: Vector = { x: 0, y: 0 };
    public currentScreenSize: Size = { width: 0, height: 0 };

    protected globalClientActors: GlobalClientActors;
    protected globalClientObjects: GlobalClientObjects;
    protected id: number;

    constructor(protected readonly config: Config, protected game: Game, protected gamePlayer: ClientPlayer) {
        this.attemptUpdateCanvasSizes();
        this.targetScreenCenter = this.gamePlayer.position;
        this.currentScreenCenter = { x: this.targetScreenCenter.x + 0, y: this.targetScreenCenter.y + 0 };

        this.globalClientActors = this.game.getGlobalActors();
        this.globalClientObjects = this.game.getGlobalObjects();
        this.id = this.game.getId();
    }

    public updateAndRender(elapsedTime: number) {
        this.updateZoom(elapsedTime);
        this.attemptUpdateCanvasSizes();

        this.updateSliderX();
        this.updateSliderY();

        this.setCanvasTransform(true);
        this.clipXPan();

        this.renderActors(elapsedTime);
    }

    private updateZoom(elapsedTime: number) {
        if (this.targetZoom !== 1) {
            if (this.targetZoom > 1) {
                this.targetZoom /= 1 + elapsedTime;
                if (this.targetZoom < 1) {
                    this.targetZoom = 1;
                }
            } else if (this.targetZoom < 1) {
                this.targetZoom *= 1 + elapsedTime;
                if (this.targetZoom > 1) {
                    this.targetZoom = 1;
                }
            }
        }
        if (this.currentZoom != this.targetZoom) {
            this.currentZoom = (this.currentZoom * (this.zoomDelay - 1) + this.targetZoom) / this.zoomDelay;
            if (this.currentZoom + 0.0001 > this.targetZoom && this.currentZoom - 0.0001 < this.targetZoom) {
                this.currentZoom = this.targetZoom + 0;
                this.zoomDelay = 5;
            }
        }
    }

    private setCanvasTransform(erase: boolean) {
        this.actorCtx.setTransform(
            this.currentZoom,
            0,
            0,
            this.currentZoom,
            (-this.currentScreenCenter.x + this.previousWindowSize.width / this.currentZoom / 2) * this.currentZoom,
            (-this.currentScreenCenter.y + this.previousWindowSize.height / this.currentZoom / 2) * this.currentZoom,
        );
        if (erase) {
            this.actorCtx.clearRect(
                this.currentScreenCenter.x - this.previousWindowSize.width / this.currentZoom / 2,
                this.currentScreenCenter.y - this.previousWindowSize.height / this.currentZoom / 2,
                this.previousWindowSize.width / this.currentZoom,
                this.previousWindowSize.height / this.currentZoom,
            );
        }

        this.currentScreenSize = { width: this.previousWindowSize.width / this.currentZoom, height: this.previousWindowSize.height / this.currentZoom };
        this.currentScreenPos = {
            x: this.currentScreenCenter.x - this.currentScreenSize.width / 2,
            y: this.currentScreenCenter.y - this.currentScreenSize.height / 2,
        };
    }

    private renderActors(elapsedTime: number) {
        this.globalClientObjects.doodads.forEach((doodad) => {
            if (doodad.ifShouldRender(this.currentScreenSize, this.currentScreenPos)) {
                doodad.render();
            }
        });
        this.globalClientObjects.floor.render(this.currentScreenPos, this.currentScreenSize);
        this.globalClientActors.players.forEach((player) => {
            if (player.getActorId() !== this.id) player.render();
        });
        this.gamePlayer.render();
        this.globalClientActors.players.forEach((player) => {
            if (player.getActorId() !== this.id) player.renderHealth();
        });
        this.gamePlayer.renderHealth();

        this.game.particleSystem.updateAndRender(elapsedTime);
    }

    private updateSliderX() {
        this.currentScreenCenter.x = (this.currentScreenCenter.x * 4 + this.targetScreenCenter.x) / 5;
    }

    private clipXPan() {
        if (this.currentScreenPos.x + this.currentScreenSize.width > this.config.xSize) {
            this.currentScreenCenter.x += this.config.xSize - this.currentScreenPos.x - this.currentScreenSize.width;
            this.setCanvasTransform(false);
        }
        if (this.currentScreenPos.x < 0) {
            this.currentScreenCenter.x -= this.currentScreenPos.x;
            this.setCanvasTransform(false);
        }
    }

    private updateSliderY() {
        this.currentScreenCenter.y = (this.currentScreenCenter.y * 4 + (this.targetScreenCenter.y - this.previousWindowSize.height / 10)) / 5;
    }

    private attemptUpdateCanvasSizes() {
        if (Math.min(window.innerWidth, 1920) !== this.previousWindowSize.width) {
            this.previousWindowSize.width = Math.min(window.innerWidth, 1920);
            this.updateCanvasWidth(this.actorCanvas);
        }

        if (window.innerHeight !== this.previousWindowSize.height) {
            let ratio: number = window.innerWidth / 1920;
            if (ratio >= 1) {
                this.previousWindowSize.height = window.innerHeight / ratio;
            } else {
                this.previousWindowSize.height = window.innerHeight;
            }
            this.updateCanvasHeight(this.actorCanvas);
        }
    }

    private updateCanvasWidth(canvas: HTMLCanvasElement) {
        canvas.style.width = "100vw";
        canvas.width = this.previousWindowSize.width;
    }
    private updateCanvasHeight(canvas: HTMLCanvasElement) {
        canvas.style.height = "100vh";
        canvas.height = this.previousWindowSize.height;
    }

    public screenNudge(force: Vector) {
        this.currentScreenCenter.x -= force.x;
        this.currentScreenCenter.y -= force.y;
    }

    public screenZoom(multiplier: number, speed: number = 4) {
        this.targetZoom *= multiplier;
        this.zoomDelay = speed;
    }
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);

    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
