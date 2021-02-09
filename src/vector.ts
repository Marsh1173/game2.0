export interface Vector {
    x: number;
    y: number;
}

export function findDistance(a: Vector, b: Vector): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}