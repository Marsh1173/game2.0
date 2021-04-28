import { Size } from "../../../../size";
import { Vector } from "../../../../vector";
import { ClientFloor } from "../../../terrain/floor/clientFloor";
import { defaultActorConfig } from "../../actorConfig";
import { PlayerObject } from "../../actorObjects/playerObject";
import { PlayerActionType, SerializedPlayer } from "../../serverActors/serverPlayer/serverPlayer";
import { ClientActor } from "../clientActor";
import { PlayerModel } from "../models/playerModel";
import { ClientSword } from "./clientClasses/clientSword";

export abstract class ClientPlayer extends ClientActor {
    actorObject: PlayerObject;
    model: PlayerModel;

    public actionsNextFrame: Record<PlayerActionType, boolean> = {
        jump: false,
        moveRight: false,
        moveLeft: false,
        crouch: false,
    };

    constructor(
        id: number,
        position: Vector,
        momentum: Vector,
        health: number,
        ctx: CanvasRenderingContext2D,
        floor: ClientFloor,
        protected color: string,
        protected name: string,
    ) {
        super("clientPlayer", id, position, momentum, health, 100, floor);

        let playerSizePointer: Size = { width: defaultActorConfig.playerSize.width + 0, height: defaultActorConfig.playerSize.height + 0 };

        this.model = new PlayerModel(this, ctx, position, momentum, playerSizePointer, this.color);
        this.actorObject = new PlayerObject(this, this.position, this.momentum, this.floor, playerSizePointer);
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
