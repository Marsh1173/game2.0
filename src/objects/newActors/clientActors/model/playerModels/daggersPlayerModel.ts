import { Game } from "../../../../../client/game";
import { assetManager } from "../../../../../client/gameRender/assetmanager";
import { findAngle } from "../../../../../findAngle";
import { Size } from "../../../../../size";
import { Vector } from "../../../../../vector";
import { DaggersStabHitShape } from "../../../../clientControllers/controllers/abilities/daggersAbilities/daggersStabAbility";
import { SwordSlashHitShape } from "../../../../clientControllers/controllers/abilities/swordAbilities/swordSlashAbility";
import { renderShape } from "../../clientActor";
import { ClientDaggers } from "../../clientPlayer/clientClasses/clientDaggers";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Joint } from "../joint";
import { AnimationInfo, ModelAnimation } from "../model";
import { PlayerModel } from "./playerModel";

type DaggersPlayerModelJoint = "playerDagger";
export type DaggersPlayerAnimationName = "stand" | "stab" | "lunge";

export class DaggersPlayerModel extends PlayerModel {
    protected animationStateAnimation: DaggersModelAnimation = DaggersPlayerAnimationData["stand"];
    protected animationState: DaggersPlayerAnimationName = "stand";
    protected daggerJoint: Joint;

    constructor(game: Game, player: ClientDaggers, ctx: CanvasRenderingContext2D, position: Vector, healthBarType: SideType, playerColor: string, size: Size) {
        super(game, player, ctx, position, healthBarType, playerColor, size);
        this.daggerJoint = new Joint(this.ctx, assetManager.images["dagger21"], { x: -200, y: -700 }, 0.09, 0, { x: -20, y: 20 }, 0, -0.5);
    }

    public renderWeapon() {
        this.daggerJoint.render(this.animationTime / this.animationStateAnimation.totalTime, this.animationStateAnimation.jointAnimationInfo["playerDagger"]);

        this.ctx.scale(-1, 1);
        //renderShape(this.ctx, DaggersStabHitShape);
        this.ctx.scale(-1, 1);
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

        this.daggerJoint.update(elapsedTime);
        super.update(elapsedTime);
    }

    public setAnimation(animation: DaggersPlayerAnimationName, angle: number) {
        this.animationTime = 0;
        this.changeFacingAngle(angle);

        this.animationState = animation;
        this.animationStateAnimation = DaggersPlayerAnimationData[animation];
    }
}

export interface DaggersModelAnimation extends ModelAnimation {
    totalTime: number;
    loop: boolean;
    jointAnimationInfo: Record<DaggersPlayerModelJoint, AnimationInfo>;
}

const DaggersPlayerAnimationData: Record<DaggersPlayerAnimationName, DaggersModelAnimation> = {
    stand: {
        loop: true,
        totalTime: 1,
        jointAnimationInfo: {
            playerDagger: {
                imgRotationEquation: undefined,
                localPosXEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
            },
        },
    },
    stab: {
        loop: false,
        totalTime: 0.6,
        jointAnimationInfo: {
            playerDagger: {
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
    lunge: {
        loop: false,
        totalTime: 0.3,
        jointAnimationInfo: {
            playerDagger: {
                imgRotationEquation: undefined,
                localPosYEquation: undefined,
                angleFromEquation: undefined,
                angleToEquation: undefined,
                localPosXEquation: undefined,
            },
        },
    },
};
