import { createTextChangeRange } from "typescript";
import { SingleEntryPlugin } from "webpack";
import { Config } from "../../../../config";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { PlayerActor } from "../../../../objects/Actors/Players/playerActor";
import { Size } from "../../../../size";
import { findDistance, Vector } from "../../../../vector";
import { Game } from "../../../game";
import { createClientEffect } from "../../clientEffects";
import { ClientPlayerActor } from "../../clientPlayers/clientPlayerActor";
import { startAnimation, updateLavaFlyAnimation } from "./clientLavaFlyRender";

export type LavaFlyAnimationState = "stationary" | "dead" | "attacking" | "spawning";

export class ClientLavaFly extends LavaFly {
    protected originalSize: Size = { width: 0, height: 0 };

    protected animationFrame: number = 0;
    public animationState: LavaFlyAnimationState = "stationary";

    public stutterCompensatePosition: Vector = { x: 0, y: 0 };
    public buzzPosition: Vector = { x: 0, y: 0 };
    protected time: number;

    public path: Path2D = new Path2D(
        "M -" + this.size.width / 2 + " -" + this.size.height / 2 + " h " + this.size.width + " v " + this.size.height + " h -" + this.size.width + " Z",
    );

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        protected health: number,
        ifIsSpawning: boolean = false,
        public momentum: Vector = { x: 0, y: 0 },
        targetPlayer?: PlayerActor,
        homePosition?: Vector,
    ) {
        super(config, id, position, team, health, momentum);

        this.time = Math.random() * 10;
        if (homePosition) this.homePosition = homePosition;
        this.targetPlayer = targetPlayer;

        if (ifIsSpawning) {
            this.originalSize.width = this.size.width + 0;
            this.originalSize.height = this.size.height + 0;
            this.size = { width: 1, height: 1 };
            this.animationState = "spawning";
        }
    }

    public updatePositionFromServer(position: Vector, momentum: Vector) {
        this.stutterCompensatePosition.x += -position.x + this.position.x;
        this.stutterCompensatePosition.y += -position.y + this.position.y;

        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    }

    //effects
    protected createEffect = createClientEffect;

    protected updateLavaFlyAnimation = updateLavaFlyAnimation;
    protected startAnimation = startAnimation;

    public attemptReceiveDamage(quantity: number, id: number) {
        super.attemptReceiveDamage(quantity, id);
        //Particles
        //wasHit
    }
    protected die() {
        this.startAnimation("dead");
        super.die();
    }

    public attackTargetPlayer(quantity: number) {
        if (this.targetPlayer) {
            this.startAnimation("attacking");
            this.targetPlayer.attemptReceiveDamage(quantity, this.id);
        }
    }

    public clientLavaFlyUpdate(elapsedTime: number, players: ClientPlayerActor[], lavaFlies: ClientLavaFly[]) {
        this.stutterCompensatePosition.x *= 0.98;
        this.stutterCompensatePosition.y *= 0.98;

        this.updateLavaFlyAnimation(elapsedTime);

        super.lavaFlyUpdate(elapsedTime, lavaFlies);
    }
}
