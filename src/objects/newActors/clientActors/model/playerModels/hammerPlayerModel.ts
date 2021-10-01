import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { Size } from "../../../../../size";
import { Vector } from "../../../../../vector";
import { renderShape } from "../../clientActor";
import { ClientHammer } from "../../clientPlayer/clientClasses/clientHammer";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Joint } from "../joint";
import { AnimationInfo, ModelAnimation } from "../model";
import { PlayerModel } from "./playerModel";

type HammerPlayerModelJoint = "playerHammer";
export type HammerPlayerAnimationName = "stand" | "swing1" | "swing2" | "pound";

export class HammerPlayerModel extends PlayerModel {
    protected animationStateAnimation: HammerModelAnimation = HammerPlayerAnimationData["stand"];
    protected animationState: HammerPlayerAnimationName = "stand";
    protected hammerJoint: Joint;

    constructor(game: Game, player: ClientHammer, ctx: CanvasRenderingContext2D, position: Vector, healthBarType: SideType, playerColor: string, size: Size) {
        super(game, player, ctx, position, healthBarType, playerColor, size);
        this.hammerJoint = new Joint(this.ctx, assetManager.images["hammer21"], { x: -200, y: -700 }, 0.12, 0, { x: -25, y: 20 }, 0, -0.4);
    }

    public renderWeapon() {
        this.hammerJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerHammer"]);

        /*this.ctx.scale(-1, 1);
        renderShape(this.ctx, hammerSlashHitShape);
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

        this.hammerJoint.update(elapsedTime);
        super.update(elapsedTime);
    }

    public setAnimation(animation: HammerPlayerAnimationName, angle: number) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);
        if (animation === "swing1" && this.animationState === "swing1") {
            this.animationState = "swing2";
            this.animationStateAnimation = HammerPlayerAnimationData["swing2"];
        } else {
            this.animationState = animation;
            this.animationStateAnimation = HammerPlayerAnimationData[animation];
        }
    }
}

export interface HammerModelAnimation extends ModelAnimation {
    totalTime: number;
    loop: boolean;
    jointAnimationInfo: Record<HammerPlayerModelJoint, AnimationInfo>;
}

const HammerPlayerAnimationData: Record<HammerPlayerAnimationName, HammerModelAnimation> = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerHammer: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    swing2: {
        loop: false,
        totalTime: 0.8,
        jointAnimationInfo: {
            playerHammer: {
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
    swing1: {
        loop: false,
        totalTime: 0.8,
        jointAnimationInfo: {
            playerHammer: {
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
    pound: {
        loop: false,
        totalTime: 1,
        jointAnimationInfo: {
            playerHammer: {
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
