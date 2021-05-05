import { assetManager } from "../../../../client/gameRender/assetmanager";
import { safeGetElementById } from "../../../../client/util";
import { defaultActorConfig } from "../../actorConfig";
import { ClassType } from "../../serverActors/serverPlayer/serverPlayer";
import { ClientPlayer } from "../clientPlayer/clientPlayer";

export class UserInterface {
    protected XPtoNextLevel: number;
    protected currentXP: number = 0;
    protected currentLevel: number;
    protected healthInfo: { health: number; maxHealth: number };
    protected displayHealth: number;

    protected portraitChanged: boolean = true;
    protected readonly portraitElement: HTMLCanvasElement = safeGetElementById("portraitCanvas") as HTMLCanvasElement;
    protected readonly portraitCanvas: CanvasRenderingContext2D = this.portraitElement.getContext("2d")!;

    protected healthChanged: boolean = true;
    protected readonly healthElement: HTMLCanvasElement = safeGetElementById("healthCanvas") as HTMLCanvasElement;
    protected readonly healthCanvas: CanvasRenderingContext2D = this.healthElement.getContext("2d")!;

    protected abilitiesChanged: boolean = true;
    protected readonly abilityElement: HTMLCanvasElement = safeGetElementById("abilityCanvas") as HTMLCanvasElement;
    protected readonly abilityCanvas: CanvasRenderingContext2D = this.abilityElement.getContext("2d")!;

    protected abilityImages: HTMLImageElement[] = [
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
    ];

    constructor(protected player: ClientPlayer) {
        this.portraitElement.width = 50;
        this.portraitElement.height = 50;

        this.healthElement.width = 250;
        this.healthElement.height = 75;

        this.abilityElement.width = 800;
        this.abilityElement.height = 240;

        this.healthInfo = player.getHealthInfo();
        this.displayHealth = this.healthInfo.health + 0;

        this.currentLevel = this.player.getLevel();
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);
        //this.levelCountElement.innerText = String(this.currentLevel);
        this.updateXPbar(0);
        this.updateAbilityImages(this.player.getClassType(), this.currentLevel, this.player.getSpec());
    }

    public updateXPbar(quantity: number) {
        this.currentXP = quantity;
    }

    public levelUp(level: number) {
        this.currentLevel = level;
        this.XPtoNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, this.currentLevel);

        this.updateXPbar(0);
    }

    public updateAbilityImages(classType: ClassType, level: number, spec: number) {
        this.abilityImages = getAbilityImages(classType, level, spec);
    }

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

        if (this.portraitChanged) {
            this.renderPortrait();
            this.portraitChanged = false;
        }

        this.renderAbilities();
    }

    protected renderHealth() {
        this.healthCanvas.clearRect(0, 0, this.healthElement.width, this.healthElement.height);

        this.healthCanvas.fillStyle = "rgb(230, 230, 230)";

        let segments: number = Math.ceil(this.healthInfo.maxHealth / 20);
        let width: number = this.healthElement.width / segments;

        for (let i: number = 0; i < segments; i++) {
            roundRect(this.healthCanvas, i * width + 1, 30, width - 2, 40, 4, true, false);
        }

        this.healthCanvas.clearRect(
            this.healthElement.width,
            0,
            this.healthElement.width * (this.displayHealth / this.healthInfo.maxHealth - 1),
            this.healthElement.height,
        );

        this.healthCanvas.fillStyle = "rgba(230, 230, 230, 0.2)";

        for (let i: number = 0; i < segments; i++) {
            roundRect(this.healthCanvas, i * width + 1, 30, width - 2, 40, 4, true, false);
        }
    }

    protected renderPortrait() {
        this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, this.portraitElement.height);

        //XP render
        /*this.portraitCanvas.strokeStyle = "yellow";
        roundHex(this.portraitCanvas, 0, 0, this.portraitElement.width, this.portraitElement.height, 10, 5, true);
        this.portraitCanvas.clearRect(0, 0, this.portraitElement.width, this.portraitElement.height * this.test);*/

        this.portraitCanvas.strokeStyle = "rgb(230, 230, 230)";
        roundHex(this.portraitCanvas, 4, 4, this.portraitElement.width - 8, this.portraitElement.height - 8, 5, 4, true);
    }

    protected renderAbilities() {
        this.abilityCanvas.fillStyle = "rgba(200, 200, 200, 0.7)";
        this.abilityCanvas.strokeStyle = "rgb(230, 230, 230)";
        this.abilityCanvas.lineWidth = 2;

        this.renderAbilityFunctions.forEach((renderFunction) => {
            renderFunction();
        });
    }
    protected renderAbilityFunctions: (() => void)[] = [
        () => {
            this.abilityCanvas.clearRect(140, 30, 240, 210);
            this.abilityCanvas.beginPath();
            this.abilityCanvas.moveTo(140, 60);
            this.abilityCanvas.lineTo(260, 30);
            this.abilityCanvas.lineTo(260, 210);
            this.abilityCanvas.lineTo(140, 180);
            this.abilityCanvas.fill();
            this.abilityCanvas.globalCompositeOperation = "destination-out";
            this.abilityCanvas.drawImage(this.abilityImages[0], 140, 60, 120, 120);
            this.abilityCanvas.globalCompositeOperation = "source-over";
        },
        () => {
            this.abilityCanvas.clearRect(275, 30, 370, 210);
            this.abilityCanvas.beginPath();
            this.abilityCanvas.moveTo(395, 60);
            this.abilityCanvas.lineTo(275, 30);
            this.abilityCanvas.lineTo(275, 210);
            this.abilityCanvas.lineTo(395, 180);
            this.abilityCanvas.fill();
            this.abilityCanvas.globalCompositeOperation = "destination-out";
            this.abilityCanvas.drawImage(this.abilityImages[1], 275, 60, 120, 120);
            this.abilityCanvas.globalCompositeOperation = "source-over";
        },
        () => {
            this.abilityCanvas.clearRect(415, 60, 120, 120);
            roundRect(this.abilityCanvas, 415, 60, 120, 120, 5, true, false);
            this.abilityCanvas.globalCompositeOperation = "destination-out";
            this.abilityCanvas.drawImage(this.abilityImages[2], 415, 60, 120, 120);
            this.abilityCanvas.globalCompositeOperation = "source-over";
        },
        () => {
            this.abilityCanvas.clearRect(550, 60, 120, 120);
            roundRect(this.abilityCanvas, 550, 60, 120, 120, 5, true, false);
            this.abilityCanvas.globalCompositeOperation = "destination-out";
            this.abilityCanvas.drawImage(this.abilityImages[3], 550, 60, 120, 120);
            this.abilityCanvas.globalCompositeOperation = "source-over";
        },
        () => {
            this.abilityCanvas.clearRect(9, 69, 102, 102);
            roundRect(this.abilityCanvas, 10, 70, 100, 100, 10, false, true);
            this.abilityCanvas.drawImage(this.abilityImages[4], 10, 70, 100, 100);
        },
    ];
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
    radius -= strokeWidth / 2;
    ctx.globalCompositeOperation = "destination-out";
    if (flat) renderFlat();
    else renderTall();
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
}

function getAbilityImages(classType: ClassType, level: number, spec: number): HTMLImageElement[] {
    let abilityImages: HTMLImageElement[] = [
        assetManager.images["slashIcon"],
        assetManager.images["whirlwindIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
        assetManager.images["emptyIcon"],
    ];

    switch (classType) {
        case "daggers":
            if (spec === 0) {
                // undecided
            } else if (spec === 1) {
                // Monk
            } else if (spec === 2) {
                // Assassin
            }
            break;
        case "sword":
            if (spec === 0) {
                // undecided
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
                // undecided
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
