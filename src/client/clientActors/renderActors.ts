import { ClientPlayer } from "../player";
import { ClientLavaFly } from "./clientMobs/clientAirMobs/clientLavaFly";

export function renderActors(ctx: CanvasRenderingContext2D, lavaFlies: ClientLavaFly[]) {

    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = "orange";
    lavaFlies.forEach(fly => {
        ctx.fillStyle = (fly.targetPlayer) ? "#ff3300" : "#ff7700";
        ctx.fillRect(fly.position.x - fly.size.width / 2 + fly.buzzPosition.x, fly.position.y - fly.size.height / 2 + fly.buzzPosition.y, fly.size.width, fly.size.height)
    });
    ctx.restore();
}

export function renderHealth(ctx: CanvasRenderingContext2D, players: ClientPlayer[]) {

}