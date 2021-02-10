import { SerializedLavaFly } from "../serialized/lavaFly";
import { SerializedPlatform } from "../serialized/platform";
import { SerializedPlayer } from "../serialized/player";

export interface AllInfo {
    lavaFlies: SerializedLavaFly[];
    players: SerializedPlayer[];
    platforms: SerializedPlatform[];
}
