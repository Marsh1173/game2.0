import { findAngle } from "./findAngle";

export interface Vector {
    x: number;
    y: number;
}

export interface Edge {
    p1: Vector;
    p2: Vector;
}

export interface DoodadEdge {
    p1: Vector;
    p2: Vector;
    angle: number;
    slope: Vector;
    isGround: boolean;
    orthogonalVector: Vector;
}

export interface Shape {
    center: Vector;
    points: Vector[];
    edges: Edge[];
}

export function findVectorFromAngle(angle: number, magnitude: number = 1): Vector {
    return { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
}

export function findDistance(a: Vector, b: Vector): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function findDifference(a: Vector, b: Vector): Vector {
    return { x: b.x - a.x, y: b.y - a.y };
}

export function findLength(vector: Vector): number {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

export function rotateVector(angle: number, vector: Vector): Vector {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    };
}

export function findMirroredAngle(angle: number): number {
    if (angle < Math.PI / -2) {
        return -Math.PI - angle;
    } else if (angle > Math.PI / 2) {
        return Math.PI - angle;
    } else {
        return angle;
    }
}

export function rotateShape(shape: Vector[], angle: number, positionOffset: Vector, flipOverY: boolean = false): Vector[] {
    let newVectorArray: Vector[] = [];

    for (var i: number = 0; i < shape.length; i++) {
        newVectorArray.push({ x: shape[i].x + 0, y: shape[i].y + 0 });

        let tan: number = findAngle({ x: 0, y: 0 }, { x: newVectorArray[i].x, y: newVectorArray[i].y });
        let mag: number = findLength(newVectorArray[i]);
        newVectorArray[i].x = mag * Math.cos(tan + angle);
        newVectorArray[i].y = mag * Math.sin(tan + angle) + positionOffset.y;

        if (flipOverY) {
            // flip it around if they're facing left
            newVectorArray[i].x *= -1;
        }
        newVectorArray[i].x += positionOffset.x;
    }
    return newVectorArray;
}
export function dotProduct(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
}

export function vectorProject(v1: Vector, v2: Vector): Vector {
    var norm: number = findDistance({ x: 0, y: 0 }, v2);
    var scalar: number = dotProduct(v1, v2) / Math.pow(norm, 2);
    return { x: v2.x * scalar, y: v2.y * scalar };
}
function dist2(v: Vector, w: Vector): number {
    return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}

export function findMinDistancePointToEdge(point: Vector, edge: Edge): Vector {
    var l2 = dist2(edge.p1, edge.p2);
    if (l2 === 0) return { x: edge.p1.x - point.x, y: edge.p1.y - point.y };
    var t = ((point.x - edge.p1.x) * (edge.p2.x - edge.p1.x) + (point.y - edge.p1.y) * (edge.p2.y - edge.p1.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    let closestPoint: Vector = { x: edge.p1.x + t * (edge.p2.x - edge.p1.x), y: edge.p1.y + t * (edge.p2.y - edge.p1.y) };
    return { x: closestPoint.x - point.x, y: closestPoint.y - point.y };
}

export function rootKeepSign(number: number, root: number): number {
    if (number >= 0) return Math.pow(number, 1 / root);
    else return Math.pow(Math.abs(number), 1 / root) * -1;
}
