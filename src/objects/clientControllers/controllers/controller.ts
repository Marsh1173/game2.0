import { Game } from "../../../client/game";
import { PlayerAbility } from "./abilities/playerAbility";
import { SerializedPlayer } from "../../newActors/serverActors/serverPlayer/serverPlayer";
import { EmptyAbility } from "./abilities/emptyAbility";
import { defaultActorConfig } from "../../newActors/actorConfig";
import { SwordSlashAbility } from "./abilities/swordAbilities/swordSlashAbility";
import { ClientSwordWhirlwindHit, SwordWhirlWindAbility } from "./abilities/swordAbilities/swordWhirlwindAbility";
import { Vector } from "../../../vector";
import { PlayerHoldAbility } from "./abilities/playerHoldAbility";
import { ActorType } from "../../newActors/actor";
import { ClientSword } from "../../newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { ClientPlayer } from "../../newActors/clientActors/clientPlayer/clientPlayer";

export abstract class Controller {
    protected level = 0; // set in setLevel()
    protected currentXp = 0;
    protected xpToNextLevel = 20; // set in setLevel()
    public globalCooldown: number = 0;

    protected currentCastingAbility: number | undefined = undefined;
    protected stateStage: number = 0;

    readonly abilityData: PlayerAbility[];

    constructor(protected readonly game: Game, protected readonly player: ClientPlayer) {
        this.abilityData = [];
        for (let i: number = 0; i < 4; i++) {
            this.abilityData.push(new EmptyAbility(game, this.player, this, i));
        }

        this.setLevel(this.player.getLevel());
    }

    public setXp(xp: number) {
        this.currentXp = xp + 0;
        //this.UserInterface.updateXP(xp):
    }
    public setLevel(level: number) {
        this.level = level + 0;
        this.xpToNextLevel = defaultActorConfig.XPPerLevel * Math.pow(defaultActorConfig.LevelXPMultiplier, level - 1) + 0;
        this.setXp(0);
        this.setAbilities();
        //this.UserInterface.updateLevel(level):
    }

    protected abstract setAbilities(): void;

    public setCurrentCastingAbility(abilityIndex: number) {
        if (this.currentCastingAbility !== undefined) this.abilityData[this.currentCastingAbility].stopFunc();
        this.currentCastingAbility = abilityIndex;
    }
    public resetCurrentCastingAbility() {
        this.currentCastingAbility = undefined;
    }

    public pressAbility(abilityIndex: 0 | 1 | 2 | 3): boolean {
        if (this.abilityData[abilityIndex].attemptFunc()) {
            this.updateFacing();
            this.abilityData[abilityIndex].pressFunc(this.game.getGlobalMousePos());
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

    protected updateFacing() {
        let mousePos: Vector = this.game.getGlobalMousePos();
        if (mousePos.x > this.player.position.x) {
            if (!this.player.facingRight) {
                this.player.facingRight = true;
                this.player.updateFacingFromServer(true);
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerFacingUpdate",
                    playerid: this.player.getActorId(),
                    facingRight: this.player.facingRight,
                });
                //broadcast
            }
        } else {
            if (this.player.facingRight) {
                this.player.facingRight = false;
                this.player.updateFacingFromServer(false);
                this.game.serverTalker.sendMessage({
                    type: "clientPlayerFacingUpdate",
                    playerid: this.player.getActorId(),
                    facingRight: this.player.facingRight,
                });
                //broadcast
            }
        }
    }

    public update(elapsedTime: number) {
        this.updateGlobalCooldown(elapsedTime);
        if (this.currentCastingAbility !== undefined) {
            this.abilityData[this.currentCastingAbility].castUpdateFunc(elapsedTime);
        } else {
            this.updateFacing();
        }
        this.updateAbilities(elapsedTime);
    }
}
