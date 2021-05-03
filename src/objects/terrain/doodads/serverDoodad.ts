import { Vector } from "../../../vector";
import { Doodad, DoodadType } from "./doodad";

export class ServerDoodad extends Doodad {
    constructor(position: Vector, rotation: number, doodadType: DoodadType) {
        super(position, rotation, doodadType);
    }

    public serialize(): SerializedDoodad {
        return {
            type: this.doodadType,
            position: this.position,
            rotation: this.rotation,
        };
    }
}

export interface SerializedDoodad {
    type: DoodadType;
    position: Vector;
    rotation: number;
}
