import { Game } from "../../../../../client/game";
import { DummyWhirlwindEffect } from "../../../../../client/particles/particleClasses/dummyWhirlwindEffect";
import { findAngle } from "../../../../../findAngle";
import { findMirroredAngle, Vector } from "../../../../../vector";
import { ClientDoodad } from "../../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../../terrain/floor/clientFloor";
import { ClassType, SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { SwordPlayerModel } from "../../model/playerModels/swordPlayerModel";
import { ClientPlayer } from "../clientPlayer";

export class ClientSword extends ClientPlayer {
    classType: ClassType = "sword";
    model: SwordPlayerModel;

    protected whirlwindEffectparticle: DummyWhirlwindEffect | undefined = undefined;

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo, "swordPlayer");

        this.model = new SwordPlayerModel(game, this, game.getActorCtx(), playerInfo.position, game.getActorSide(this.id), this.color, this.actorObject.size);
    }

    public performClientAbility: Record<SwordPlayerAbility, (mousePos: Vector) => void> = {
        slash: (mousePos) => {
            this.model.setAnimation("slash1", findAngle(this.position, mousePos));
            this.game.particleSystem.addDummySlashEffect2(this.position, findMirroredAngle(findAngle(this.position, mousePos)), this.facingRight);
        },
        whirlwind: () => {
            this.model.setAnimation("whirlwind", 0);
            this.whirlwindEffectparticle = this.game.particleSystem.addDummyWhirlwindEffect(this.position, this.facingRight);
        },
        unavailable: () => {},
    };
    public releaseClientAbility: Record<SwordPlayerAbility, () => void> = {
        slash: () => {},
        whirlwind: () => {
            this.model.setAnimation("stand", 0);
            if (this.whirlwindEffectparticle !== undefined) {
                this.whirlwindEffectparticle.prematureEnd();
                this.whirlwindEffectparticle = undefined;
            }
        },
        unavailable: () => {},
    };
}

export type SwordPlayerAbility = "slash" | "whirlwind" | "unavailable"; // | "leechStrike" | "finesse" | "bloodShield" | "parry" | "charge" | "masterpiece";
