import { Game } from "../../../../../client/game";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer";

export class ClientHammer extends ClientPlayer {
    classType: ClassType = "hammer";

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "hammerPlayer");
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.moveActionsNextFrame.moveLeft || this.moveActionsNextFrame.moveRight);
        this.model.updateModel(elapsedTime);
    }

    public performClientAbility: Record<HammerPlayerAbility, (mousePos: Vector) => void> = {
        swing: (mousePos) => {},
        pound: () => {},
        unavailable: () => {},
    };

    public releaseClientAbility: Record<HammerPlayerAbility, () => void> = {
        swing: () => {},
        pound: () => {},
        unavailable: () => {},
    };
}

export type HammerPlayerAbility = "swing" | "pound" | "unavailable"; // | "exonerate" | "reckoning" | "judgement" | "chains" | "wrath" | "lightning" | "blizzard";
