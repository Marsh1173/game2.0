import { Vector } from "../../../../vector";
import { ServerDoodad } from "../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../terrain/floor/serverFloor";
import { defaultActorConfig } from "../../actorConfig";
import { ActorObject } from "../../actorObjects/actorObject";
import { PlayerObject } from "../../actorObjects/playerObject";
import { ServerActor } from "../serverActor";
import { ServerSword } from "./serverClasses/serverSword";

export type ClassType = "sword" | "daggers" | "hammer";
export type PlayerActionType = "jump" | "moveLeft" | "moveRight" | "crouch";

export abstract class ServerPlayer extends ServerActor {
    protected crouching: boolean = false;
    public abstract classType: ClassType;

    actorObject: PlayerObject;

    public actionsNextFrame: Record<PlayerActionType, boolean> = {
        jump: false,
        moveRight: false,
        moveLeft: false,
        crouch: false,
    };

    constructor(id: number, floor: ServerFloor, doodads: ServerDoodad[], protected color: string, protected name: string) {
        super("serverPlayer", id, { x: defaultActorConfig.playerStart.x, y: defaultActorConfig.playerStart.y }, defaultActorConfig.playerMaxHealth + 0, floor);
        this.actorObject = new PlayerObject(
            this,
            this.position,
            this.momentum,
            this.floor,
            {
                width: defaultActorConfig.playerSize.width,
                height: defaultActorConfig.playerSize.height,
            },
            doodads,
        );
    }

    public crouch() {
        this.actorObject.crouch();
    }
    public unCrouch() {
        this.actorObject.unCrouch();
    }
    protected jump() {
        this.actionsNextFrame.jump = false;
        this.actorObject.jump();
    }
    protected moveRight(elapsedTime: number) {
        this.actorObject.accelerateRight(elapsedTime);
    }
    protected moveLeft(elapsedTime: number) {
        this.actorObject.accelerateLeft(elapsedTime);
    }

    protected abstract updateInput(elapsedTime: number): void;

    protected updateActions(elapsedTime: number) {
        if (this.actionsNextFrame.jump) {
            this.jump();
        }
        if (this.actionsNextFrame.moveRight) {
            this.moveRight(elapsedTime);
        }
        if (this.actionsNextFrame.moveLeft) {
            this.moveLeft(elapsedTime);
        }
        if (this.actionsNextFrame.crouch !== this.crouching) {
            if (this.actionsNextFrame.crouch) {
                this.crouch();
            } else {
                this.unCrouch();
            }
            this.crouching = this.actionsNextFrame.crouch;
        }
    }

    serialize(): SerializedPlayer {
        return {
            id: this.id,
            class: this.classType,
            position: this.position,
            momentum: this.momentum,
            health: this.health,
            name: this.name,
            color: this.color,
        };
    }
}

export interface SerializedPlayer {
    id: number;
    class: ClassType;
    position: Vector;
    momentum: Vector;
    health: number;
    name: string;
    color: string;
}

export interface ServerPlayerAction {
    type: "serverPlayerAction";
    playerId: number;
    actionType: PlayerActionType;
    starting: boolean;
    position: Vector;
    momentum: Vector;
}

export interface PlayerLeave {
    type: "playerLeave";
    id: number;
}

export interface PlayerJoin {
    type: "playerJoin";
    playerInfo: SerializedPlayer;
}
