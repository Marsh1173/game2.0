import { SerializedPlayer } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { SerializedDoodad } from "../object/terrain/doodads/serverDoodad";
import { SerializedFloor } from "../object/terrain/floor/serverFloor";

export interface AllInfo {
    players: SerializedPlayer[];
    floor: SerializedFloor;
    doodads: SerializedDoodad[];
}
