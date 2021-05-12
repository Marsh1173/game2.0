import { assetManager } from "../../client/gameRender/assetmanager";
import { safeGetElementById } from "../../client/util";
import { defaultActorConfig } from "../newActors/actorConfig";
import { ClassType } from "../newActors/serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../newActors/clientActors/clientPlayer/clientPlayer";
import { Vector } from "../../vector";
import { PlayerSword } from "../newActors/clientActors/clientPlayer/playerClasses/playerSword";
import { PlayerAbility } from "../newActors/clientActors/clientPlayer/playerClasses/abilities/playerAbility";

export class UserInterface {
    protected XPtoNextLevel: number;
    protected currentXP: number = 0;
    protected currentLevel: number;
    protected healthInfo: { health: number; maxHealth: number };
    protected displayHealth: number;

    //protected readonly portraitElement: HTMLCanvasElement = safeGetElementById("portraitCanvas") as HTMLCanvasElement;
    //protected readonly portraitCanvas: CanvasRenderingContext2D = this.portraitElement.getContext("2d")!;

    protected healthChanged: boolean = true;
    protected readonly healthElement: HTMLCanvasElement = safeGetElementById("healthCanvas") as HTMLCanvasElement;
    protected readonly healthCanvas: CanvasRenderingContext2D = this.healthElement.getContext("2d")!;

    protected readonly abilityElement: HTMLCanvasElement = safeGetElementById("abilityCanvas") as HTMLCanvasElement;
    protected readonly abilityCanvas: CanvasRenderingContext2D = this.abilityElement.getContext("2d")!;

    protected readonly abilityImages: HTMLImageElement[];
    protected abilityChanged: boolean[] = [true, true, true, true];

    protected readonly playerAbilityStatus: PlayerAbility[];

    constructor(protected player: PlayerSword /*|PlayerDaggers | PlayerHammer*/) {
        this.playerAbilityStatus = this.player.getAbilityStatus();

        //this.portraitElement.width = 50;
        //this.portraitElement.height = 50;

        this.healthElement.width = 250;
        this.healthElement.height = 75;

        this.abilityElement.width = 400;
        this.abilityElement.height = 120;

        this.healthInfo = player.getHealthInfo();
        this.displayHealth = this.healthInfo.health + 0;

        this.currentLevel = this.player.getLevel();
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        //this.levelCountElement.innerText = String(this.currentLevel);
        this.updateXPbar(0);
        this.abilityImages = getAbilityImages(this.player.getClassType(), this.currentLevel, this.player.getSpec());
        this.updatePassiveAbility(this.abilityImages[4]);
        //this.updateAbilityImages(this.player.getClassType(), this.currentLevel, this.player.getSpec());
    }

    public updateXPbar(quantity: number) {
        this.currentXP = quantity;
        this.renderPortrait();
    }

    public levelUp(level: number) {
        this.currentLevel = level;
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);

        this.updateXPbar(0);
    }

    public registerKeyOrMouseChange(index: 0 | 1 | 2 | 3) {
        this.abilityChanged[index] = true;
    }

    /*public updateAbilityImages(classType: ClassType, level: number, spec: number) {
        this.abilityImages = getAbilityImages(classType, level, spec);
        this.abilitiesChanged = true;
        for (let i: number = 0; i < 5; i++) {
            this.abilityChanged[i] = true;
        }
    }*/

    public updateAndRender() {
        if (this.displayHealth + 5 < this.healthInfo.health) {
            this.displayHealth += 5;
            this.healthChanged = true;
        } else if (this.displayHealth - 5 > this.healthInfo.health) {
            this.displayHealth -= 5;
            this.healthChanged = true;
        } else if (this.displayHealth !== this.healthInfo.health) {
            this.displayHealth = this.healthInfo.health + 0;
            this.healthChanged = true;
        }

        if (this.healthChanged) {
            this.renderHealth();
            this.healthChanged = false;
        }

        this.renderAbilities();
    }

    protected renderHealth() {
        //this.healthCanvas.clearRect(0, 0, this.healthElement.width, 20);

        this.healthCanvas.fillStyle = "rgb(230, 230, 230)";

        let segments: number = Math.ceil(this.healthInfo.maxHealth / 20);
        let width: number = this.healthElement.width / segments;

        for (let i: number = 0; i < segments; i++) {
            roundRect(this.healthCanvas, i * width + 1, 10, width - 2, 40, 4, true, false);
        }

        this.healthCanvas.clearRect(
            this.healthElement.width,
            0,
            this.healthElement.width * (this.displayHealth / this.healthInfo.maxHealth - 1),
            this.healthElement.height,
        );

        this.healthCanvas.fillStyle = "rgba(230, 230, 230, 0.2)";

        for (let i: number = 0; i < segments; i++) {
            roundRect(this.healthCanvas, i * width + 1, 10, width - 2, 40, 4, true, false);
        }
    }

    protected renderPortrait() {
        /*this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, this.portraitElement.height);

        //XP render
        this.portraitCanvas.strokeStyle = "yellow";
        roundHex(this.portraitCanvas, 0, 0, this.portraitElement.width, this.portraitElement.height, 10, 5, true);
        this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, 1 + this.portraitElement.height * (1 - this.currentXP) * 0.95);

        this.portraitCanvas.strokeStyle = "rgb(230, 230, 230)";
        roundHex(this.portraitCanvas, 4, 4, this.portraitElement.width - 8, this.portraitElement.height - 8, 5, 4, true);*/
    }

    protected renderLevel() {}
    public updatePassiveAbility(img: HTMLImageElement) {
        this.abilityCanvas.lineWidth = 1;
        this.abilityCanvas.strokeStyle = "rgb(230, 230, 230)";
        this.abilityCanvas.clearRect(290, 45, 55, 55);
        roundRect(this.abilityCanvas, 293, 47, 50, 50, 10, false, true);
        this.abilityCanvas.drawImage(img, 293, 47, 50, 50);
    }

    protected iconCooldownLastFrame: number[] = [-1, -1, -1, -1];
    protected globalCooldownLastFrame: number = -1;
    protected renderAbilities() {
        for (let i: number = 0; i < this.renderAbilityIconFunctions.length; i++) {
            if (this.globalCooldownLastFrame !== this.player.globalCooldown || this.iconCooldownLastFrame[i] !== this.playerAbilityStatus[i].cooldown) {
                this.abilityCanvas.fillStyle = "rgb(200, 200, 200)";
                this.renderAbilityIconFunctions[i]();
                this.abilityChanged[i] = false;
                this.iconCooldownLastFrame[i] = this.playerAbilityStatus[i].cooldown + 0;
            }
        }
        this.globalCooldownLastFrame = this.player.globalCooldown;
    }
    protected renderAbilityIconFunctions: (() => void)[] = [
        () => {
            this.renderAbilityIcon({ x: 7, y: 30 }, 70, 0);
        },
        () => {
            this.renderAbilityIcon({ x: 82, y: 30 }, 70, 1);
        },
        () => {
            this.renderAbilityIcon({ x: 160, y: 40 }, 60, 2);
        },
        () => {
            this.renderAbilityIcon({ x: 225, y: 40 }, 60, 3);
        },
    ];

    protected renderAbilityIcon(pos: Vector, sideLength: number, abilityIndex: number) {
        this.abilityCanvas.clearRect(pos.x - 2, pos.y - 2, sideLength + 4, sideLength + 4);

        if (this.playerAbilityStatus[abilityIndex].cooldown !== 0 || this.player.globalCooldown !== 0) {
            this.abilityCanvas.fillStyle = "rgba(200, 200, 200, 0.4)";
            roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
            let clearRectHeight: number = this.playerAbilityStatus[abilityIndex].cooldown / this.playerAbilityStatus[abilityIndex].totalCooldown;
            if (this.player.globalCooldown > this.playerAbilityStatus[abilityIndex].cooldown) {
                clearRectHeight = this.player.globalCooldown / defaultActorConfig.globalCooldown;
            }
            this.abilityCanvas.clearRect(pos.x - 2, pos.y - 2, sideLength + 4, sideLength * clearRectHeight + 2);
            this.abilityCanvas.fillStyle = "rgba(200, 200, 200, 0.2)";
            roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
        } else {
            roundRect(this.abilityCanvas, pos.x, pos.y, sideLength, sideLength, 5, true, false);
        }

        this.abilityCanvas.globalCompositeOperation = "destination-out";
        this.abilityCanvas.drawImage(this.playerAbilityStatus[abilityIndex].img, pos.x, pos.y, sideLength, sideLength);
        this.abilityCanvas.globalCompositeOperation = "source-over";
    }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);

    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function roundHex(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, strokeWidth: number, flat: boolean) {
    ctx.lineWidth = radius * 2;
    ctx.lineJoin = "round";

    const renderFlat = (): void => {
        const widthDif: number = (width + radius) / 4;
        const heightDif: number = height / 2 - ((height - radius * 2) * Math.pow(3, 0.5)) / 4;
        ctx.beginPath();
        ctx.moveTo(x + widthDif, y + heightDif);
        ctx.lineTo(x + radius, y + height / 2);
        ctx.lineTo(x + widthDif, y + height - heightDif);
        ctx.lineTo(x + width - widthDif, y + height - heightDif);
        ctx.lineTo(x + width - radius, y + height / 2);
        ctx.lineTo(x + width - widthDif, y + heightDif);
        ctx.closePath();
    };
    const renderTall = (): void => {
        const heightDif: number = (height + radius) / 4;
        const widthDif: number = width / 2 - ((width - radius * 2) * Math.pow(3, 0.5)) / 4;
        ctx.beginPath();
        ctx.moveTo(x + widthDif, y + heightDif);
        ctx.lineTo(x + width / 2, y + radius);
        ctx.lineTo(x + width - widthDif, y + heightDif);
        ctx.lineTo(x + width - widthDif, y + height - heightDif);
        ctx.lineTo(x + width / 2, y + height - radius);
        ctx.lineTo(x + widthDif, y + height - heightDif);
        ctx.closePath();
    };

    if (flat) renderFlat();
    else renderTall();
    ctx.stroke();
    x += strokeWidth;
    y += strokeWidth;
    width -= strokeWidth * 2;
    height -= strokeWidth * 2;
    radius -= strokeWidth / 3;
    ctx.globalCompositeOperation = "destination-out";
    if (flat) renderFlat();
    else renderTall();
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
}

function getAbilityImages(classType: ClassType, level: number, spec: number): HTMLImageElement[] {
    let abilityImages: HTMLImageElement[] = [
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["lvl6"],
        assetManager.images["lvl10"],
        assetManager.images["lvl6"],
    ];

    switch (classType) {
        case "daggers":
            if (spec === 0) {
                abilityImages[0] = assetManager.images["stabIcon"];
                abilityImages[1] = assetManager.images["lungeIcon"];
            } else if (spec === 1) {
                // Monk
            } else if (spec === 2) {
                // Assassin
            }
            break;
        case "sword":
            if (spec === 0) {
                abilityImages[0] = assetManager.images["slashIcon"];
                abilityImages[1] = assetManager.images["whirlwindIcon"];
            } else if (spec === 1) {
                // Berserker
            } else if (spec === 2) {
                // Blademaster
            }
            break;
        case "hammer":
            if (spec === 0) {
                abilityImages[0] = assetManager.images["swingIcon"];
                abilityImages[1] = assetManager.images["poundIcon"];
            } else if (spec === 1) {
                // Paladin
            } else if (spec === 2) {
                // Warden
            }
            break;
        default:
            throw new Error("Unknown class type in UserInterface's getAbilityImages");
    }

    return abilityImages;
}

export type SwordClass = {
    type: "sword";
    spec: SwordClass;
};
export type SwordSpec = "berserker" | "bladesman";

export type DaggersClass = {
    type: "daggers";
    spec: DaggersSpec;
};
export type DaggersSpec = "monk" | "assassin";

export type HammerClass = {
    type: "hammer";
    spec: HammerSpec;
};
export type HammerSpec = "paladin" | "warden";

var playerInfo: HammerClass | DaggersClass | SwordClass;
