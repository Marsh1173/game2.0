import { Game } from "../../../../../client/game";
import { findAngle } from "../../../../../findAngle";
import { Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { translations } from "../../../actorObjects/translations";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { DaggersPlayerModel } from "../../model/playerModels/daggersPlayerModel";
import { ClientPlayer } from "../clientPlayer";

export class ClientDaggers extends ClientPlayer {
    classType: ClassType = "daggers";
    model: DaggersPlayerModel;

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "daggersPlayer");

        this.model = new DaggersPlayerModel(game, this, game.getActorCtx(), playerInfo.position, game.getActorSide(this.id), this.color, this.actorObject.size);
    }

    public performClientAbility: Record<DaggersPlayerAbility, (mousePos: Vector) => void> = {
        stab: (mousePos) => {
            this.model.setAnimation("stab", findAngle(this.position, mousePos));
            //this.game.particleSystem.addDummySlashEffect2(this.position, findMirroredAngle(findAngle(this.position, mousePos)), this.facingRight);
        },
        lunge: (mousePos) => {
            this.model.setAnimation("lunge", 0);
            this.game.particleSystem.addLungeEffect(this.position, this.model.getColor());
        },
        unavailable: () => {},
    };
    public releaseClientAbility: Record<DaggersPlayerAbility, () => void> = {
        stab: () => {},
        lunge: () => {},
        unavailable: () => {},
    };
}

export type DaggersPlayerAbility = "stab" | "lunge" | "unavailable";
