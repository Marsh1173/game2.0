import { Game } from "../../../../client/game";
import { Size } from "../../../../size";
import { Vector } from "../../../../vector";
import { ClientDoodad } from "../../../terrain/doodads/clientDoodad";
import { ClientFloor } from "../../../terrain/floor/clientFloor";
import { ActorType } from "../../actor";
import { defaultActorConfig } from "../../actorConfig";
import { PlayerObject } from "../../actorObjects/playerObject";
import { ClassType, PlayerActionType, SerializedPlayer } from "../../serverActors/serverPlayer/serverPlayer";
import { ClientActor } from "../clientActor";
import { PlayerModel } from "../models/playerModel";
import { ClientSword } from "./clientClasses/clientSword";

export abstract class ClientPlayer extends ClientActor {
    actorObject: PlayerObject;
    model: PlayerModel;

    public abstract classType: ClassType;
    protected readonly color: string;
    protected readonly name: string;
    protected level: number;
    protected spec: number;
    public actionsNextFrame: Record<PlayerActionType, boolean> = {
        jump: false,
        moveRight: false,
        moveLeft: false,
        crouch: false,
    };

    constructor(game: Game, playerInfo: SerializedPlayer, actorType: ActorType) {
        super(game, actorType, playerInfo.id, playerInfo.position, playerInfo.momentum, playerInfo.healthInfo);

        this.color = playerInfo.color;
        this.name = playerInfo.name;
        this.level = playerInfo.classLevel;
        this.spec = playerInfo.classSpec;

        let playerSizePointer: Size = { width: defaultActorConfig.playerSize.width + 0, height: defaultActorConfig.playerSize.height + 0 };

        this.model = new PlayerModel(
            this,
            game.getActorCtx(),
            playerInfo.position,
            playerInfo.momentum,
            playerSizePointer,
            this.color,
            this.healthInfo,
            game.getActorSide(this.id),
        );
        this.actorObject = new PlayerObject(game.getGlobalObjects(), this, this.position, this.momentum, playerSizePointer);
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

    public attemptJumpAction(): boolean {
        if (!this.actorObject.crouching) {
            this.actionsNextFrame.jump = true;
            return true;
        }
        return false;
    }
    public attemptCrouchAction(): boolean {
        if (true) {
            this.actionsNextFrame.crouch = true;
            return true;
        }
        return false;
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

    public attemptMoveRightAction(): boolean {
        if (true) {
            this.actionsNextFrame.moveRight = true;
            return true;
        }
        return false;
    }
    protected moveRight(elapsedTime: number) {
        this.actorObject.accelerateRight(elapsedTime);
    }

    public attemptMoveLeftAction(): boolean {
        if (true) {
            this.actionsNextFrame.moveLeft = true;
            return true;
        }
        return false;
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
        if (this.actionsNextFrame.crouch !== this.actorObject.crouching) {
            if (this.actionsNextFrame.crouch) {
                this.crouch();
            } else {
                this.unCrouch();
            }
            this.actorObject.crouching = this.actionsNextFrame.crouch;
        }
    }
}

export interface ClientPlayerAction {
    type: "clientPlayerAction";
    playerId: number;
    actionType: PlayerActionType;
    starting: boolean;
    position: Vector;
    momentum: Vector;
}

export interface ClientPlayerClick {
    type: "clientPlayerClick";
    playerId: number;
    leftClick: boolean;
}
