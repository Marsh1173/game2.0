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
        public targetPlayer: Player | undefined,
    ) {
        super(config, id, position, team, health);

        this.size = {"width": 10, "height": 10};
    }

    public setTargetPlayer(player: Player | undefined) {
        this.targetPlayer = player;
    }

    public serialize(): SerializedLavaFly {
        return {
            id: this.id,
            position: this.position,
            momentum: this.momentum,
            team: this.team,
            health: this.health,
            targetPlayerId: (this.targetPlayer != undefined) ? this.targetPlayer.id : undefined,
        };
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

        this.momentum.x *= 0.97;
        this.momentum.y *= 0.97;

        super.update(elapsedTime);
    }
}