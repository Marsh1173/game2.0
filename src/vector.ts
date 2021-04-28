export interface Vector {
    x: number;
    y: number;
}

export function findDistance(a: Vector, b: Vector): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function rotateVector(angle: number, vector: Vector): Vector {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
    };
}

export function rootKeepSign(number: number, root: number): number {
    if (number >= 0) return Math.pow(number, 1 / root);
    else return Math.pow(Math.abs(number), 1 / root) * -1;
}
