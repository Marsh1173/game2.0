import { rotateVector, Vector } from "../../../vector";

export type TranslationName = "testTranslation" | "shurikenDash";

export const translations: Record<TranslationName, Translation> = {
    testTranslation: {
        keys: [
            { pos: { x: 20, y: 20 }, time: 0.1 },
            { pos: { x: 30, y: 40 }, time: 0.1 },
            { pos: { x: 100, y: -120 }, time: 0.2 },
            { pos: { x: 30, y: 40 }, time: 0.1 },
            { pos: { x: 20, y: 20 }, time: 0.1 },
        ],
        flipAcrossY: true,
        ignoreCollision: true,
        ignoreGravity: false,
    },
    shurikenDash: {
        keys: [
            { pos: { x: -15, y: 0 }, time: 0.025 },
            { pos: { x: -130, y: 0 }, time: 0.15 },
        ],
        flipAcrossY: false,
        ignoreCollision: false,
        ignoreGravity: false,
    },
};

export interface Translation {
    keys: PositionKey[];
    flipAcrossY: boolean;
    ignoreCollision: boolean;
    ignoreGravity: boolean;
}

export interface PositionKey {
    pos: Vector;
    time: number;
}

export function rotateKey(key: PositionKey, angle: number, flipY: boolean): PositionKey {
    return {
        pos: rotateVector(angle, {
            x: key.pos.x,
            y: key.pos.y * (flipY && (angle >= Math.PI / 2 || angle <= Math.PI / -2) ? -1 : 1),
        }),
        time: key.time,
    };
}

export interface TranslationData {
    translateInfo: Translation | undefined;
    keyIndex: number;
    originalPosition: Vector;
    counter: number;
    keyTimeLength: number;
    angle: number;
}
