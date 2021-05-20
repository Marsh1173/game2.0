import { Game } from "../../../../../client/game";
import { roundRect } from "../../../../../client/gameRender/gameRenderer";
import { Size } from "../../../../../size";
import { findMirroredAngle, rotateShape, Vector } from "../../../../../vector";
import { defaultActorConfig } from "../../../actorConfig";
import { renderShape } from "../../clientActor";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Model } from "../model";

export abstract class PlayerModel extends Model {
    protected animationTime: number = 0;

    protected facingAnimation: { frame: number; facingRight: boolean } = { frame: 1, facingRight: true };
    protected facingAngleAnimation: { frame: number; angle: number; targetAngle: number } = { frame: 1, angle: 0, targetAngle: 0 };

    protected hitAnimation: { frame: number; renderColor: string };

    constructor(
        game: Game,
        player: ClientPlayer,
        ctx: CanvasRenderingContext2D,
        position: Vector,
        healthBarType: SideType,
        protected readonly playerColor: string,
        protected readonly size: Size,
    ) {
        super(game, player, ctx, position, healthBarType);
        this.hitAnimation = { frame: 0, renderColor: this.playerColor };
    }

    protected renderBlock() {
        this.ctx.fillStyle = this.hitAnimation.renderColor;
        this.ctx.fillRect(this.size.width / -2, this.size.height / -2, this.size.width, this.size.height);

        this.ctx.strokeStyle = "#222222";
        this.ctx.lineWidth = 2;
        roundRect(this.ctx, this.size.width / -2 - 1, this.size.height / -2 - 1, this.size.width + 2, this.size.height + 2, 3, false, true);
        //();

        /*this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(this.facingAngleAnimation.angle) * 50, Math.sin(this.facingAngleAnimation.angle) * 50);
        this.ctx.stroke();*/
    }

    public registerDamage(quantity: number) {
        this.hitAnimation.frame = 0.07;
        this.hitAnimation.renderColor = "red";
        super.registerDamage(quantity);
    }

    protected updateHitAnimation(elapsedTime: number) {
        if (this.hitAnimation.frame > 0) {
            this.hitAnimation.frame -= elapsedTime;
            if (this.hitAnimation.frame <= 0) {
                this.hitAnimation.frame = 0;
                this.hitAnimation.renderColor = this.playerColor;
            }
        }
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
        this.renderWeapon();
        this.ctx.rotate(-angle);
        this.ctx.scale(1 / facing, 1);

        this.ctx.translate(-this.position.x, -this.position.y);
        this.healthBar.renderHealth();
    }

    protected abstract renderWeapon(): void;

    protected updateFacing(elapsedTime: number) {
        if (this.facingAnimation.frame < 1) {
            this.facingAnimation.frame += elapsedTime * (1 / playerModelConfig.turnTime);
        }
    }
    protected getFacingScale(): number {
        if (this.facingAnimation.facingRight) {
            if (this.facingAnimation.frame < 1) {
                return 1 - this.facingAnimation.frame * 2;
            } else {
                return -1;
            }
        } else {
            if (this.facingAnimation.frame < 1) {
                return -1 + this.facingAnimation.frame * 2;
            } else {
                return 1;
            }
        }
    }

    public changeFacing(facingRight: boolean) {
        this.facingAnimation.facingRight = facingRight;
        this.facingAnimation.frame = 0;
    }

    protected updateFacingAngle(elapsedTime: number) {
        this.facingAngleAnimation.angle =
            (this.facingAngleAnimation.targetAngle - this.facingAngleAnimation.angle) * (elapsedTime * 5) + this.facingAngleAnimation.angle;
    }

    protected getFacingAngle(): number {
        return -this.facingAngleAnimation.angle;
    }

    public changeFacingAngle(angle: number) {
        this.facingAngleAnimation.frame = 0;
        this.facingAngleAnimation.targetAngle = findMirroredAngle(angle);
    }

    public update(elapsedTime: number) {
        this.updateFacing(elapsedTime);
        this.updateFacingAngle(elapsedTime);
        this.updateHitAnimation(elapsedTime);
        super.update(elapsedTime);
    }
}

export interface PlayerModelConfig {
    turnTime: number;
}

export const playerModelConfig: PlayerModelConfig = {
    turnTime: 0.06,
};
