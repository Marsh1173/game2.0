import { Config } from "../../../../config";
import { SerializedLavaFly } from "../../../../serialized/lavaFly";
import { findDistance, Vector } from "../../../../vector";
import { Platform } from "../../../platform";
import { Player } from "../../../player";
import { AirMob } from "./airMob";

export abstract class LavaFly extends AirMob {

    
    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public health: number,
        public momentum: Vector = {x: 0, y: 0},
    ) {
        super(config, id, position, team, health);

        this.size = {"width": 10, "height": 10};
    }

    public serialize(): SerializedLavaFly {
        return {
            id: this.id,
            position: this.position,
            momentum: this.momentum,
            team: this.team,
            health: this.health,
            targetPlayerId: (this.targetPlayer != undefined) ? this.targetPlayer.id : undefined,
            homePosition: this.homePosition,
        };
    }

    private dampenMomentum(elapsedTime: number) {
        this.momentum.x *= 0.98 ** (elapsedTime * 60);
        this.momentum.y *= 0.96 ** (elapsedTime * 60);
    }

    public lavaFlyUpdate(elapsedTime: number, lavaFlies: LavaFly[]) {

        if (this.targetPlayer != undefined) {
            this.momentum.x += (this.targetPlayer.position.x + 25 - this.position.x) / 6;
            this.momentum.y += (this.targetPlayer.position.y + 25 - this.position.y) / 6;
        } else {
            this.momentum.x += Math.min(50, Math.max(-50, this.homePosition.x - this.position.x)) / 2;
            this.momentum.y += Math.min(50, Math.max(-50, this.homePosition.y - this.position.y)) / 2;
        }

        lavaFlies.forEach(fly => {
            if (fly.position != this.position && findDistance(this.position, fly.position) < 20) {
                this.momentum.x -= (fly.position.x - this.position.x) / 2;
                this.momentum.y -= (fly.position.y - this.position.y) / 2;
            }
        })

        this.checkSideCollision(elapsedTime);
        this.dampenMomentum(elapsedTime);

        super.update(elapsedTime);
    }
}