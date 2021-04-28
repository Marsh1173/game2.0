import { WeaponType } from "../../../../objects/Actors/Players/playerActor";
import { Size } from "../../../../size";
import { Vector } from "../../../../vector";
import { assetManager } from "../../../gameRender/assetmanager";
import { renderShape } from "../../../gameRender/gameRenderer";
import { ClientPlayerActor } from "../clientPlayerActor";
import { ClientModelWeapon } from "../clientPlayerWeapons/object";
import { genericRenderWeapon } from "../clientPlayerWeapons/render";
import { renderPlayerModel, renderPlayerHealth, renderPlayerName, renderPlayerWeapon, renderDeadPlayerModel } from "./functions";

export type ClientPlayerAnimationState = "dead" | "idle" | "attacking" | "channeling";

export class ClientPlayerModel {
    public stutterCompensatePosition: Vector = { x: 0, y: 0 };
    public rotation: number = 0;
    protected path: Path2D = new Path2D(
        "M -" +
            this.player.size.width / 2 +
            " -" +
            this.player.size.height / 2 +
            " h " +
            this.player.size.width +
            " v " +
            this.player.size.height +
            " h -" +
            this.player.size.width +
            " Z",
    );

    protected wasHit: number = 0;
    protected whiteDamageBar: number = 0;

    public clientModelWeapon: ClientModelWeapon;

    constructor(public player: ClientPlayerActor, public animationState: ClientPlayerAnimationState = "idle") {
        this.clientModelWeapon = new ClientModelWeapon(this, "none", undefined, { x: 0, y: 0 }, 0, 0, { x: 0, y: 0 }, 0);
    }

    public renderPlayerModel = renderPlayerModel;
    public renderDeadPlayerModel = renderDeadPlayerModel;
    public renderPlayerHealth = renderPlayerHealth;
    public renderPlayerName = renderPlayerName;
    public renderPlayerWeapon = renderPlayerWeapon;

    public renderPlayer(ctx: CanvasRenderingContext2D) {
        if (this.animationState !== "dead") {
            this.renderPlayerModel(ctx);
            this.renderPlayerHealth(ctx);
            this.renderPlayerName(ctx);
            this.renderPlayerWeapon(ctx);
        } else {
            this.renderDeadPlayerModel(ctx);
        }
    }

    public registerDamage(quantity: number) {
        this.whiteDamageBar += quantity;
        let flashTime = quantity;
        if (this.wasHit < flashTime) {
            this.wasHit = flashTime;
        }
    }

    public registerPlatformRotation(angle: number | undefined) {
        if (angle) this.rotation = angle;
        else {
            if (this.rotation === 0) {
                return;
            } else if (-0.1 < this.rotation && this.rotation < 0.1) {
                this.rotation = 0;
            } else {
                this.rotation *= 0.8;
            }
        }
    }

    public setAnimationToDead() {
        this.animationState = "dead";
        this.wasHit = 0;
        this.whiteDamageBar = 0;
    }

    public setAnimationToResurrect() {
        this.animationState = "idle";
        this.wasHit = 0;
        this.whiteDamageBar = 0;
    }

    public update(elapsedTime: number) {
        if (this.stutterCompensatePosition.x > 3) this.stutterCompensatePosition.x -= 3;
        else if (this.stutterCompensatePosition.x < -3) this.stutterCompensatePosition.x += 3;
        else if (this.stutterCompensatePosition.x !== 0) this.stutterCompensatePosition.x = 0;
        if (this.stutterCompensatePosition.y > 3) this.stutterCompensatePosition.y -= 3;
        else if (this.stutterCompensatePosition.y < -3) this.stutterCompensatePosition.y += 3;
        else if (this.stutterCompensatePosition.y !== 0) this.stutterCompensatePosition.y = 0;

        if (this.animationState !== "dead") {
            if (this.wasHit > 0) {
                this.wasHit *= 0.9;
                this.wasHit -= elapsedTime * 15;
            } else if (this.wasHit < 0) {
                this.wasHit = 0;
            }
            if (this.whiteDamageBar > 0) {
                this.whiteDamageBar *= 0.95;
                this.whiteDamageBar -= elapsedTime * 5;
            } else if (this.whiteDamageBar < 0) {
                this.whiteDamageBar = 0;
            }
        }

        this.clientModelWeapon.update(elapsedTime);
    }
}
