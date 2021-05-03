import { Game } from "../../../../client/game";
import { AbilityImageName, assetManager, imageInformation, ImageName } from "../../../../client/gameRender/assetmanager";
import { safeGetElementById } from "../../../../client/util";
import { defaultConfig } from "../../../../config";
import { defaultActorConfig } from "../../actorConfig";
import { ClassType } from "../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer/clientPlayer";

export class Controller {
    public readonly keyState: Record<string, boolean> = {};

    protected XPtoNextLevel: number;
    protected currentXP: number = 0;
    protected currentLevel: number;

    protected config = defaultConfig;

    protected jumpCount: number = 0;

    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;
    protected wasCrouching: boolean = false;

    protected readonly XPbarElement: HTMLElement = safeGetElementById("currentXp");
    protected readonly levelCountElement: HTMLElement = safeGetElementById("currentLevel");

    protected readonly abilityImageElements: HTMLImageElement[] = [
        safeGetElementById("ability1Img") as HTMLImageElement,
        safeGetElementById("ability2Img") as HTMLImageElement,
        safeGetElementById("ability3Img") as HTMLImageElement,
        safeGetElementById("ability4Img") as HTMLImageElement,
        safeGetElementById("ability5Img") as HTMLImageElement,
    ];
    protected readonly abilityIconCanvases: CanvasRenderingContext2D[] = [
        (safeGetElementById("ability1Canvas") as HTMLCanvasElement).getContext("2d")!,
        (safeGetElementById("ability2Canvas") as HTMLCanvasElement).getContext("2d")!,
        (safeGetElementById("ability3Canvas") as HTMLCanvasElement).getContext("2d")!,
        (safeGetElementById("ability4Canvas") as HTMLCanvasElement).getContext("2d")!,
        (safeGetElementById("ability5Canvas") as HTMLCanvasElement).getContext("2d")!,
    ];
    protected readonly abilityIconBorders: HTMLElement[] = [
        safeGetElementById("ability1Div"),
        safeGetElementById("ability2Div"),
        safeGetElementById("ability3Div"),
        safeGetElementById("ability4Div"),
        safeGetElementById("ability5Div"),
    ];

    constructor(protected player: ClientPlayer, protected game: Game) {
        this.currentLevel = this.player.getLevel();
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        this.levelCountElement.innerText = String(this.currentLevel);
        this.updateXPbar(0);
        //this.updateAbilityImages();
    }

    public updateXPbar(xpAmount: number) {
        this.currentXP = xpAmount;
        this.XPbarElement.style.width = String(Math.min(Math.floor((this.currentXP * 100) / this.XPtoNextLevel), 100)) + "%";
    }

    public levelUp(level: number) {
        this.currentLevel = level;
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        this.levelCountElement.innerText = String(this.currentLevel);

        this.updateXPbar(0);
    }

    protected updateAbilityImages() {
        var classType: ClassType = this.player.getClassType();
        var images: AbilityImageName[] = ["swordBasicAttackIcon", "nullLevel3", "nullLevel6", "nullLevel6", "nullLevel10"];
        switch (classType) {
            case "sword":
                images[0] = "swordBasicAttackIcon";
                if (this.currentLevel >= 3) {
                    images[1] = "nullLevel3";
                    if (this.currentLevel >= 6) {
                        images[2] = "nullLevel6";
                        images[3] = "nullLevel6";
                        if (this.currentLevel >= 10) {
                            images[4] = "nullLevel10";
                        }
                    }
                }
                break;
            case "daggers":
                images[0] = "swordBasicAttackIcon";
                if (this.currentLevel >= 3) {
                    images[1] = "nullLevel3";
                    if (this.currentLevel >= 6) {
                        images[2] = "nullLevel6";
                        images[3] = "nullLevel6";
                        if (this.currentLevel >= 10) {
                            images[4] = "nullLevel10";
                        }
                    }
                }
                break;
            case "hammer":
                images[0] = "swordBasicAttackIcon";
                if (this.currentLevel >= 3) {
                    images[1] = "nullLevel3";
                    if (this.currentLevel >= 6) {
                        images[2] = "nullLevel6";
                        images[3] = "nullLevel6";
                        if (this.currentLevel >= 10) {
                            images[4] = "nullLevel10";
                        }
                    }
                }
                break;
            default:
                throw new Error("unknown class type " + classType);
        }

        for (let i: number = 0; i < 5; i++) {
            this.abilityImageElements[i].src = imageInformation[images[i]];
        }
    }

    public registerMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            let dmg: number = Math.random() * 20;
            this.player.model.health -= dmg;
            this.player.model.registerDamage(dmg);
        } else if (e.button === 2) {
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
}
