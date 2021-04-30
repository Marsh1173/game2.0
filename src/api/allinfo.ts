import { SerializedPlayer } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { SerializedDoodad } from "../object/terrain/doodads/serverDoodad";
import { SerializedFloor } from "../object/terrain/floor/serverFloor";
import { SerializedGroundPlatform } from "../serialized/groundPlatform";
import { SerializedLavaFly } from "../serialized/lavaFly";
import { SerializedPlatform } from "../serialized/platform";
import { SerializedPlayerActor } from "../serialized/playerActor";

export interface AllInfo {
    players: SerializedPlayer[];
    floor: SerializedFloor;
    doodads: SerializedDoodad[];
}
