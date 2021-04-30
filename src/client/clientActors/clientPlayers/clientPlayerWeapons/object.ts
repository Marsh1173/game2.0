import { findAngle, rotateShape } from "../../../../findAngle";
import { DamageArray } from "../../../../objects/Actors/actor";
import { LavaFly } from "../../../../objects/Actors/Mobs/airMob/lavaFly";
import { WeaponType } from "../../../../objects/Actors/Players/playerActor";
import { Vector } from "../../../../vector";
import { assetManager } from "../../../gameRender/assetmanager";
import { ServerTalker } from "../../../servertalker";
import { ClientPlayerActor } from "../clientPlayerActor";
import { ClientPlayerModel } from "../clientPlayerModel/object";
import {
    updateImgRotationToKey,
    updateWeaponRotationToKey,
    updateWeaponPositionToKey,
    updateAnimation,
    attack1Animation,
    attack2Animation,
    genericIdleUpdate,
} from "./animations";
import { genericRenderWeapon } from "./render";

export interface WeaponAnimation {
    duration: number;
    consecutiveState: WeaponAnimationState;
    imgRotation: TargetImgRotation[];
    weaponPosition: TargetWeaponPosition[];
    weaponRotation: TargetWeaponRotation[];
}
export interface TargetImgRotation {
    target: number;
    time: number;
}
export interface TargetWeaponPosition {
    target: Vector;
    time: number;
}
export interface TargetWeaponRotation {
    target: number;
    time: number;
}

type WeaponAnimationState = "idle" | "attack1" | "attack2";

export class ClientModelWeapon {
    //weapon model stats
    protected imgRotation: number = 0;
    protected weaponPosition: Vector = { x: 0, y: 0 };
    protected weaponRotation: number = 0;

    //animation stats
    protected weaponAnimationState: WeaponAnimationState = "idle";
    protected animationFrame: number = 0;
    protected imgRotationIndex: number = 0;
    protected weaponPositionIndex: number = 0;
    protected weaponRotationIndex: number = 0;

    constructor(
        protected readonly clientPlayerModel: ClientPlayerModel,
        protected weaponType: WeaponType,
        protected img: HTMLImageElement | undefined,
        protected imgCenter: Vector, // position of the "handle"
        protected imgScale: number, // scale compared to its original size
        protected originalImgRotation: number, // rotation around the handle of the weapon
        protected originalWeaponPosition: Vector, // position relative to player
        protected originalWeaponRotation: number, // rotation relative to player //updateFunction
    ) {}

    public setAnimation(state: WeaponAnimationState) {
        this.imgRotationIndex = 0;
        this.weaponPositionIndex = 0;
        this.weaponRotationIndex = 0;
        this.animationFrame = 0;

        if (this.weaponAnimationState === "attack1" && state === "attack1") {
            this.weaponAnimationState = "attack2";
        } else this.weaponAnimationState = state;
    }

    private changeClientPlayerModelWeaponImage(weapon: WeaponType) {
        // sets the stats of the image
        let imgScale: number;
        /*switch (weapon) {
            case "none":
                this.img = undefined;
                break;
            case "sword":
                imgScale = 0.25;
                this.img = assetManager.images["sword"];
                this.imgCenter = {
                    x: 0.5 * assetManager.images["sword"].width * imgScale,
                    y: 0.8 * assetManager.images["sword"].height * imgScale,
                };
                this.clientPlayerModel.clientModelWeapon.imgScale = imgScale;
        }*/
    }

    public changeClientPlayerModelWeapon(weapon: WeaponType) {
        //update model weapon
        //update actions with the weapon

        this.weaponType = weapon;
        this.changeClientPlayerModelWeaponImage(weapon);

        switch (weapon) {
            case "none":
                this.renderFunction = genericRenderWeapon;
                break;
            case "sword":
                this.originalImgRotation = 0.3;
                this.originalWeaponPosition = { x: 30, y: 10 };
                this.originalWeaponRotation = 0;
                this.renderFunction = genericRenderWeapon;
                break;
            default:
                throw new Error("Tried to change a client's weapon with an unknown weapon type");
        }
    }

    protected updateAnimation = updateAnimation;

    protected updateImgRotationToKey = updateImgRotationToKey;
    protected updateWeaponRotationToKey = updateWeaponRotationToKey;
    protected updateWeaponPositionToKey = updateWeaponPositionToKey;

    public renderFunction = genericRenderWeapon;

    private idleUpdate = genericIdleUpdate;
    private attack1Animation = attack1Animation;
    private attack2Animation = attack2Animation;

    public update(elapsedTime: number) {
        switch (this.weaponAnimationState) {
            case "idle":
                this.idleUpdate(elapsedTime);
                break;
            case "attack1":
                this.updateAnimation(this.attack1Animation, elapsedTime);
                break;
            case "attack2":
                this.updateAnimation(this.attack2Animation, elapsedTime);
                break;
            default:
                throw new Error("tried to update unknown weapon animation state");
        }
    }
}

export function genericBasicAttack(
    gamePlayer: ClientPlayerActor,
    players: ClientPlayerActor[],
    attackShape: Vector[],
    damage: number,
    force: number,
    serverTalker: ServerTalker,
) {
    let results: DamageArray = {
        damage: {
            quantity: damage,
            id: gamePlayer.id,
            team: gamePlayer.team,
        },
        lavaFlyArray: [],
        playerActorArray: [],
    };

    let shape: Vector[] = rotateShape(attackShape, gamePlayer.focusAngle, gamePlayer.position, true);

    players.forEach((player) => {
        if (gamePlayer.id !== player.id && player.checkIfAlive() && player.threeDHitBox(shape)) {
            results.playerActorArray.push({
                id: player.id,
                angle: findAngle(gamePlayer.position, player.position),
                force: force,
            });
        }
    });

    /*if (results.lavaFlyArray.length !== 0 || results.playerActorArray.length !== 0)
        serverTalker.sendMessage({
            type: "clientBasicAttackResults",
            damageArray: results,
        });*/
}
