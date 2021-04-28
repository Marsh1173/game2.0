import { Size } from "./size";
import { Vector } from "./vector";

const xSize: number = 5000;
const ySize: number = 1000;

export interface Config {
    /**
     * Decides player height and width
     */
    playerSize: Size;
    playerStart: Vector;
    playerJumpHeight: number;
    xSize: number;
    ySize: number;
    playerKeys: {
        up: string;
        down: string;
        left: string;
        right: string;
        basicAttack: string;
        secondAttack: string;
        firstAbility: string;
        secondAbility: string;
        thirdAbility: string;
        fourthAbility: string;
    };
    platformColor: string;
    fallingAcceleration: number;
    standingSidewaysAcceleration: number;
    nonStandingSidewaysAcceleration: number;
    maxSidewaysMomentum: number;
    gameSpeed: number;
    updatePlayerFocusSpeed: number;
}

export const defaultConfig: Config = {
    playerSize: { width: 48, height: 50 },
    playerStart: {
        x: 300,
        y: 650,
    },
    playerJumpHeight: 1200,
    xSize,
    ySize,
    playerKeys: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
        basicAttack: "leftMouseDown",
        secondAttack: "rightMouseDown",
        firstAbility: "ShiftLeft",
        secondAbility: "Space",
        thirdAbility: "KeyQ",
        fourthAbility: "KeyE",
    },
    platformColor: "grey",
    fallingAcceleration: 3500,
    standingSidewaysAcceleration: 10000,
    nonStandingSidewaysAcceleration: 4000,
    maxSidewaysMomentum: 600,
    gameSpeed: 1,
    updatePlayerFocusSpeed: 0.05,
};
