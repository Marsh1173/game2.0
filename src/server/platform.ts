import { Config } from "../config";
import { Platform } from "../objects/platform";
import { Size } from "../size";
import { Vector } from "../vector";

export class ServerPlatform extends Platform {
    constructor(size: Size, position: Vector, config: Config) {
        super(size, position, config);
    }

    public update() {}
}

export const getDefaultPlatformList = (config: Config) => {
    return [
        new ServerPlatform(
            {
                height: 50,
                width: 3500,
            },
            {
                x: 250,
                y: 750,
            },
            config,
        )
    ];
};
