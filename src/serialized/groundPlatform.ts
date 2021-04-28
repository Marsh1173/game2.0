import { ServerGroundPlatform } from "../server/groundPlatform";
import { Size } from "../size";
import { Vector } from "../vector";

export interface SerializedGroundPlatform {
    points: Vector[];
}

export function serialize(this: ServerGroundPlatform): SerializedGroundPlatform {
    var points: Vector[] = [];
    this.pointsAndAngles.forEach((point) => {
        points.push(point.pointPosition);
    });
    return {
        points,
    };
}
