import { Size } from "../../../../size";
import { Vector } from "../../../../vector";
import { defaultActorConfig } from "../../actorConfig";
import { ClientPlayer } from "../clientPlayer/clientPlayer";

/*export class PlayerModel extends Model {
    constructor(
        private playerActor: ClientPlayer,
        ctx: CanvasRenderingContext2D,
        position: Vector,
        momentum: Vector,
        public size: Size,
        protected color: string,
        healthInfo: { health: number; maxHealth: number },
        healthBarType: SideType,
    ) {
        super(ctx, position, momentum, healthInfo, healthBarType);
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.save();
        this.ctx.translate(this.position.x - this.targetPosition.x, this.position.y - this.targetPosition.y);
        this.ctx.rotate(this.playerActor.actorObject.objectAngle);
        this.ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
        this.ctx.restore();
    }
}*/
