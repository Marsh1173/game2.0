import { isDebuggerStatement } from "typescript";
import { assetManager } from "../../../gameRender/assetmanager";
import { ClientLavaFly, LavaFlyAnimationState } from "./clientLavaFly";

export function renderLavaFlies(lavaFlies: ClientLavaFly[], ctx: CanvasRenderingContext2D) {
    //let img: HTMLImageElement = assetManager.images["lavafly"];

    ctx.shadowColor = "none";
    ctx.shadowBlur = 0;
    ctx.save();
    lavaFlies.forEach((fly) => {
        let ifIsDead: boolean = !fly.checkIfAlive();

        /*if(fly.animationState === "attacking") ctx.fillStyle = "#aa0000";
        else ctx.fillStyle = "#ff1100";*/

        let posX: number = fly.position.x - fly.size.width / 2 + fly.buzzPosition.x + fly.stutterCompensatePosition.x;
        let posY: number = fly.position.y - fly.size.height / 2 + fly.buzzPosition.y + fly.stutterCompensatePosition.y;

        //ctx.globalAlpha = ifIsDead ? 0.5 - fly.action.isDead / 2 : 1;
        //ctx.drawImage(img, posX, posY, fly.size.width, fly.size.height);
        /*ctx.fillRect(posX,
            posY,
            fly.size.width,
            fly.size.height)
        if (!ifIsDead) {
            ctx.fillStyle = "#ff9900"
            ctx.globalAlpha = 0.3;
            ctx.fillRect(posX - 2,
                posY - 2,
                fly.size.width + 4,
                fly.size.height + 4)
        }*/
    });

    /*ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 0;
    lavaFlies.forEach((fly) => {
        if(fly.animationState !== "dead" && fly.health !== fly.maxHealth) {
            ctx.fillStyle = "red";
            ctx.fillRect(fly.position.x - 10, fly.position.y - 20, 20, 3);
            ctx.fillStyle = "green";
            ctx.fillRect(fly.position.x - 10, fly.position.y - 20, 20 * (fly.health / fly.maxHealth), 3);
        }
    });*/
    ctx.restore();
}

export function updateLavaFlyAnimation(this: ClientLavaFly, elapsedTime: number) {
    switch (this.animationState) {
        case "spawning":
            this.size.width += (elapsedTime * 90) / 4;
            this.size.height += (elapsedTime * 90) / 4;

            if (this.animationFrame > 0.4) {
                this.animationState = "stationary";
                this.size.width = this.originalSize.width;
                this.size.height = this.originalSize.height;
            }
        case "stationary":
            this.time += elapsedTime;
            this.buzzPosition.x += Math.sin(this.time * 10) * 3;
            this.buzzPosition.y += Math.sin(this.time * 12.5) * 3;
            this.buzzPosition.x *= 0.9;
            this.buzzPosition.y *= 0.9;
            break;
        case "dead":
            this.momentum.x *= 0.98;
            this.momentum.y *= 0.98;
            this.momentum.y += 8;
            break;
        case "attacking":
            if (this.targetPlayer) {
                this.buzzPosition.x += (this.targetPlayer.position.x - this.position.x) / 7;
                this.buzzPosition.y += (this.targetPlayer.position.y - this.position.y) / 7;
            }
            if (this.animationFrame > 0.1) this.animationState = "stationary";
            break;
        default:
            throw new Error("Unidentified Lava Fly animation state");
    }
    this.animationFrame += elapsedTime;
}

export function startAnimation(this: ClientLavaFly, newState: LavaFlyAnimationState) {
    this.animationState = newState;
    this.animationFrame = 0;
}
