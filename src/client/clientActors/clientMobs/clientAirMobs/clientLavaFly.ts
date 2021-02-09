import { createTextChangeRange } from "typescript";
import { SingleEntryPlugin } from "webpack";
import { Config } from "../../../../config";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { findDistance, Vector } from "../../../../vector";
import { Game } from "../../../game";
import { ClientPlayer } from "../../../player";


export class ClientLavaFly extends LavaFly {

    public buzzPosition: Vector = {x: 0, y: 0};
    private time: number;
    
    constructor(
        public readonly config: Config,
        public position: Vector,
        public team: number,
        public health: number,
    ) {
        super(config, position, team, health);

        this.time = Math.random() * 10;
    }

    public render(ctx: CanvasRenderingContext2D) { // implemented in the clientActors renderActors
        //ctx.fillRect(this.position.x - this.size.width / 2 + this.buzzPosition.x, this.position.y - this.size.height / 2 + this.buzzPosition.y, this.size.width, this.size.height);
    }

    public clientUpdate(elapsedTime: number, players: ClientPlayer[], lavaFlies: ClientLavaFly[]) {

        this.time = (this.time + elapsedTime) % 2.5;
        this.buzzPosition.x += Math.sin(this.time * 10) * 2;
        this.buzzPosition.y += Math.sin(this.time * 12.5) * 2;

        players.forEach(player => {
            if (findDistance(this.position, player.position) < 400) {
                this.momentum.x += (player.position.x - this.position.x) / 4;
                this.momentum.y += (player.position.y - this.position.y) / 3;
            }
        })

        lavaFlies.forEach(fly => {
            if (fly.position != this.position && findDistance(this.position, fly.position) < 20) {
                this.momentum.x -= (fly.position.x - this.position.x) / 2;
                this.momentum.y -= (fly.position.y - this.position.y) / 2;
            }
        })

        this.momentum.x *= 0.95;
        this.momentum.y *= 0.95;

        super.update(elapsedTime);
    }

}