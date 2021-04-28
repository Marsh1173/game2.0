import { findAngle } from "../../findAngle";
import { ifInside } from "../../ifInside";
import { ifIntersect } from "../../ifIntersect";
import { Size } from "../../size";
import { findDistance, Vector } from "../../vector";
import { Platform } from "../platform";
import { Actor } from "./actor";

export function checkSideCollision(this: Actor, elapsedTime: number) {
    let futurePosX: number = this.position.x + this.momentum.x * elapsedTime;
    let futurePosY: number = this.position.y + this.momentum.y * elapsedTime;

    let verticalSize: number = this.size.height / 2;
    let horizontalSize: number = this.size.width / 2;

    if (futurePosY < verticalSize) {
        this.position.y = verticalSize;
        this.momentum.y = Math.max(this.momentum.y, 0);
    } else if (futurePosY + verticalSize > this.config.ySize) {
        this.position.y = this.config.ySize - verticalSize;
        this.momentum.y = Math.min(this.momentum.y, 0);
        this.standing = true;
    }
    if (futurePosX < horizontalSize) {
        this.position.x = horizontalSize;
        this.momentum.x = 0;
    } else if (futurePosX + horizontalSize > this.config.xSize) {
        this.position.x = this.config.xSize - horizontalSize;
        this.momentum.x = 0;
    }
}

export function checkRectangleCollision(this: Actor, elapsedTime: number, platform: Platform) {
    let futurePosX = this.position.x + this.momentum.x * elapsedTime;
    let futurePosY = this.position.y + this.momentum.y * elapsedTime;
    if (
        futurePosX - this.size.width / 2 < platform.position.x + platform.size.width &&
        futurePosX + this.size.width / 2 > platform.position.x &&
        futurePosY - this.size.height / 2 < platform.position.y + platform.size.height &&
        futurePosY + this.size.height / 2 > platform.position.y
    ) {
        const points: Vector[] = [
            {
                // above
                x: this.position.x,
                y: platform.position.y - this.size.height / 2,
            },
            {
                // below
                x: this.position.x,
                y: platform.position.y + platform.size.height + this.size.height / 2,
            },
            {
                // left
                x: platform.position.x - this.size.width / 2,
                y: this.position.y,
            },
            {
                // right
                x: platform.position.x + platform.size.width + this.size.width / 2,
                y: this.position.y,
            },
        ];

        const distances = points.map((point) => findDistance(point, this.position));

        let smallest = distances[0];
        let smallestIndex = 0;
        distances.forEach((distance, i) => {
            if (distance < smallest) {
                smallest = distance;
                smallestIndex = i;
            }
        });

        this.position.x = points[smallestIndex].x;
        this.position.y = points[smallestIndex].y;
        switch (smallestIndex) {
            case 0: // above
                if (this.momentum.y > 0) this.momentum.y = 0;
                this.standing = true;
                break;
            case 1: // below
                if (this.momentum.y < 0) this.momentum.y = 0;
                break;
            case 2: // left
                if (this.momentum.x > 0) this.momentum.x = 0;
                break;
            case 3: // right
                if (this.momentum.x < 0) this.momentum.x = 0;
                break;
        }
    }
}

export function registerGravity(this: Actor, elapsedTime: number) {
    if (this.updateStats.fallingSpeedPercentage !== 1) {
        this.momentum.y += this.fallingAcceleration * elapsedTime * this.updateStats.fallingSpeedPercentage;
    } else {
        this.momentum.y += this.fallingAcceleration * elapsedTime;
    }
}

export function transport(this: Actor, position: Vector) {
    this.position.x = position.x + 0;
    this.position.y = position.y + 0;
}

export function basicOneDHitBox(this: Actor, point: Vector): boolean {
    if (
        point.x < this.position.x + this.size.width / 2 &&
        point.x > this.position.x - this.size.width / 2 &&
        point.y < this.position.y + this.size.height / 2 &&
        point.y > this.position.y - this.size.height / 2
    ) {
        return true;
    } else return false;
}

export function basicTwoDHitBox(this: Actor, trailingPoint: Vector, leadingPoint: Vector): boolean {
    if (this.oneDHitBox(trailingPoint)) return true;
    if (this.oneDHitBox(leadingPoint)) return true;

    let actorShape: Vector[] = this.getShape();

    const shapeArrayLength: number = actorShape.length;

    for (var i: number = 0; i < shapeArrayLength; i++) {
        if (ifIntersect(actorShape[i], actorShape[(i + 1) % shapeArrayLength], trailingPoint, leadingPoint)) {
            return true;
        }
    }

    return false;
}

export function basicThreeDHitBox(this: Actor, shape: Vector[]): boolean {
    let actorShape: Vector[] = this.getShape();

    if (this.isInsideHitBox(shape)) {
        // first check the center of this actor
        return true;
    }
    for (var i2: number = 0; i2 < actorShape.length; i2++) {
        // otherwise check each corner of the actor
        if (ifInside(actorShape[i2], shape)) return true;
    }
    /*for (var i: number = 0; i < shape.length; i++) {
        // otherwise check each corner of the shape
        if (this.oneDHitBox(shape[i])) return true;
    }*/
    if (this.oneDHitBox(shape[0])) return true; // and check if the other shape is entirely inside this actor
    return false;
}

export function basicDistanceHitBox(this: Actor, point: Vector, distance: number): boolean {
    if (findDistance(point, this.position) < distance) {
        return true;
    }
    return false;
}
export function basicIsInsideHitBox(this: Actor, shape: Vector[]): boolean {
    return ifInside(this.position, shape);
}
