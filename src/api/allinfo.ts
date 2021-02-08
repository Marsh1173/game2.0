import { SerializedPlatform } from "../serialized/platform";
import { SerializedPlayer } from "../serialized/player";

export interface AllInfo {
    players: SerializedPlayer[];
    platforms: SerializedPlatform[];
}
