import { Size } from "../../size";
import { Vector } from "../../vector";

export interface ActorConfig {
    gameSpeed: number;
    playerStart: Vector;
    playerSize: Size;
    playerCrouchSize: Size;
    playerMass: number;
    playerMaxHealth: number;
    playerJumpHeight: number;
    maxSidewaysMomentum: number;
    standingSidewaysAcceleration: number;
    nonStandingSidewaysAcceleration: number;
    fallingAcceleration: number;
}

export const defaultActorConfig: ActorConfig = {
    gameSpeed: 1,
    playerStart: {
        x: 300,
        y: 650,
    },
    playerSize: {
        width: 48,
        height: 50,
    },
    playerCrouchSize: {
        width: 48,
        height: 30,
    },
    playerMass: 10,
    playerMaxHealth: 100,
    playerJumpHeight: 1200,
    maxSidewaysMomentum: 500,
    standingSidewaysAcceleration: 10000,
    nonStandingSidewaysAcceleration: 2000,
    fallingAcceleration: 350,
};
