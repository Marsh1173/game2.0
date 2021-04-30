import e = require("express");
import { defaultConfig } from "../../../config";
import { Size } from "../../../size";
import { rotateVector, Shape, Vector } from "../../../vector";
import { Doodad } from "../../terrain/doodads/doodad";
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

    constructor(baseActor: ClientPlayer | ServerPlayer, position: Vector, momentum: Vector, floor: Floor, public size: Size, doodads: Doodad[]) {
        super(baseActor, position, momentum, size, defaultActorConfig.playerMass + 0, floor, doodads);
    }

    public getCollisionRange(): number {
        if (this.crouching) {
            return Math.sqrt(24 ** 2 + 15 ** 2);
        } else {
            return Math.sqrt(24 ** 2 + 25 ** 2);
        }
    }

    public getGlobalShape(elapsedTime: number = 0): Shape {
        let position: Vector = { x: this.position.x + 0, y: this.position.y + 0 };
        if (elapsedTime !== 0) {
            position.x = this.position.x + this.momentum.x * elapsedTime;
            position.y = this.position.y + this.momentum.y * elapsedTime;
        }
        if (this.crouching) {
            return {
                center: { x: this.position.x + 0, y: this.position.y + 0 },
                points: playerCrouchingShape.points.map((point) => {
                    return { x: point.x + position.x, y: point.y + position.y };
                }),
                edges: playerCrouchingShape.edges.map((edge) => {
                    return {
                        p1: { x: edge.p1.x + position.x, y: edge.p1.y + position.y },
                        p2: { x: edge.p2.x + position.x, y: edge.p2.y + position.y },
                    };
                }),
            };
        } else {
            return {
                center: { x: this.position.x + 0, y: this.position.y + 0 },
                points: playerStandingShape.points.map((point) => {
                    return { x: point.x + position.x, y: point.y + position.y };
                }),
                edges: playerStandingShape.edges.map((edge) => {
                    return {
                        p1: { x: edge.p1.x + position.x, y: edge.p1.y + position.y },
                        p2: { x: edge.p2.x + position.x, y: edge.p2.y + position.y },
                    };
                }),
            };
        }
    }

    public registerGroundAngle(angle: number, standing: boolean) {
        this.objectAngle = (angle + this.objectAngle) / 2;
        if (standing) this.standing = true;
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

        this.checkDoodads();

        let groundHitDetection: { hit: boolean; angle: number } = this.checkGroundCollision(elapsedTime);
        if (groundHitDetection.hit) {
            this.registerGroundAngle(groundHitDetection.angle, true);
        } else {
            if (Math.abs(this.objectAngle) < 0.06) {
                this.objectAngle = 0;
            } else {
                this.objectAngle *= 0.9;
            }
        }
    }
}

const standingP1: Vector = { x: defaultActorConfig.playerSize.width / -2, y: defaultActorConfig.playerSize.height / -2 };
const standingP2: Vector = { x: defaultActorConfig.playerSize.width / 2, y: defaultActorConfig.playerSize.height / -2 };
const standingP3: Vector = { x: defaultActorConfig.playerSize.width / 2, y: defaultActorConfig.playerSize.height / 2 };
const standingP4: Vector = { x: defaultActorConfig.playerSize.width / -2, y: defaultActorConfig.playerSize.height / 2 };
export const playerStandingShape: Shape = {
    center: { x: 0, y: 0 },
    points: [standingP1, standingP2, standingP3, standingP4],
    edges: [
        { p1: standingP1, p2: standingP2 },
        { p1: standingP2, p2: standingP3 },
        { p1: standingP3, p2: standingP4 },
        { p1: standingP4, p2: standingP1 },
    ],
};
const crouchingP1: Vector = { x: defaultActorConfig.playerCrouchSize.width / -2, y: defaultActorConfig.playerCrouchSize.height / -2 };
const crouchingP2: Vector = { x: defaultActorConfig.playerCrouchSize.width / 2, y: defaultActorConfig.playerCrouchSize.height / -2 };
const crouchingP3: Vector = { x: defaultActorConfig.playerCrouchSize.width / 2, y: defaultActorConfig.playerCrouchSize.height / 2 };
const crouchingP4: Vector = { x: defaultActorConfig.playerCrouchSize.width / -2, y: defaultActorConfig.playerCrouchSize.height / 2 };
export const playerCrouchingShape: Shape = {
    center: { x: 0, y: 0 },
    points: [crouchingP1, crouchingP2, crouchingP3, crouchingP4],
    edges: [
        { p1: crouchingP1, p2: crouchingP2 },
        { p1: crouchingP2, p2: crouchingP3 },
        { p1: crouchingP3, p2: crouchingP4 },
        { p1: crouchingP4, p2: crouchingP1 },
    ],
};
