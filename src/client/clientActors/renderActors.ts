import { ClientLavaFly } from "./clientMobs/clientAirMobs/clientLavaFly";
import { ClientPlayerActor } from "./clientPlayers/clientPlayerActor";

export function renderActors(ctx: CanvasRenderingContext2D, lavaFlies: ClientLavaFly[], players: ClientPlayerActor[]) {

    players.forEach((player) => {
        player.render(ctx);
        player.renderName(ctx);
    })

    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = "orange";
    ctx.fillStyle = "#ff3300";
    lavaFlies.forEach(fly => {
        ctx.fillRect(fly.position.x - fly.size.width / 2 + fly.buzzPosition.x + fly.stutterCompensatePosition.x, fly.position.y - fly.size.height / 2 + fly.buzzPosition.y + fly.stutterCompensatePosition.y, fly.size.width, fly.size.height)
    });
    ctx.restore();
}

/*export function renderHealth(ctx: CanvasRenderingContext2D, players: ClientPlayer[]) {

}*/