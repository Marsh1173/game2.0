import { Game } from "../../../../../server/game";
import { findVectorFromAngle, Vector } from "../../../../../vector";
import { ClientHammerMessage } from "../../../../clientControllers/controllers/hammerController";
import { ServerDoodad } from "../../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../../terrain/floor/serverFloor";
import { ActorType } from "../../../actor";
import { defaultActorConfig } from "../../../actorConfig";
import { HammerPlayerAbility } from "../../../clientActors/clientPlayer/clientClasses/clientHammer";
import { ServerActor } from "../../serverActor";
import { ClassType, ServerPlayer } from "../serverPlayer";

export class ServerHammer extends ServerPlayer {
    classType: ClassType = "hammer";

    constructor(game: Game, id: number, color: string, name: string, level: number, spec: number) {
        super(game, id, color, name, level, spec, "hammerPlayer");
    }

    public serviceHammerMessage(data: ClientHammerMessage) {
        this.updatePositionAndMomentum(data.momentum, data.position);
        switch (data.msg.type) {
            case "clientHammerAbility":
                this.performServerAbility(data.msg.abilityType, data.msg.starting, data.msg.mousePos);
                break;
            case "clientHammerSwingHit":
                this.assignSwingDamage(data.msg.actors);
                break;
            default:
                throw new Error(`Invalid clientHammerMessage type`);
        }
    }

    getStartingHealth(): number {
        if (this.level >= 6) {
            return defaultActorConfig.playerMaxHealth + 30;
        } else {
            return defaultActorConfig.playerMaxHealth;
        }
    }

    protected performServerAbility(ability: HammerPlayerAbility, starting: boolean, globalMousePos: Vector) {
        if (starting) this.startAbility[ability](globalMousePos);
        else this.endAbility[ability]();
    }

    protected startAbility: Record<HammerPlayerAbility, (globalMousePos: Vector) => void> = {
        swing: (globalMousePos) => {
            Game.broadcastMessage({
                type: "serverHammerMessage",
                originId: this.id,
                position: this.position,
                momentum: this.momentum,
                msg: {
                    type: "serverHammerAbility",
                    ability: "swing",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        pound: (globalMousePos) => {
            Game.broadcastMessage({
                type: "serverHammerMessage",
                originId: this.id,
                position: this.position,
                momentum: this.momentum,
                msg: {
                    type: "serverHammerAbility",
                    ability: "pound",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        unavailable: () => {},
    };

    protected endAbility: Record<HammerPlayerAbility, () => void> = {
        swing: () => {},
        pound: () => {
            Game.broadcastMessage({
                type: "serverHammerMessage",
                originId: this.id,
                position: this.position,
                momentum: this.momentum,
                msg: {
                    type: "serverHammerAbility",
                    ability: "pound",
                    mousePos: { x: 0, y: 0 },
                    starting: false,
                },
            });
        },
        unavailable: () => {},
    };

    protected assignSwingDamage(
        actors: {
            actorType: ActorType;
            actorId: number;
            angle: number;
        }[],
    ) {
        actors.forEach((actor) => {
            let serverActor: ServerActor | undefined = this.game.findActor(actor.actorId, actor.actorType);
            if (serverActor) {
                serverActor.registerDamage(
                    this,
                    HammerSwingAbilityData.damage,
                    findVectorFromAngle(actor.angle, HammerSwingAbilityData.knockbackForce),
                    undefined,
                );
            }
        });
    }
}

export interface ServerHammerMessage {
    type: "serverHammerMessage";
    originId: number;
    position: Vector;
    momentum: Vector;
    msg: ServerHammerAbility;
}

export interface ServerHammerAbility {
    type: "serverHammerAbility";
    ability: HammerPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}

const HammerSwingAbilityData = {
    damage: 15,
    knockbackForce: 1000,
};
