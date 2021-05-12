import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { Vector } from "../../../../../vector";
import { UserInterface } from "../../../../clientControllers/userInterface";
import { ActorType } from "../../../actor";
import { defaultActorConfig } from "../../../actorConfig";
import { SerializedPlayer } from "../../../serverActors/serverPlayer/serverPlayer";
import { ClientSword, SwordPlayerAbility } from "../clientClasses/clientSword";
import { EmptyAbility } from "./abilities/emptyAbility";
import { PlayerAbility } from "./abilities/playerAbility";
import { PlayerHoldAbility } from "./abilities/playerHoldAbility";
import { SwordSlashAbility } from "./abilities/swordAbilities/swordSlashAbility";
import { ClientSwordWhirlwindHit, SwordWhirlWindAbility } from "./abilities/swordAbilities/swordWhirlwindAbility";

export class PlayerSword extends ClientSword {
    public level = 0; // set in setLevel()
    public currentXp = 0;
    public xpToNextLevel = 20; // set in setLevel()
    public globalCooldown: number = 0;

    public currentCastingAbility: number | undefined = undefined;
    public stateStage: number = 0;

    readonly abilityData: PlayerAbility[];

    constructor(game: Game, playerInfo: SerializedPlayer) {
        super(game, playerInfo);

        this.abilityData = [];
        for (let i: number = 0; i < 4; i++) {
            this.abilityData.push(new EmptyAbility(game, this, i));
        }

        this.setLevel(playerInfo.classLevel);
    }

    public setXp(xp: number) {
        this.currentXp = xp + 0;
        //this.UserInterface.updateXP(xp):
    }
    public setLevel(level: number) {
        this.level = level + 0;
        this.xpToNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, level - 1) + 0;
        this.setXp(0);
        this.setAbilities(this.level, this.spec);
        //this.UserInterface.updateLevel(level):
    }
    setAbilities(level: number, spec: number) {
        if (spec === 1) {
            throw new Error("bad spec 1");
        } else if (spec === 2) {
            throw new Error("bad spec 2");
        } else {
            this.abilityData[0] = new SwordSlashAbility(this.game, this, 0);
            this.abilityData[1] = new SwordWhirlWindAbility(this.game, this, 1);
        }
    }

    public setCurrentCastingAbility(abilityIndex: number) {
        if (this.currentCastingAbility !== undefined) this.abilityData[this.currentCastingAbility].stopFunc();
        this.currentCastingAbility = abilityIndex;
    }
    public resetCurrentCastingAbility() {
        this.currentCastingAbility = undefined;
    }

    public pressAbility(globalMousePos: Vector, abilityIndex: 0 | 1 | 2 | 3): boolean {
        if (this.abilityData[abilityIndex].attemptFunc()) {
            this.abilityData[abilityIndex].pressFunc(globalMousePos);
            return true;
        }
        return false;
    }

    public releaseAbility(abilityIndex: 0 | 1 | 2 | 3) {
        if (this.abilityData[abilityIndex].type === "hold") {
            (this.abilityData[abilityIndex] as PlayerHoldAbility).releaseFunc();
        }
    }

    public getAbilityStatus(): PlayerAbility[] {
        return this.abilityData;
    }

    public setGlobalCooldown(time: number) {
        this.globalCooldown = time + 0;
    }
    public resetGlobalCooldown() {
        this.globalCooldown = 0;
    }
    public setNegativeGlobalCooldown() {
        this.globalCooldown = -0.1;
    }
    protected updateGlobalCooldown(elapsedTime: number) {
        if (this.globalCooldown === 0) {
            return;
        } else if (this.globalCooldown > 0) {
            this.globalCooldown -= elapsedTime;
            if (this.globalCooldown < 0) {
                this.globalCooldown = 0;
            }
        }
    }
    protected updateAbilities(elapsedTime: number) {
        for (let i: number = 0; i < 4; i++) {
            this.abilityData[i].updateFunc(elapsedTime);
        }
    }

    public facingRight: boolean = true;
    protected updateFacing() {
        let mousePos: Vector = this.game.getGlobalMousePos();
        if (mousePos.x > this.position.x) {
            if (!this.facingRight) {
                this.facingRight = true;
                this.playerModel.changeFacing(true);
                //broadcast
            }
        } else {
            if (this.facingRight) {
                this.facingRight = false;
                this.playerModel.changeFacing(false);
                //broadcast
            }
        }
    }

    update(elapsedTime: number) {
        this.updateGlobalCooldown(elapsedTime);
        if (this.currentCastingAbility !== undefined) {
            this.abilityData[this.currentCastingAbility].castUpdateFunc(elapsedTime);
        } else {
            this.updateFacing();
        }
        this.updateAbilities(elapsedTime);
        super.update(elapsedTime);
    }
}

export interface ClientSwordMessage {
    type: "clientSwordMessage";
    msg: ClientSwordWhirlwindHit | ClientSwordSlashHit;
}
export interface ClientSwordSlashHit {
    type: "clientSwordSlashHit";
    actorType: ActorType;
    actorId: number;
    originId: number;
    angle: number;
}
