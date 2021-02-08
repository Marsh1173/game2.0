import { Config } from "../config";
import { AllInfo } from "./allinfo";

export interface JoinRequest {
    name: string;
    color: string;
    team: number;
}

export interface JoinResponse {
    id: number;
    info: AllInfo;
    config: Config;
}
