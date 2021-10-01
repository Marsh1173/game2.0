import { findAngle } from "../../../findAngle";
import { findIntersection, ifIntersect } from "../../../ifIntersect";
import {
    DoodadEdge,
    dotProduct,
    Edge,
    findDifference,
    findDistance,
    findLength,
    findOrthonormalVector,
    rotateVector,
    Shape,
    Vector,
    vectorProject,
} from "../../../vector";

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

export type DoodadType = "rockLarge";

export abstract class Doodad {
    protected readonly points: Vector[] = [];
    protected readonly edges: DoodadEdge[] = [];
    protected collisionRange: number = 0;

    constructor(protected readonly position: Vector, protected readonly rotation: number, protected readonly doodadType: DoodadType) {
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

    public getCollisionRange(): number {
        return this.collisionRange;
    }

    /**
     * Very cheap check if two objects are close enough to touch.
     * @param position Position of the object in question.
     * @param objectCollisionRange Highest possible radius of the object in question.
     * @returns True if the objects are close enough to possibly collide.
     */
    public checkCollisionRange(position: Vector, objectCollisionRange: number): boolean {
        //if objects' collision bounds are too close
        return findDistance(this.position, position) <= this.collisionRange + objectCollisionRange;
    }
    public checkObjectIntersection(objectShape: Shape): boolean {
        //if objects intersect (line intersect -> or ifPointIsBehindEdge method)

        /*This method checks all of this shape's edges to see if any of the object's points fall behind that edge.
        If an edge exists with no points behind it, we can assume the shapes do not collide.
        Otherwise, we know that somewhere the shapes collide.
        This method will not work for concave doodads.*/
        for (let i1: number = 0; i1 < this.edges.length; i1++) {
            let ifPointExistsBehind: boolean = false;
            for (let i2: number = 0; i2 < objectShape.points.length; i2++) {
                if (
                    dotProduct(
                        { x: objectShape.points[i2].x - this.edges[i1].p1.x, y: objectShape.points[i2].y - this.edges[i1].p1.y },
                        this.edges[i1].orthogonalVector,
                    ) <= 0
                )
                    ifPointExistsBehind = true;
            }
            if (!ifPointExistsBehind) return false;
        }
        return true;

        /*for (let i1: number = 0; i1 < this.edges.length; i1++) {
            for (let i2: number = 0; i2 < objectShape.edges.length; i2++) {
                if (ifIntersect(this.edges[i1].p1, this.edges[i1].p2, objectShape.edges[i2].p1, objectShape.edges[i2].p2)) {
                    return true;
                }
            }
        }
        return false;*/
    }
    public registerCollisionWithMostCorrectSolution(
        dynamShape: Shape,
        prevPositionDifference: Vector,
        ctx: CanvasRenderingContext2D,
    ): { positionChange: Vector; momentumChange: Vector | undefined; angle: number | undefined } | undefined {
        /**
         * This algorithm takes the dynamic object's shape and the difference between its current position and its position last frame.
         * We assume the point difference is the "previous momentum."
         * We check if any of the dynamObj's points collided with this object's shape due to it's previous momentum.
         * If so, we find the closest intersection point to the dynamObj's previous position and return it.
         */

        let furthestIntersectionPoint: Vector | undefined = undefined;
        let furthestIntersectionLength: number = 0;

        for (let i: number = 0; i < dynamShape.points.length; i++) {
            for (let j: number = 0; j < this.edges.length; j++) {
                let pointMomentumLineSegment: Edge = {
                    p1: dynamShape.points[i],
                    p2: { x: dynamShape.points[i].x + prevPositionDifference.x, y: dynamShape.points[i].y + prevPositionDifference.y },
                };

                let intersectionPoint: undefined | Vector = findIntersection(this.edges[j], pointMomentumLineSegment);

                if (intersectionPoint) {
                    let intersectionDistanceFromOriginalPoint: number = findLength(intersectionPoint);
                    if (intersectionDistanceFromOriginalPoint > furthestIntersectionLength) {
                        furthestIntersectionLength = intersectionDistanceFromOriginalPoint;
                        furthestIntersectionPoint = intersectionPoint;
                    }
                }
            }
        }

        if (furthestIntersectionPoint) {
            ctx.fillStyle = "red";
            ctx.fillRect(furthestIntersectionPoint.x - 4, furthestIntersectionPoint.y - 4, 8, 8);
        }

        return undefined;
    }

    public registerCollisionWithClosestSolution(
        objectShape: Shape,
        momentum: Vector,
    ): { positionChange: Vector; momentumChange: Vector | undefined; angle: number | undefined } {
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
        let angle: number | undefined = undefined;
        if (lowestEdge.isGround) {
            angle = lowestEdge.angle;
            //and make the positionchange vertical
            positionChange = rotateVector(-lowestEdge.angle, positionChange);
        }

        return { positionChange, momentumChange, angle };
    }
}
