import { Size } from "../../size";
import { Vector } from "../../vector";
import { PlayerModelConfig, playerModelConfig } from "./clientActors/model/playerModels/playerModel";

export interface ActorConfig {
    gameSpeed: number;
    dirtColorNight: string;
    dirtColorDay: string;
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
    globalCooldown: number;
    playerModelConfig: PlayerModelConfig;
}

export const defaultActorConfig: ActorConfig = {
    gameSpeed: 1,
    dirtColorNight: "#1c262c",
    dirtColorDay: "#402f17",
    playerStart: {
        x: 300,
        y: 650,
    },
    playerSize: {
        width: 53,
        height: 55,
    },
    playerCrouchSize: {
        width: 57,
        height: 36,
    },
    playerMass: 10,
    playerMaxHealth: 100,
    playerJumpHeight: 1000,
    maxSidewaysMomentum: 500, //400
    standingSidewaysAcceleration: 6000, //8000
    nonStandingSidewaysAcceleration: 1500, //1500
    fallingAcceleration: 300,
    XPPerLevel: 20,
    LevelXPMultiplier: 1.1,
    globalCooldown: 0.2,
    playerModelConfig,
};
