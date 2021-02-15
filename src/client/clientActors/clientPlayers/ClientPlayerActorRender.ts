import { Game } from "../../game";
import { ClientPlayerActor } from "./clientPlayerActor";

export function renderClientPlayerActor(this: ClientPlayerActor, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.shadowBlur = 4;
  ctx.shadowColor = this.color;
  ctx.fillStyle = this.color;
  ctx.fillRect(this.position.x - this.size.width / 2, this.position.y - this.size.height / 2, this.size.width, this.size.height)

  ctx.restore();
}

export function renderClientPlayerActorName(this: ClientPlayerActor, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "white";
  ctx.fillText(
    this.name,
    this.position.x - (this.name).length * 2.4,
    this.position.y - 11 - this.size.height / 2,
  );
  ctx.restore();
}