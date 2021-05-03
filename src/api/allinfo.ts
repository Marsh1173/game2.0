import { SerializedPlayer } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { SerializedDoodad } from "../objects/terrain/doodads/serverDoodad";
import { SerializedFloor } from "../objects/terrain/floor/serverFloor";

export interface AllInfo {
    players: SerializedPlayer[];
    floor: SerializedFloor;
    doodads: SerializedDoodad[];
}
