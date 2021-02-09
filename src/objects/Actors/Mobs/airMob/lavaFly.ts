import { Config } from "../../../../config";
import { Vector } from "../../../../vector";
import { Platform } from "../../../platform";
import { AirMob } from "./airMob";


export abstract class LavaFly extends AirMob {

    constructor(
        public readonly config: Config,
        public position: Vector,
        public team: number,
        public health: number,
    ) {
        super(config, position, team, health);

        this.size = {"width": 10, "height": 10};
    }

    update(elapsedTime: number) {

        super.update(elapsedTime);
    }
}