import e = require("express");
import { Size } from "../../../size";
import { Vector } from "../../../vector";
import { Floor } from "../../terrain/floor/floor";
import { Actor } from "../actor";
import { defaultActorConfig } from "../actorConfig";
import { ClientPlayer } from "../clientActors/clientPlayer/clientPlayer";
import { ServerPlayer } from "../serverActors/serverPlayer/serverPlayer";
import { ActorObject } from "./actorObject";

export class PlayerObject extends ActorObject {
    protected jumpHeight: number = defaultActorConfig.playerJumpHeight + 0;
    protected maxSidewaysSpeed: number = defaultActorConfig.maxSidewaysMomentum + 0;
    protected sidewaysStandingAcceleration: number = defaultActorConfig.standingSidewaysAcceleration + 0;
    protected sidewaysFallingAcceleration: number = defaultActorConfig.nonStandingSidewaysAcceleration + 0;

    public objectAngle: number = 0;

    public crouching: boolean = false;
    public standing: boolean = false;

    constructor(baseActor: ClientPlayer | ServerPlayer, position: Vector, momentum: Vector, floor: Floor, public size: Size) {
        super(baseActor, position, momentum, size, defaultActorConfig.playerMass + 0, floor);
    }

    public jump() {
        this.momentum.y = -this.jumpHeight;
    }

    public accelerateRight(elapsedTime: number) {
        if (this.momentum.x < this.maxSidewaysSpeed) {
            if (this.standing) {
                let force = this.sidewaysStandingAcceleration * elapsedTime;
                this.momentum.x += force * Math.cos(this.objectAngle);
                if (this.objectAngle > 0) this.momentum.y += force * Math.sin(this.objectAngle) * 5;
            } else {
                this.momentum.x += this.sidewaysFallingAcceleration * elapsedTime;
            }
            if (this.momentum.x > this.maxSidewaysSpeed) this.momentum.x = this.maxSidewaysSpeed - 1;
        }
    }

    public accelerateLeft(elapsedTime: number) {
        if (this.momentum.x > -this.maxSidewaysSpeed) {
            if (this.standing) {
                let force = this.sidewaysStandingAcceleration * elapsedTime;
                this.momentum.x -= force * Math.cos(this.objectAngle);
                if (this.objectAngle < 0) this.momentum.y -= force * Math.sin(this.objectAngle) * 5;
            } else {
                this.momentum.x -= this.sidewaysFallingAcceleration * elapsedTime;
            }
            if (this.momentum.x < -this.maxSidewaysSpeed) this.momentum.x = -this.maxSidewaysSpeed + 1;
        }
    }

    public crouch() {
        if (!this.crouching) {
            this.size.height = defaultActorConfig.playerCrouchSize.height;
            this.position.y += (defaultActorConfig.playerSize.height - this.size.height) / 2;

            this.maxSidewaysSpeed /= 3;

            this.crouching = true;
        }
    }
    public unCrouch() {
        if (this.crouching) {
            this.position.y -= (defaultActorConfig.playerSize.height - this.size.height) / 2;
            this.size.height = defaultActorConfig.playerSize.height + 0;

            this.maxSidewaysSpeed *= 3;

            this.crouching = false;
        }
    }

    public update(elapsedTime: number, isTravelling: boolean) {
        if (!isTravelling && this.standing) this.registerGroundFriction(elapsedTime);
        this.registerAirResistance(elapsedTime);

        this.registerGravity(elapsedTime);
        this.updateTranslation(elapsedTime);

        this.standing = false;

        this.checkXBoundaryCollision(elapsedTime);
        if (this.checkYBoundaryCollision(elapsedTime)) this.standing = true;

        this.finalPositionUpdate(elapsedTime);

        let groundHitDetection: { hit: boolean; angle: number } = this.checkGroundCollision(elapsedTime);
        if (groundHitDetection.hit) {
            this.standing = true;
            this.objectAngle = (groundHitDetection.angle + this.objectAngle) / 2;
        } else {
            if (Math.abs(this.objectAngle) < 0.06) {
                this.objectAngle = 0;
            } else {
                this.objectAngle *= 0.9;
            }
        }
    }
}
