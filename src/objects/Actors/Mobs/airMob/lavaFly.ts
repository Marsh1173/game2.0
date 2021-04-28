import { Config } from "../../../../config";
import { findDistance, Vector } from "../../../../vector";
import { ActorType } from "../../actor";
import { AirMob } from "./airMob";

export abstract class LavaFly extends AirMob {
    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        protected health: number,
        public momentum: Vector = { x: 0, y: 0 },
    ) {
        //config, id, position, team, health, maxHealth, deathTime, mass, size
        super(config, id, position, team, health, 10, 1, 0.5, { width: 20, height: 20 });
    }

    public getActorType(): ActorType {
        return "lavafly";
    }
    protected abstract attackTargetPlayer(quantity: number): void;

    private dampenMomentum(elapsedTime: number) {
        this.momentum.x *= 0.98 ** (elapsedTime * 60);
        this.momentum.y *= 0.96 ** (elapsedTime * 60);
    }

    protected lavaFlyUpdate(elapsedTime: number, lavaFlies: LavaFly[]) {
        this.resetUpdateStats();
        this.updateEffects(elapsedTime);

        if (this.checkIfAlive()) {
            if (this.targetPlayer !== undefined) {
                this.momentum.x += (this.targetPlayer.position.x - this.position.x) / 6;
                this.momentum.y += (this.targetPlayer.position.y - this.position.y) / 6;
            } else {
                this.momentum.x += Math.min(50, Math.max(-50, this.homePosition.x - this.position.x)) / 2;
                this.momentum.y += Math.min(50, Math.max(-50, this.homePosition.y - this.position.y)) / 2;
            }

            lavaFlies.forEach((fly) => {
                if (fly.position != this.position && findDistance(this.position, fly.position) < 20) {
                    this.momentum.x -= (fly.position.x - this.position.x) / 2;
                    this.momentum.y -= (fly.position.y - this.position.y) / 2;
                }
            });
            this.checkSideCollision(elapsedTime);
            this.dampenMomentum(elapsedTime);
        }

        this.updatePosition(elapsedTime);

        super.update(elapsedTime);
    }
}
