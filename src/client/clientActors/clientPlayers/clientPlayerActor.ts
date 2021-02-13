import { Config } from "../../../config";
import { PlayerActionTypes, PlayerActor } from "../../../objects/Actors/Players/playerActor";
import { Vector } from "../../../vector";
import { renderClientPlayerActor } from "./ClientPlayerActorFunctions";

export type AnimationState = "stationary";

export class ClientPlayerActor extends PlayerActor {

    /*private animationFrame: number = 0;
    private animationState: AnimationState = "stationary";
    public stutterCompensatePosition: Vector = {x: 0, y: 0};  NOT IMPLEMENTED*/

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
        protected color: string,
    ) {
        super(config, id, position, team, health, color);

    }

    public render = renderClientPlayerActor;

}