import { Game } from "../../../../../server/game";
import { findVectorFromAngle, Vector } from "../../../../../vector";
import { ServerDoodad } from "../../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../../terrain/floor/serverFloor";
import { ActorType } from "../../../actor";
import { SwordPlayerAbility } from "../../../clientActors/clientPlayer/clientClasses/clientSword";
import { ServerActor } from "../../serverActor";
import { ClassType, ServerPlayer } from "../serverPlayer";

export class ServerSword extends ServerPlayer {
    classType: ClassType = "sword";

    constructor(game: Game, id: number, color: string, name: string, level: number, spec: number) {
        super(game, id, color, name, level, spec, "swordPlayer");
    }

    updateInput(elapsedTime: number) {}

    update(elapsedTime: number) {
        this.updateActions(elapsedTime);
        this.actorObject.update(elapsedTime, this.actionsNextFrame.moveLeft || this.actionsNextFrame.moveRight);
    }

    public assignWhirlwindDamage(
        actors: {
            actorType: ActorType;
            actorId: number;
            angle: number;
        }[],
    ) {
        actors.forEach((actor) => {
            let serverActor: ServerActor | undefined = this.game.findActor(actor.actorId, actor.actorType);
            if (serverActor) {
                let result: { ifKilled: boolean; damageDealt: number } = serverActor.registerDamage(
                    this,
                    SwordWhirlWindAbilityData.damage,
                    findVectorFromAngle(actor.angle, SwordWhirlWindAbilityData.knockbackForce),
                    undefined,
                );
                this.registerHeal(result.damageDealt / 3);
            }
        });
    }

    public assignSlashDamage(
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
                    SwordSlashAbilityData.damage,
                    findVectorFromAngle(actor.angle, SwordSlashAbilityData.knockbackForce),
                    undefined,
                );
            }
        });
    }

    public performServerAbility(ability: SwordPlayerAbility, starting: boolean, globalMousePos: Vector) {
        if (starting) this.startAbility[ability](globalMousePos);
        else this.endAbility[ability]();
    }

    protected startAbility: Record<SwordPlayerAbility, (globalMousePos: Vector) => void> = {
        slash: (globalMousePos) => {
            Game.broadcastMessage({
                type: "serverSwordMessage",
                originId: this.id,
                msg: {
                    type: "serverSwordAbility",
                    ability: "slash",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        whirlwind: (globalMousePos) => {
            Game.broadcastMessage({
                type: "serverSwordMessage",
                originId: this.id,
                msg: {
                    type: "serverSwordAbility",
                    ability: "whirlwind",
                    mousePos: globalMousePos,
                    starting: true,
                },
            });
        },
        unavailable: () => {},
    };

    protected endAbility: Record<SwordPlayerAbility, () => void> = {
        slash: () => {},
        whirlwind: () => {
            Game.broadcastMessage({
                type: "serverSwordMessage",
                originId: this.id,
                msg: {
                    type: "serverSwordAbility",
                    ability: "whirlwind",
                    mousePos: { x: 0, y: 0 },
                    starting: false,
                },
            });
        },
        unavailable: () => {},
    };
}

export interface ServerSwordMessage {
    type: "serverSwordMessage";
    originId: number;
    msg: ServerSwordAbility;
}

export interface ServerSwordAbility {
    type: "serverSwordAbility";
    ability: SwordPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}

const SwordWhirlWindAbilityData = {
    damage: 15,
    knockbackForce: 500,
};

const SwordSlashAbilityData = {
    damage: 15,
    knockbackForce: 700,
};
