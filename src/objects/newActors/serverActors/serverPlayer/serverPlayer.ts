import { Game } from "../../../../server/game";
import { Vector } from "../../../../vector";
import { ServerDoodad } from "../../../terrain/doodads/serverDoodad";
import { ServerFloor } from "../../../terrain/floor/serverFloor";
import { ActorType } from "../../actor";
import { defaultActorConfig } from "../../actorConfig";
import { ActorObject } from "../../actorObjects/actorObject";
import { PlayerObject } from "../../actorObjects/playerObject";
import { getStartingHealth, ServerActor } from "../serverActor";
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

    constructor(
        game: Game,
        id: number,
        protected color: string,
        protected name: string,
        protected level: number,
        protected spec: number,
        actorType: ActorType,
    ) {
        super(
            game,
            actorType,
            id,
            { x: defaultActorConfig.playerStart.x, y: defaultActorConfig.playerStart.y },
            { health: getStartingHealth(actorType), maxHealth: getStartingHealth(actorType) },
        );
        this.actorObject = new PlayerObject(game.getGlobalObjects(), this, this.position, this.momentum, {
            width: defaultActorConfig.playerSize.width,
            height: defaultActorConfig.playerSize.height,
        });
    }

    public getLevel(): number {
        return this.level;
    }

    public getSpec(): number {
        return this.spec;
    }

    public changeSpec(spec: number) {
        this.spec = spec;
    }

    public getClassType(): ClassType {
        return this.classType;
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
    getStartingHealth(): number {
        return defaultActorConfig.playerMaxHealth;
    }

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

    protected broadcastFacing(facingRight: boolean) {
        Game.broadcastMessage({
            type: "playerChangeFacing",
            facingRight,
            id: this.id,
        });
    }

    serialize(): SerializedPlayer {
        return {
            id: this.id,
            position: this.position,
            momentum: this.momentum,
            healthInfo: { health: this.healthInfo.health, maxHealth: this.healthInfo.maxHealth },
            name: this.name,
            color: this.color,
            class: this.classType,
            classLevel: this.level,
            classSpec: this.spec,
        };
    }
}

export interface SerializedPlayer {
    id: number;
    position: Vector;
    momentum: Vector;
    healthInfo: { health: number; maxHealth: number };
    name: string;
    color: string;
    class: ClassType;
    classLevel: number;
    classSpec: number;
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

export interface PlayerChangeSpec {
    type: "playerChangeSpec";
    playerId: number;
    spec: number;
}

export interface PlayerLevelSet {
    type: "playerLevelSet";
    playerId: number;
    playerLevel: number;
    levelUp: boolean;
}

export interface PlayerSetXP {
    type: "playerSetXP";
    amount: number;
}

export interface PlayerAllowChooseSpec {
    type: "playerAllowChooseSpec";
}

export interface PlayerChangeFacing {
    type: "playerChangeFacing";
    facingRight: boolean;
    id: number;
}
