import { NoSubstitutionTemplateLiteral } from "typescript";
import { Config } from "../../../config";
import { ActorEffectName } from "../../../objects/Actors/effects";
import { PlayerActionType, PlayerActor, WeaponType } from "../../../objects/Actors/Players/playerActor";
import { GroundPlatform } from "../../../objects/groundPlatform";
import { Platform } from "../../../objects/platform";
import { SerializedPlayerActor } from "../../../serialized/playerActor";
import { findDistance, Vector } from "../../../vector";
import { ServerTalker } from "../../servertalker";
import { createClientEffect } from "../clientEffects";
import { broadcastActions } from "./clientPlayerActorActionFunctions";
import { ClientPlayerModel } from "./clientPlayerModel/object";
import { swordBasicAttack } from "./clientPlayerWeapons/typeFunctions";

export class ClientPlayerActor extends PlayerActor {
    /*protected animationFrame: number = 0;
    protected animationState: PlayerAnimationState = "stationary";*/

    protected wasMovingRight: boolean = false;
    protected wasMovingLeft: boolean = false;
    public clientPlayerModel: ClientPlayerModel;

    private angleInfo = {
        targetFocusAngle: 0,
        focusAngleMomentum: 0,
        sendFocusAngleCounter: 0,
    };

    constructor(
        public readonly config: Config,
        info: SerializedPlayerActor,
        public readonly isGamePlayer: boolean,
        protected readonly serverTalker: ServerTalker,
    ) {
        super(config, info.id, info.position, info.team, info.color, info.name, info.health, info.focusAngle, info.weapon);

        this.clientPlayerModel = new ClientPlayerModel(this);
        this.changeClientPlayerWeapon(info.weapon);
    }

    public updatePositionFromServer(position: Vector, momentum: Vector) {
        if (!this.isGamePlayer) {
            this.clientPlayerModel.stutterCompensatePosition.x += -position.x + this.position.x;
            this.clientPlayerModel.stutterCompensatePosition.y += -position.y + this.position.y;
            this.position.x = position.x + 0;
            this.position.y = position.y + 0;
            this.momentum.x = momentum.x + 0;
            this.momentum.y = momentum.y + 0;
        }
    }

    //effects
    protected createEffect = createClientEffect;

    protected leftClick = swordBasicAttack;
    public getHealth(): number {
        return this.health;
    }

    public attemptReceiveDamage(quantity: number, id: number) {
        if (this.checkIfAlive()) {
            this.clientPlayerModel.registerDamage(quantity);
        }
        super.attemptReceiveDamage(quantity, id);
    }

    protected die() {
        this.clientPlayerModel.setAnimationToDead();
        //particles
        super.die();
    }

    public resurrect(position: Vector) {
        this.clientPlayerModel.setAnimationToResurrect();
        //particles
        super.resurrect(position);
    }

    protected attemptGroundCollision(groundPlatform: GroundPlatform, elapsedTime: number) {
        this.clientPlayerModel.registerPlatformRotation(groundPlatform.checkActorGroundCollision(this, elapsedTime));
    }

    public changeFocusPositionAngle(angle: number) {
        if (this.isGamePlayer) {
            super.changeFocusPositionAngle(angle);
        } else {
            this.angleInfo.targetFocusAngle = angle;
        }
    }
    private updateFocusPositionAngle(elapsedTime: number) {
        if (this.isGamePlayer) {
            this.angleInfo.sendFocusAngleCounter += elapsedTime;
            if (this.angleInfo.sendFocusAngleCounter > this.config.updatePlayerFocusSpeed) {
                /*this.serverTalker.sendMessage({
                    type: "clientPlayerUpdateFocus",
                    angle: this.focusAngle,
                    id: this.id,
                });*/
                this.angleInfo.sendFocusAngleCounter = 0;
            }
        } else {
            if (this.focusAngle < this.angleInfo.targetFocusAngle - Math.PI * 1.5) {
                this.focusAngle += Math.PI * 2;
            } else if (this.focusAngle > this.angleInfo.targetFocusAngle + Math.PI * 1.5) {
                this.focusAngle -= Math.PI * 2;
            }
            this.angleInfo.focusAngleMomentum = Math.min(0.2, Math.max(-0.2, (this.angleInfo.targetFocusAngle - this.focusAngle) / 5));
            this.focusAngle += this.angleInfo.focusAngleMomentum;
        }
    }
    public changeClientPlayerWeapon(weapon: WeaponType) {
        this.clientPlayerModel.clientModelWeapon.changeClientPlayerModelWeapon(weapon);
    }

    private attemptBroadcastActions() {
        if (this.isGamePlayer && this.checkIfAlive()) this.broadcastActions();
    }
    private broadcastActions = broadcastActions; // implemented in ClientPlayerActorActionFunctions

    public updateClientPlayerActor(elapsedTime: number, platforms: Platform[], groundPlatform: GroundPlatform, players: PlayerActor[]) {
        this.updateFocusPositionAngle(elapsedTime);

        this.attemptBroadcastActions();

        this.clientPlayerModel.update(elapsedTime);

        super.updatePlayerActor(elapsedTime, platforms, groundPlatform, players);
    }
}
