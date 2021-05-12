import { Game } from "../../../../../client/game";
import { findAngle } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer";

export class ClientSword extends ClientPlayer {
    classType: ClassType = "sword";

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "swordPlayer");
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.moveActionsNextFrame.moveLeft || this.moveActionsNextFrame.moveRight);
        this.model.updateModel(elapsedTime);
    }

    public performClientAbility: Record<SwordPlayerAbility, (mousePos: Vector) => void> = {
        slash: (mousePos) => {
            this.playerModel.setAnimation("slash", findAngle(this.position, mousePos));
        },
        whirlwind: () => {
            this.playerModel.setAnimation("whirlwind", 0);
        },
        unavailable: () => {},
    };
    public releaseClientAbility: Record<SwordPlayerAbility, () => void> = {
        slash: () => {},
        whirlwind: () => {
            this.playerModel.setAnimation("stand", 0);
        },
        unavailable: () => {},
    };
}

export type SwordPlayerAbility = "slash" | "whirlwind" | "unavailable"; // | "leechStrike" | "finesse" | "bloodShield" | "parry" | "charge" | "masterpiece";
