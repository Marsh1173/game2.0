import { SerializedPlayer } from "../serialized/player";
import { ServerTalker } from "./servertalker";
import { Player } from "../objects/player";
import { Vector } from "../vector";
import { Config } from "../config";
import { Platform } from "../objects/platform";
import { assetManager } from "./assetmanager";
import { Size } from "../size";
import { ids } from "webpack";
import { Game } from "./game";

export class ClientPlayer extends Player {
    constructor(
        config: Config,
        info: SerializedPlayer,
        private readonly serverTalker: ServerTalker,
        private readonly isClientPlayer: number,
    ) {
        super(
            config,
            info.id,
            info.team,
            info.name,
            info.position,
            info.momentum,
            info.color,
            info.alreadyJumped,
            info.standing,
            info.wasStanding,
            info.isDead,
            info.health,
            info.focusPosition,
        );
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save;

        ctx.shadowBlur = 7;
        ctx.shadowColor = this.color; //red?
        ctx.fillStyle = this.color;

        ctx.globalAlpha = this.isDead ? 0.1 : 1;
        ctx.fillRect(this.position.x, this.position.y, this.config.playerSize.width, this.config.playerSize.height);

        //reset


        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 2;
        ctx.shadowColor = "gray";
    }

    public renderHealth(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x + this.config.playerSize.width / 8, this.position.y - 10, (this.config.playerSize.width * 3) / 4, 5);
        ctx.fillStyle = "#32a852";
        ctx.fillRect(this.position.x + this.config.playerSize.width / 8, this.position.y - 10, (Math.max((this.config.playerSize.width * this.health) / (100), 0) * 3) / 4, 5);

        ctx.restore();
    }

    public renderName(ctx: CanvasRenderingContext2D, color: string) {
        ctx.save();
        ctx.shadowBlur = 0;

        ctx.fillStyle = color;
        ctx.fillText(
            this.name,
            this.position.x + this.config.playerSize.width / 2 - (this.name).length * 2.4,
            this.position.y - 11,
        );
        ctx.restore();
    }

    public renderFocus(ctx: CanvasRenderingContext2D) { // for focus debugging
        ctx.fillStyle = "red";
        ctx.fillRect(this.focusPosition.x - 3, this.focusPosition.y - 3, 6, 6);
    }


    protected broadcastActions() {

        this.serverTalker.sendMessage({
            type: "clientPlayerActions",
            id: this.id,
            moveRight: this.actionsNextFrame.moveRight,
            moveLeft: this.actionsNextFrame.moveLeft,
            jump: this.actionsNextFrame.jump,
    
            focusPosition: this.focusPosition,
            position: this.position,
            momentum: this.momentum,
            health: this.health,
        });

        super.broadcastActions();
    }
}
