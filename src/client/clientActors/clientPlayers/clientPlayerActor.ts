import { Config } from "../../../config";
import { PlayerActionTypes, PlayerActor } from "../../../objects/Actors/Players/playerActor";
import { Platform } from "../../../objects/platform";
import { SerializedPlayerActor } from "../../../serialized/playerActor";
import { Vector } from "../../../vector";
import { ServerTalker } from "../../servertalker";
import { broadcastActions } from "./ClientPlayerActorActionFunctions";
import { renderClientPlayerActor, renderClientPlayerActorName } from "./ClientPlayerActorRender";

export type AnimationState = "stationary";

export class ClientPlayerActor extends PlayerActor {

    /*private animationFrame: number = 0;
    private animationState: AnimationState = "stationary";*/
    public stutterCompensatePosition: Vector = {x: 0, y: 0};

    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;

    constructor(
        public readonly config: Config,
        info: SerializedPlayerActor,
        protected readonly ifIsGamePlayer: boolean,
        protected readonly serverTalker: ServerTalker
        ) {
        super(config, info.id, info.position, info.team, info.color, info.name, info.health);

    }

    public render = renderClientPlayerActor;
    public renderName = renderClientPlayerActorName;
    private broadcastActions = broadcastActions;

    public updateClientPlayerActor(elapsedTime: number, platforms: Platform[], players: PlayerActor[]) {

        if(!this.ifIsGamePlayer) {
            this.stutterCompensatePosition.x *= 0.98;
            this.stutterCompensatePosition.y *= 0.98;
        }

        if (this.ifIsGamePlayer) this.broadcastActions();

        super.updatePlayerActor(elapsedTime, platforms, players);
    }
}