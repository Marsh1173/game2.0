import { Vector } from "../../../../vector";
import { renderShape } from "../../../gameRender/gameRenderer";
import { ClientPlayerActor } from "../clientPlayerActor";
import { ClientPlayerModel } from "./object";

export function renderPlayerModel(this: ClientPlayerModel, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.player.color;
    ctx.fillStyle = this.wasHit > 0 ? "red" : this.player.color;
    ctx.transform(1, 0, 0, 1, this.player.position.x + this.stutterCompensatePosition.x, this.player.position.y + this.stutterCompensatePosition.y);
    if (this.rotation != 0) ctx.rotate(this.rotation);
    ctx.fill(this.path);
    ctx.restore();
}
export function renderDeadPlayerModel(this: ClientPlayerModel, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.shadowColor = "none";
    ctx.fillStyle = this.player.color;
    ctx.globalAlpha = 0.2;
    ctx.transform(1, 0, 0, 1, this.player.position.x, this.player.position.y);
    if (this.rotation != 0) ctx.rotate(this.rotation);
    ctx.fill(this.path);
    ctx.restore();
}
export function renderPlayerHealth(this: ClientPlayerModel, ctx: CanvasRenderingContext2D) {
    var playerHealth: number = this.player.getHealth();

    ctx.save();

    ctx.shadowBlur = 0;
    ctx.shadowColor = "none";
    if (this.wasHit > 0) {
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.player.position.x - 20, this.player.position.y - 35, 40, 5);
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(this.player.position.x - 20, this.player.position.y - 35, 40, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(this.player.position.x - 20, this.player.position.y - 35, Math.max(40 * (playerHealth / this.player.maxHealth), 0), 5);

    if (this.whiteDamageBar > 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.player.position.x - 20 + Math.max(40 * (playerHealth / this.player.maxHealth), 0),
            this.player.position.y - 35,
            (this.whiteDamageBar * 2) / 5,
            5,
        );
    }

    ctx.restore();
}
export function renderPlayerName(this: ClientPlayerModel, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "white";
    ctx.fillText(this.player.name, this.player.position.x - this.player.name.length * 2.4, this.player.position.y - 17 - this.player.size.height / 2);
    ctx.restore();
}
export function renderPlayerWeapon(this: ClientPlayerModel, ctx: CanvasRenderingContext2D) {
    this.clientModelWeapon.renderFunction(ctx);
}
var swordBasicAttackShape: Vector[] = [
    { x: 0, y: 0 },
    { x: 20, y: -30 },
    { x: 60, y: -50 },
    { x: 90, y: -20 },
    { x: 75, y: 20 },
    { x: 30, y: 20 },
];
let newShape: Vector[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];

export function renderFocusShape(point: Vector, ctx: CanvasRenderingContext2D, players: ClientPlayerActor[]) {
    ctx.save();

    for (var i: number = 0; i < swordBasicAttackShape.length; i++) {
        newShape[i].x = swordBasicAttackShape[i].x + point.x;
        newShape[i].y = swordBasicAttackShape[i].y + point.y;
    }

    ctx.fillStyle = "red";

    players.forEach((player) => {
        if (player.isInsideHitBox(newShape)) {
            ctx.fillStyle = "green";
        }
    });

    renderShape(ctx, newShape);

    ctx.restore();
}
