import { findAngle } from "../../../../../findAngle";
import { Game } from "../../../../../server/game";
import { findDifference, Vector } from "../../../../../vector";
import { ClientDaggersMessage } from "../../../../clientControllers/controllers/daggersController";
import { ServerDoodad } from "../../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../../terrain/floor/serverFloor";
import { ActorType } from "../../../actor";
import { DaggersPlayerAbility } from "../../../clientActors/clientPlayer/clientClasses/clientDaggers";
import { ServerActor } from "../../serverActor";
import { ClassType, ServerPlayer } from "../serverPlayer";

export class ServerDaggers extends ServerPlayer {
    classType: ClassType = "daggers";

    constructor(game: Game, id: number, color: string, name: string, level: number, spec: number) {
        super(game, id, color, name, level, spec, "daggersPlayer");
    }

    public serviceClientDaggersMessage(data: ClientDaggersMessage) {
        this.updatePositionAndMomentum(data.momentum, data.position);
        switch (data.msg.type) {
            case "clientDaggersStabHit":
                this.assignStabDamage(data.msg.actors);
                break;
            case "clientDaggersAbility":
                this.performServerAbility(data.msg.abilityType, data.msg.starting, data.msg.mousePos);
                break;
            default:
                throw new Error(`Invalid clientSwordMessage type`);
        }
    }

    protected assignStabDamage(
        actors: {
            actorType: ActorType;
            actorId: number;
            angle: number;
        }[],
    ) {
        actors.forEach((actor) => {
            let serverActor: ServerActor | undefined = this.game.findActor(actor.actorId, actor.actorType);
            if (serverActor) {
                if (serverActor instanceof ServerPlayer) {
                    if (findDifference(serverActor.position, this.position).x < 0 === serverActor.getFacingRight()) {
                        serverActor.registerDamage(this, DaggersStabAbilityData.backDamage, undefined, undefined);
                    } else {
                        serverActor.registerDamage(this, DaggersStabAbilityData.damage, undefined, undefined);
                    }
                }
            }
        });
    }

    protected performServerAbility(ability: DaggersPlayerAbility, starting: boolean, globalMousePos: Vector) {
        if (starting) this.startAbility[ability](globalMousePos);
        else this.endAbility[ability]();
    }

    protected startAbility: Record<DaggersPlayerAbility, (globalMousePos: Vector) => void> = {
        stab: (globalMousePos) => {
            Game.broadcastMessage({
                type: "serverDaggersMessage",
                originId: this.id,
                position: this.position,
                momentum: this.momentum,
                msg: {
                    type: "serverDaggersAbility",
                    ability: "stab",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        lunge: (globalMousePos) => {
            this.startTranslation(findAngle(this.position, globalMousePos), "lungeTranslation");
            Game.broadcastMessage({
                type: "serverDaggersMessage",
                originId: this.id,
                position: this.position,
                momentum: this.momentum,
                msg: {
                    type: "serverDaggersAbility",
                    ability: "lunge",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        unavailable: () => {},
    };

    protected endAbility: Record<DaggersPlayerAbility, () => void> = {
        stab: () => {},
        lunge: () => {},
        unavailable: () => {},
    };
}

export interface ServerDaggersMessage {
    type: "serverDaggersMessage";
    originId: number;
    position: Vector;
    momentum: Vector;
    msg: ServerDaggersAbility;
}

export interface ServerDaggersAbility {
    type: "serverDaggersAbility";
    ability: DaggersPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}

const DaggersStabAbilityData = {
    damage: 10,
    backDamage: 20,
};
