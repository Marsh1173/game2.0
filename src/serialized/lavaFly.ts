import { ServerLavaFly } from "../server/serverActors/serverMobs/serverAirMobs/serverLavaFly";
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


export function serialize(this: ServerLavaFly): SerializedLavaFly {
    return {
        id: this.id,
        position: this.position,
        momentum: this.momentum,
        team: this.team,
        health: this.health,
        targetPlayerId: (this.targetPlayer != undefined) ? this.targetPlayer.id : undefined,
        homePosition: this.homePosition,
    };
}