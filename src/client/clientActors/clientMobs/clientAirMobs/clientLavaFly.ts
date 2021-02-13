import { createTextChangeRange } from "typescript";
import { SingleEntryPlugin } from "webpack";
import { Config } from "../../../../config";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { findDistance, Vector } from "../../../../vector";
import { Game } from "../../../game";
import { ClientPlayer } from "../../../player";


export class ClientLavaFly extends LavaFly {

    public stutterCompensatePosition: Vector = {x: 0, y: 0};
    public buzzPosition: Vector = {x: 0, y: 0};
    private time: number;
    
    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
        public momentum: Vector = {x: 0, y: 0},
        targetPlayer?: ClientPlayer,
        homePosition?: Vector
    ) {
        super(config, id, position, team, health, momentum);

        this.time = Math.random() * 10;
        if (homePosition) this.homePosition = homePosition;
        this.targetPlayer = targetPlayer;
    }

    public render(ctx: CanvasRenderingContext2D) { // implemented in the clientActors renderActors
        //ctx.fillRect(this.position.x - this.size.width / 2 + this.buzzPosition.x, this.position.y - this.size.height / 2 + this.buzzPosition.y, this.size.width, this.size.height);
    }

    public clientLavaFlyUpdate(elapsedTime: number, players: ClientPlayer[], lavaFlies: ClientLavaFly[]) {

        this.time = (this.time + elapsedTime);
        this.buzzPosition.x += Math.sin(this.time * 10) * 2;
        this.buzzPosition.y += Math.sin(this.time * 12.5) * 2;

        this.stutterCompensatePosition.x *= 0.98;
        this.stutterCompensatePosition.y *= 0.98;

        super.lavaFlyUpdate(elapsedTime, lavaFlies);
    }

}