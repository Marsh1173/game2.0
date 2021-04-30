import { Edge, Vector } from "./vector";

// returns true if line1 intersects with line2
export function ifIntersect(line1Start: Vector, line1End: Vector, line2Start: Vector, line2End: Vector): boolean {
    var det, gamma, lambda;
    det = (line1End.x - line1Start.x) * (line2End.y - line2Start.y) - (line2End.x - line2Start.x) * (line1End.y - line1Start.y);
    if (det === 0) {
        return false;
    } else {
        lambda = ((line2End.y - line2Start.y) * (line2End.x - line1Start.x) + (line2Start.x - line2End.x) * (line2End.y - line1Start.y)) / det;
        gamma = ((line1Start.y - line1End.y) * (line2End.x - line1Start.x) + (line1End.x - line1Start.x) * (line2End.y - line1Start.y)) / det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
export function findIntersection(edge1: Edge, edge2: Edge): undefined | Vector {
    // Check if none of the lines are of length 0
    if ((edge1.p1.x === edge1.p2.x && edge1.p1.y === edge1.p2.y) || (edge2.p1.x === edge2.p2.x && edge2.p1.y === edge2.p2.y)) {
        return undefined;
    }

    let denominator: number = (edge2.p2.y - edge2.p1.y) * (edge1.p2.x - edge1.p1.x) - (edge2.p2.x - edge2.p1.x) * (edge1.p2.y - edge1.p1.y);

    // Lines are parallel
    if (denominator === 0) {
        return undefined;
    }

    let ua = ((edge2.p2.x - edge2.p1.x) * (edge1.p1.y - edge2.p1.y) - (edge2.p2.y - edge2.p1.y) * (edge1.p1.x - edge2.p1.x)) / denominator;
    let ub = ((edge1.p2.x - edge1.p1.x) * (edge1.p1.y - edge2.p1.y) - (edge1.p2.y - edge1.p1.y) * (edge1.p1.x - edge2.p1.x)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return undefined;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = edge1.p1.x + ua * (edge1.p2.x - edge1.p1.x);
    let y = edge1.p1.y + ua * (edge1.p2.y - edge1.p1.y);

    return { x, y };
}
