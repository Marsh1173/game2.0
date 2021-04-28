import { findAngle } from "../findAngle";
import { Vector } from "../vector";
import { Actor } from "./Actors/actor";

export interface GroundPlatformPoint {
    pointPosition: Vector;
    slope: number;
    angle: number;
}

export abstract class GroundPlatform {
    protected readonly pointsAndAngles: GroundPlatformPoint[] = [];

    constructor(points: Vector[]) {
        for (var i: number = 0; i < points.length; i++) {
            if (i < points.length - 1) {
                let angle: number = findAngle(points[i], points[i + 1]);

                if (points[i + 1].x - points[i].x === 0) throw new Error("Cannot have two adjacent ground points with the same x coordinate");
                let slope: number = (points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x);

                this.pointsAndAngles.push({ pointPosition: points[i], slope, angle });
            } else {
                this.pointsAndAngles.push({ pointPosition: points[i], slope: 0, angle: 0 });
            }
        }
    }

    public checkActorGroundCollision(actor: Actor, elapsedTime: number): number | undefined {
        let pointBelowActor: GroundPlatformPoint | undefined = undefined;
        let actorFuturePosition: Vector = { x: actor.position.x + actor.momentum.x * elapsedTime, y: actor.position.y + actor.momentum.y * elapsedTime };

        for (var i: number = this.pointsAndAngles.length - 1; i >= 0; i--) {
            if (this.pointsAndAngles[i].pointPosition.x < actorFuturePosition.x) {
                pointBelowActor = this.pointsAndAngles[i];
                break;
            }
        }

        if (pointBelowActor) {
            let newY: number = (actorFuturePosition.x - pointBelowActor.pointPosition.x) * pointBelowActor.slope;
            //console.log(pointBelowActor.pointPosition.x);
            if (actorFuturePosition.y + actor.size.height / 2 > newY + pointBelowActor.pointPosition.y) {
                actor.momentum.y = Math.min(0, actor.momentum.y);
                actor.position.y = newY + pointBelowActor.pointPosition.y - actor.size.height / 2;
                actor.standing = true;
                return pointBelowActor.angle;
            } else {
                return undefined;
            }
        } else {
            //throw new Error("Actor is outside the ground boundaries");
        }
    }
}
