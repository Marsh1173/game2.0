import { Player } from "../objects/player";
import { Vector } from "../vector";

export interface SerializedLavaFly {
    id: number,
    position: Vector,
    momentum: Vector,
    team: number,
    health: number,
    targetPlayerId: number | undefined,
    homePosition: Vector
}
