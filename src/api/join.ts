import { Config } from "../config";
import { ClassType } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { AllInfo } from "./allinfo";

export interface JoinRequest {
    name: string;
    color: string;
    team: number;
    class: ClassType;
}

export interface JoinResponse {
    id: number;
    info: AllInfo;
    config: Config;
}
