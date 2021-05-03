import { Config } from "../config";
import { ClassType } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { AllInfo } from "./allinfo";

export interface JoinRequest {
    name: string;
    color: string;
    team: number;
    class: ClassType;
    classLevel: number;
    classSpec: number;
}

export interface JoinResponse {
    id: number;
    info: AllInfo;
    config: Config;
}
