import { Config } from "../config";
import { GroundPlatform } from "../objects/groundPlatform";
import { Platform } from "../objects/platform";
import { serialize } from "../serialized/groundPlatform";
import { Size } from "../size";
import { Vector } from "../vector";

export class ServerGroundPlatform extends GroundPlatform {
    public serialize = serialize;

    constructor(points: Vector[]) {
        super(points);
    }
}

export const getDefaultGroundPlatform = (config: Config) => {
    let gameHeight: number = config.ySize;
    return new ServerGroundPlatform([
        { x: 0, y: gameHeight - 10 },
        { x: 400, y: gameHeight - 20 },
        { x: 800, y: gameHeight - 30 },
        { x: 1200, y: gameHeight - 50 },
        { x: 1600, y: gameHeight - 60 },
        { x: 2000, y: gameHeight - 50 },
        { x: 2400, y: gameHeight - 40 },
        { x: 2800, y: gameHeight - 50 },
        { x: 3200, y: gameHeight - 40 },
        { x: 3800, y: gameHeight - 60 },
        { x: 4000, y: gameHeight - 60 },
    ]);
};
