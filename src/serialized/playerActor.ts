import { ServerPlayerActor } from "../server/serverActors/serverPlayers/serverPlayerActor";
import { Vector } from "../vector";

export interface SerializedPlayerActor {
    id: number,
    position: Vector,
    momentum: Vector,
    team: number,
    health: number,
    color: string,
    name: string,
}


export function serialize(this: ServerPlayerActor): SerializedPlayerActor {
    return {
        id: this.id,
        position: this.position,
        momentum: this.momentum,
        team: this.team,
        health: this.health,
        color: this.color,
        name: this.name
    };
}