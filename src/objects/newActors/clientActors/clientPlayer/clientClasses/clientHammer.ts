import { Game } from "../../../../../client/game";
import { findAngle } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { HammerPlayerModel } from "../../model/playerModels/hammerPlayerModel";
import { ClientPlayer } from "../clientPlayer";

export class ClientHammer extends ClientPlayer {
    classType: ClassType = "hammer";
    model: HammerPlayerModel;

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "hammerPlayer");
        this.model = new HammerPlayerModel(game, this, game.getActorCtx(), playerInfo.position, game.getActorSide(this.id), this.color, this.actorObject.size);
    }

    public performClientAbility: Record<HammerPlayerAbility, (mousePos: Vector) => void> = {
        swing: (mousePos) => {
            this.model.setAnimation("swing1", findAngle(this.position, mousePos));
        },
        pound: () => {
            this.model.setAnimation("pound", 0);
        },
        unavailable: () => {},
    };

    public releaseClientAbility: Record<HammerPlayerAbility, () => void> = {
        swing: () => {},
        pound: () => {},
        unavailable: () => {},
    };
}

export type HammerPlayerAbility = "swing" | "pound" | "unavailable"; // | "exonerate" | "reckoning" | "judgement" | "chains" | "wrath" | "lightning" | "blizzard";
