import { Vector } from "./vector";

//returns true if point is inside the shape. Doesn't work reliably if the point lies on an edge or corner, but those are rare cases.
export function ifInside(point: Vector, shape: Vector[]): boolean {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point.x + 0,
        y = point.y + 0;

    var inside = false;
    for (var i = 0, j = shape.length - 1; i < shape.length; j = i++) {
        var xi = shape[i].x + 0,
            yi = shape[i].y + 0;
        var xj = shape[j].x + 0,
            yj = shape[j].y + 0;

        var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}
