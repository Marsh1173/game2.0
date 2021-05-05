import { Game } from "../../../../client/game";
import { AbilityImageName, assetManager, imageInformation, ImageName } from "../../../../client/gameRender/assetmanager";
import { safeGetElementById } from "../../../../client/util";
import { defaultConfig } from "../../../../config";
import { defaultActorConfig } from "../../actorConfig";
import { ClassType } from "../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer/clientPlayer";
import { UserInterface } from "./userInterface";

export class Controller {
    public readonly keyState: Record<string, boolean> = {};

    protected config = defaultConfig;

    protected jumpCount: number = 0;

    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;
    protected wasCrouching: boolean = false;

    protected userInterface: UserInterface;

    constructor(protected player: ClientPlayer, protected game: Game) {
        this.userInterface = new UserInterface(player);
        this.updateAbilityImages();
    }

    public updateXPbar(xpAmount: number) {
        this.userInterface.updateXPbar(xpAmount);
    }

    public levelUp(level: number) {
        this.userInterface.levelUp(level);
    }

    protected updateAbilityImages() {}

    public registerMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerClick",
                playerId: this.player.getActorId(),
                leftClick: true,
            });
            //broadcast send message damage
        } else if (e.button === 2) {
            this.game.serverTalker.sendMessage({
                type: "clientPlayerClick",
                playerId: this.player.getActorId(),
                leftClick: false,
            });
            //broadcast send message heal
        }
    }
    public registerMouseUp(e: MouseEvent) {
        if (e.button === 0) {
        } else if (e.button === 2) {
        }
    }
    public registerKeyDown(e: KeyboardEvent) {
        this.keyState[e.code] = true;
    }
    public registerKeyUp(e: KeyboardEvent) {
        this.keyState[e.code] = false;
    }

    //public abstract updateGamePlayerAbilities(): void;
    //public abstract ability1Press(): void;
    //public abstract ability1Release(): void;
    //public abstract ability2Press(): void;
    //public abstract ability2Release(): void;
    //public abstract ability3Press(): void;
    //public abstract ability3Release(): void;
    //public abstract ability4Press(): void;
    //public abstract ability4Release(): void;

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

    public update(elapsedTime: number) {
        this.userInterface.updateAndRender();
    }
}
