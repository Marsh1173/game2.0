import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { Size } from "../../../../../size";
import { Vector } from "../../../../../vector";
import { SwordSlashHitShape } from "../../../../clientControllers/controllers/abilities/swordAbilities/swordSlashAbility";
import { renderShape } from "../../clientActor";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Joint } from "../joint";
import { AnimationInfo, ModelAnimation } from "../model";
import { PlayerModel } from "./playerModel";

type SwordPlayerModelJoint = "playerSword";
export type SwordPlayerAnimationName = "stand" | "slash1" | "slash2" | "whirlwind";

export class SwordPlayerModel extends PlayerModel {
    protected animationStateAnimation: SwordModelAnimation = SwordPlayerAnimationData["stand"];
    protected animationState: SwordPlayerAnimationName = "stand";
    protected swordJoint: Joint;

    constructor(game: Game, player: ClientPlayer, ctx: CanvasRenderingContext2D, position: Vector, healthBarType: SideType, playerColor: string, size: Size) {
        super(game, player, ctx, position, healthBarType, playerColor, size);
        this.swordJoint = new Joint(this.ctx, assetManager.images["sword31"], { x: -200, y: -700 }, 0.1, 0, { x: -25, y: 20 }, 0, -0.4);
    }

    public renderWeapon() {
        this.swordJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerSword"]);

        /*this.ctx.scale(-1, 1);
        renderShape(this.ctx, SwordSlashHitShape);
        this.ctx.scale(-1, 1);*/
    }

    public update(elapsedTime: number) {
        this.animationTime += elapsedTime;
        if (this.animationTime >= this.animationStateAnimation.totalTime) {
            if (this.animationStateAnimation.loop) {
                this.animationTime = 0;
            } else {
                this.setAnimation("stand", 0);
            }
        }

        this.swordJoint.update(elapsedTime);
        super.update(elapsedTime);
    }

    public setAnimation(animation: SwordPlayerAnimationName, angle: number) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);
        if (animation === "slash1" && this.animationState === "slash1") {
            this.animationState = "slash2";
            this.animationStateAnimation = SwordPlayerAnimationData["slash2"];
        } else {
            this.animationState = animation;
            this.animationStateAnimation = SwordPlayerAnimationData[animation];
        }
    }
}

export interface SwordModelAnimation extends ModelAnimation {
    totalTime: number;
    loop: boolean;
    jointAnimationInfo: Record<SwordPlayerModelJoint, AnimationInfo>;
}

const SwordPlayerAnimationData: Record<SwordPlayerAnimationName, SwordModelAnimation> = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    slash1: {
        loop: false,
        totalTime: 0.6,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, -2],
                    [0.1, 0.3],
                    [0.2, 1.3],
                    [0.6, 1.7],
                    [1, 2],
                ],
                angleToEquation: [
                    [0, -2],
                    [0.1, -3],
                    [0.2, -0.8],
                    [0.6, -0.6],
                    [1, -0.5],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.1, -10],
                    [0.15, -30],
                    [0.2, 0],
                    [1, 15],
                ],
            },
        },
    },
    slash2: {
        loop: false,
        totalTime: 0.4,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0.0, 1.6],
                    [0.3, -1.7],
                    [0.4, -1.8],
                    [1, -1.6],
                ],
                angleToEquation: [
                    [0.0, 0.5],
                    [0.15, -0.1],
                    [0.3, -0.6],
                    [0.5, -0.9],
                    [1, -0.8],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.2, -30],
                    [0.6, 7],
                    [1, 12],
                ],
            },
        },
    },
    whirlwind: {
        loop: false,
        totalTime: 1,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, 0],
                    [0.3, Math.PI * -1],
                    [0.3, Math.PI],
                    [0.6, Math.PI * -1],
                    [0.6, Math.PI],
                    [0.9, Math.PI * -1],
                    [0.9, Math.PI],
                    [1, 0],
                ],
                angleToEquation: [
                    [0, 0],
                    [0.13, 0.3],
                    [0.2, -1],
                    [1, -0],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.13, 10],
                    [0.2, -5],
                    [1, 0],
                ],
            },
        },
    },
};
