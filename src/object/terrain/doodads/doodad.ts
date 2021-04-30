import { findAngle } from "../../../findAngle";
import { ifIntersect } from "../../../ifIntersect";
import { DoodadEdge, findDifference, findDistance, findLength, rotateVector, Shape, Vector, vectorProject } from "../../../vector";

const doodadPointInformation: Record<DoodadType, Vector[]> = {
    rockLarge: [
        { x: -182, y: 12 },
        { x: -200, y: -38 },
        { x: -128, y: -105 },
        { x: -10, y: -134 },
        { x: 20, y: -133 },
        { x: 121, y: -80 },
        { x: 193, y: -22 },
        { x: 197, y: 23 },
    ],
};

function findOrthonormalVector(vector1: Vector, vector2: Vector): Vector {
    let magnitude: number = findDistance(vector1, vector2);
    return { x: (vector2.y - vector1.y) / magnitude, y: (vector1.x - vector2.x) / magnitude };
}

export type DoodadType = "rockLarge";

export abstract class Doodad {
    protected readonly points: Vector[] = [];
    protected readonly edges: DoodadEdge[] = [];
    protected collisionRange: number = 0;

    constructor(protected position: Vector, protected readonly rotation: number, protected doodadType: DoodadType) {
        let doodadPoints: Vector[] = doodadPointInformation[doodadType];
        //rotate base shape and store it in this.points
        doodadPoints.forEach((point) => {
            let localPoint: Vector = rotateVector(this.rotation, point);
            this.points.push({ x: localPoint.x + this.position.x, y: localPoint.y + this.position.y });
        });

        //find largest distance between a point and the center
        this.points.forEach((point) => {
            let distance: number = findDistance(this.position, point);
            if (distance > this.collisionRange) this.collisionRange = distance;
        });

        //find all the edges based on the points
        let pointCount: number = this.points.length;

        for (let i: number = 0; i < pointCount; i++) {
            let point1: Vector = this.points[i];
            let point2: Vector = this.points[(i + 1) % pointCount];
            let angle: number = findAngle(point1, point2);

            this.edges.push({
                p1: point1,
                p2: point2,
                angle,
                slope: findDifference(point1, point2),
                isGround: Math.PI / -5 < angle && angle < Math.PI / 5,
                orthogonalVector: findOrthonormalVector(point1, point2),
            });
        }
    }

    public checkCollisionRange(position: Vector, objectCollisionRange: number): boolean {
        //if objects' collision bounds are too close
        return findDistance(this.position, position) <= this.collisionRange + objectCollisionRange;
    }
    public checkObjectIntersection(objectShape: Shape): boolean {
        /*for (let i1: number = 0; i1 < this.edges.length; i1++) {
            let ifPointExistsBehind: boolean = false;
            for (let i2: number = 0; i2 < objectShape.points.length; i2++) {
                if (
                    dotProduct(
                        { x: objectShape.points[i2].x - this.globalPoints[i1].x, y: objectShape.points[i2].y - this.globalPoints[i1].y },
                        rockEdgeOrthonormals[i1],
                    ) <= 0
                )
                    ifPointExistsBehind = true;
            }
            if (!ifPointExistsBehind) return false;
        }
        return true;*/

        //if objects intersect (line intersect <- or ifPointInside method)
        for (let i1: number = 0; i1 < this.edges.length; i1++) {
            for (let i2: number = 0; i2 < objectShape.edges.length; i2++) {
                if (ifIntersect(this.edges[i1].p1, this.edges[i1].p2, objectShape.edges[i2].p1, objectShape.edges[i2].p2)) {
                    return true;
                }
            }
        }
        return false;
    }
    public registerCollision(objectShape: Shape, momentum: Vector): { positionChange: Vector; momentumChange: Vector | undefined; angle: number | undefined } {
        let lowestEdge: DoodadEdge = this.edges[0];
        let lowestDistance: number = 10000;

        this.edges.forEach((doodadEdge) => {
            //for each static object edge,
            let minProjectedDistance: number = 0;

            objectShape.points.forEach((point) => {
                let pointDifference: Vector = findDifference(doodadEdge.p1, point);
                let projection: Vector = vectorProject(pointDifference, doodadEdge.orthogonalVector);

                //calculate the distance to move the object's point with the lowest projection onto the orthogonal line
                if (projection.y * doodadEdge.orthogonalVector.y < 0) {
                    let distance: number = findLength(projection);
                    if (distance > minProjectedDistance) {
                        minProjectedDistance = distance;
                    }
                }
                //save the edge and the biggest distance of the points
            });

            if (minProjectedDistance < lowestDistance) {
                //find the edge with the lowest distance
                lowestDistance = minProjectedDistance;
                lowestEdge = doodadEdge;
            }
        });

        //find the positionChange based on the distance * orthanormal vector
        let positionChange: Vector = {
            x: lowestEdge.orthogonalVector.x * lowestDistance,
            y: lowestEdge.orthogonalVector.y * lowestDistance,
        };

        //find momentum change only if the current momentum has a negative projection onto the orthanormal vector
        let momentumChange: Vector = vectorProject(momentum, lowestEdge.slope);

        //return angle if the edge is a "standing" edge
        let angle: number | undefined = lowestEdge.isGround ? lowestEdge.angle : undefined;
        return { positionChange, momentumChange, angle };
    }
}
