import { findDistance, Vector } from "./vector";

export function findAngle(pos1: Vector, pos2: Vector): number {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
}

export function rotateShape(shape: Vector[], angle: number, positionOffset: Vector, flipOverY: boolean = false /*, flipOverX: boolean = false*/): Vector[] {
    let newVectorArray: Vector[] = [];
    for (var i: number = 0; i < shape.length; i++) {
        newVectorArray.push({ x: shape[i].x + 0, y: shape[i].y + 0 });
    }
    for (var i: number = 0; i < shape.length; i++) {
        if ((flipOverY && angle > Math.PI / 2) || angle < -Math.PI / 2) {
            // flip it around if they're facing left
            newVectorArray[i].y *= -1;
        }
        /*if (flipOverX && angle > Math.PI / 2 || angle < -Math.PI / 2) {
            // flip it around if they're facing left
            shape[i].y *= -1;
        }*/
        let tan: number = findAngle({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y }); // find original angle
        let distance: number = findDistance({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y }); // find original distance
        newVectorArray[i].x = distance * Math.cos(tan + angle) + positionOffset.x;
        newVectorArray[i].y = distance * Math.sin(tan + angle) + positionOffset.y;
    }
    return newVectorArray;
}
