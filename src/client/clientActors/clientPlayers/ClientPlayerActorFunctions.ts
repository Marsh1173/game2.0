import { ClientPlayerActor } from "./clientPlayerActor";

export function renderClientPlayerActor(this: ClientPlayerActor, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.shadowBlur = 3;
  ctx.shadowColor = this.color;
  ctx.fillStyle = this.color;
  //ctx.fillRect(this.position.x - this.size.width / 2, this.position.y - this.size.height / 2, this.size.width, this.size.height)
  
  ctx.restore();
}