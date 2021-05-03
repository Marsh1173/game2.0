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
    XPPerLevel: number;
    LevelXPMultiplier: number;
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
    playerJumpHeight: 1000,
    maxSidewaysMomentum: 500, //400
    standingSidewaysAcceleration: 8000, //8000
    nonStandingSidewaysAcceleration: 1500, //1500
    fallingAcceleration: 300,
    XPPerLevel: 20,
    LevelXPMultiplier: 1.1,
};
