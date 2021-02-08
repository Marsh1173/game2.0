import { Vector } from "../vector";

export interface SerializedPlayer {
    id: number;
    team: number;
    name: string;
    position: Vector;
    momentum: Vector;
    color: string;
    alreadyJumped: number;
    standing: boolean;
    wasStanding: boolean;
    isDead: boolean;
    health: number;
    focusPosition: Vector;
}
