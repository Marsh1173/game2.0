import { Game } from "../../../../client/game";
import { defaultConfig } from "../../../../config";
import { ClientPlayer } from "../clientPlayer/clientPlayer";

export class Controller {
    protected readonly keyState: Record<string, boolean> = {};
    protected config = defaultConfig;

    protected jumpCount: number = 0;

    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;
    protected wasCrouching: boolean = false;

    constructor(protected player: ClientPlayer, protected game: Game) {}

    public registerMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            this.player.crouch();
        } else if (e.button === 2) {
        }
    }
    public registerMouseUp(e: MouseEvent) {
        if (e.button === 0) {
            this.player.unCrouch();
        } else if (e.button === 2) {
        }
    }
    public registerKeyDown(e: KeyboardEvent) {
        this.keyState[e.code] = true;
    }
    public registerKeyUp(e: KeyboardEvent) {
        this.keyState[e.code] = false;
    }

    public updateGamePlayerActions() {
        let tempWasMovingLeft: boolean = false;
        this.player.actionsNextFrame.moveLeft = false;
        if (this.keyState[this.config.playerKeys.left]) {
            if (this.player.attemptMoveLeftAction()) tempWasMovingLeft = true;
        }
        if (tempWasMovingLeft !== this.wasMovingLeft) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "moveLeft",
                starting: tempWasMovingLeft,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasMovingLeft = tempWasMovingLeft;
        }

        let tempWasMovingRight: boolean = false;
        this.player.actionsNextFrame.moveRight = false;
        if (this.keyState[this.config.playerKeys.right]) {
            if (this.player.attemptMoveRightAction()) tempWasMovingRight = true;
        }
        if (tempWasMovingRight !== this.wasMovingRight) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "moveRight",
                starting: tempWasMovingRight,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasMovingRight = tempWasMovingRight;
        }

        let tempWasCrouching: boolean = false;
        this.player.actionsNextFrame.crouch = false;
        if (this.keyState[this.config.playerKeys.down]) {
            if (this.player.attemptCrouchAction()) tempWasCrouching = true;
        }
        if (tempWasCrouching !== this.wasCrouching) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerAction",
                playerId: this.player.getActorId(),
                actionType: "crouch",
                starting: tempWasCrouching,
                position: this.player.position,
                momentum: this.player.momentum,
            });
            this.wasCrouching = tempWasCrouching;
        }

        if (this.player.actorObject.standing) {
            this.jumpCount = 0;
        }

        if (this.keyState[this.config.playerKeys.up]) {
            if (this.jumpCount < 2 && this.player.attemptJumpAction()) {
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerAction",
                    playerId: this.player.getActorId(),
                    actionType: "jump",
                    starting: true,
                    position: this.player.position,
                    momentum: this.player.momentum,
                });
                this.jumpCount++;
            }
            this.keyState[this.config.playerKeys.up] = false;
        }
    }
}
