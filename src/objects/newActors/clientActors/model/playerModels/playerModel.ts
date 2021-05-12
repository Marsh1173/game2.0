import { Game } from "../../../../../client/game";
import { Size } from "../../../../../size";
import { Vector } from "../../../../../vector";
import { defaultActorConfig } from "../../../actorConfig";
import { ClientPlayer } from "../../clientPlayer/clientPlayer";
import { SideType } from "../healthBar";
import { Model } from "../model";

export abstract class PlayerModel extends Model {
    protected animationTime: number = 0;

    protected facingAnimation: { frame: number; facingRight: boolean } = { frame: 1, facingRight: true };
    protected facingAngleAnimation: { frame: number; angle: number; targetAngle: number } = { frame: 1, angle: 0, targetAngle: 0 };

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
    }

    protected renderBlock() {
        this.ctx.fillStyle = this.playerColor;
        this.ctx.fillRect(this.size.width / -2, this.size.height / -2, this.size.width, this.size.height);

        /*this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.cos(this.facingAngleAnimation.angle) * 50, Math.sin(this.facingAngleAnimation.angle) * 50);
        this.ctx.stroke();*/
    }

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
        if (angle < Math.PI / -2) {
            this.facingAngleAnimation.targetAngle = -Math.PI - angle;
        } else if (angle > Math.PI / 2) {
            this.facingAngleAnimation.targetAngle = Math.PI - angle;
        } else {
            this.facingAngleAnimation.targetAngle = angle;
        }
    }
}

export interface PlayerModelConfig {
    turnTime: number;
}

export const playerModelConfig: PlayerModelConfig = {
    turnTime: 0.06,
};
