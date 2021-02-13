import { Config } from "../../../config";
import { Vector } from "../../../vector";
import { Player } from "../../player";
import { Actor } from "../actor";


export abstract class Mob extends Actor {

    protected homePosition: Vector;
    public targetPlayer: Player | undefined = undefined;


    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
    ) {

        super(config, id, position, team, health);

        this.homePosition = {x: this.position.x + 0, y: this.position.y + 0};
    }

}