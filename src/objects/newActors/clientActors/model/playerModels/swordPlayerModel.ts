import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { Size } from "../../../../../size";
import { Vector } from "../../../../../vector";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Joint } from "../joint";
import { AnimationInfo, ModelAnimation } from "../model";
import { PlayerModel } from "./playerModel";

type SwordPlayerModelJoint = "playerSword";
export type SwordPlayerAnimationName = "stand" | "slash" | "whirlwind";

export class SwordPlayerModel extends PlayerModel {
    protected animationStateAnimation: SwordModelAnimation = SwordPlayerAnimationData["stand"];
    protected animationState: SwordPlayerAnimationName = "stand";
    protected swordJoint: Joint;

    constructor(game: Game, player: ClientPlayer, ctx: CanvasRenderingContext2D, position: Vector, healthBarType: SideType, playerColor: string, size: Size) {
        super(game, player, ctx, position, healthBarType, playerColor, size);
        this.swordJoint = new Joint(this.ctx, assetManager.images["berserkerSword2"], { x: -50, y: -150 }, 0.4, 0, { x: -25, y: 10 }, 0, -0.5);
    }

    public render() {
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.player.actorObject.objectAngle);
        this.renderBlock();
        this.ctx.rotate(-this.player.actorObject.objectAngle);

        let facing: number = this.getFacingScale();
        let angle: number = this.getFacingAngle();

        this.ctx.scale(facing, 1);
        this.ctx.rotate(angle);
        this.swordJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerSword"]);
        this.ctx.rotate(-angle);
        this.ctx.scale(1 / facing, 1);

        this.ctx.translate(-this.position.x, -this.position.y);
        this.healthBar.renderHealth();
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

        this.updateFacing(elapsedTime);
        this.updateFacingAngle(elapsedTime);
        this.healthBar.update(elapsedTime);
        this.swordJoint.update(elapsedTime);
    }

    public setAnimation(animation: SwordPlayerAnimationName, angle: number) {
        this.animationTime = 0;
        this.animationStateAnimation = SwordPlayerAnimationData[animation];
        this.changeFacingAngle(angle);
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
    slash: {
        loop: false,
        totalTime: 0.3,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, 0],
                    [0.15, 1.5],
                    [0.3, 1.7],
                    [0.37, 1.6],
                    [0.75, -1.8],
                    [1, -1.6],
                ],
                angleToEquation: [
                    [0, 0],
                    [0.45, 0.5],
                    [0.6, -0.1],
                    [0.7, -0.6],
                    [0.9, -0.7],
                    [1, -0.8],
                ],
                localPosXEquation: [
                    [0, 0],
                    [0.3, 0],
                    [0.5, -20],
                    [1, 0],
                ],
            },
        },
    },
    whirlwind: {
        loop: true,
        totalTime: 0.333,
        jointAnimationInfo: {
            playerSword: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: [
                    [0, 0],
                    [0.5, Math.PI * -1],
                    [0.5, Math.PI],
                    [1, 0],
                ],
                angleToEquation: [[1, -0.7]],
            },
        },
    },
};
