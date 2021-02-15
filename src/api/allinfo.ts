import { SerializedLavaFly } from "../serialized/lavaFly";
import { SerializedPlatform } from "../serialized/platform";
import { SerializedPlayerActor } from "../serialized/playerActor";

export interface AllInfo {
    lavaFlies: SerializedLavaFly[];
    playerActors: SerializedPlayerActor[];
    platforms: SerializedPlatform[];
}
