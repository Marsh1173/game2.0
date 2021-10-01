import { Vector } from "../vector";

export interface ServerDebugMessage {
    type: "serverDebugMessage";
    position: Vector;
}
