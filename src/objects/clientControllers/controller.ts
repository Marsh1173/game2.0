import { Game } from "../../client/game";
import { AbilityImageName, assetManager, imageInformation, ImageName } from "../../client/gameRender/assetmanager";
import { safeGetElementById } from "../../client/util";
import { defaultConfig } from "../../config";
import { defaultActorConfig } from "../newActors/actorConfig";
import { ClassType } from "../newActors/serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../newActors/clientActors/clientPlayer/clientPlayer";
import { UserInterface } from "./userInterface";
import { Vector } from "../../vector";
import { PlayerSword } from "../newActors/clientActors/clientPlayer/playerClasses/playerSword";

export class Controller {
    public readonly keyState: Record<string, boolean> = {};
    protected pressAbilitiesNextFrame: (Vector | undefined)[] = [undefined, undefined, undefined, undefined];
    protected releaseAbilitiesNextFrame: (boolean | undefined)[] = [undefined, undefined, undefined, undefined];

    protected readonly config = defaultConfig;

    protected jumpCount: number = 0;
    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;
    protected wasCrouching: boolean = false;

    public readonly userInterface: UserInterface;

    constructor(protected player: PlayerSword, protected game: Game) {
        this.userInterface = new UserInterface(player);
    }

    public registerMouseDown(e: MouseEvent, globalMousePos: Vector) {
        if (e.button === 0) {
            this.pressAbilitiesNextFrame[0] = globalMousePos;
        } else if (e.button === 2) {
            this.pressAbilitiesNextFrame[1] = globalMousePos;
        }
    }
    public registerMouseUp(e: MouseEvent, globalMousePos: Vector) {
        if (e.button === 0) {
            this.releaseAbilitiesNextFrame[0] = true;
        } else if (e.button === 2) {
            this.releaseAbilitiesNextFrame[1] = true;
        }
    }
    public registerKeyDown(e: KeyboardEvent, globalMousePos: Vector) {
        if (e.code === this.config.playerKeys.firstAbility) {
            this.pressAbilitiesNextFrame[2] = globalMousePos;
        } else if (e.code === this.config.playerKeys.secondAbility) {
            this.pressAbilitiesNextFrame[3] = globalMousePos;
        }
        this.keyState[e.code] = true;
    }
    public registerKeyUp(e: KeyboardEvent, globalMousePos: Vector) {
        if (e.code === this.config.playerKeys.firstAbility) {
            this.releaseAbilitiesNextFrame[2] = true;
        } else if (e.code === this.config.playerKeys.secondAbility) {
            this.releaseAbilitiesNextFrame[3] = true;
        }
        this.keyState[e.code] = false;
    }

    protected updateGamePlayerMoveActions() {
        let tempWasMovingLeft: boolean = false;
        this.player.moveActionsNextFrame.moveLeft = false;
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
        this.player.moveActionsNextFrame.moveRight = false;
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
        this.player.moveActionsNextFrame.crouch = false;
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

    protected updateGamePlayerAbilities() {
        for (let i: number = 0; i < 4; i++) {
            if (this.pressAbilitiesNextFrame[i] !== undefined) {
                this.player.pressAbility(this.pressAbilitiesNextFrame[i] as Vector, i as 0 | 1 | 2 | 3);
                this.pressAbilitiesNextFrame[i] = undefined;
            }
        }
        for (let i: number = 0; i < 4; i++) {
            if (this.releaseAbilitiesNextFrame[i] !== undefined) {
                this.player.releaseAbility(i as 0 | 1 | 2 | 3);
                this.releaseAbilitiesNextFrame[i] = undefined;
            }
        }
    }

    public update(elapsedTime: number) {
        this.updateGamePlayerMoveActions();
        this.updateGamePlayerAbilities();

        this.userInterface.updateAndRender();
    }
}
