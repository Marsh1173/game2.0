export abstract class Floor {
    constructor(protected pointCount: number, protected resultWidth: number, protected pointsAndAngles: { point: number; angle: number; slope: number }[]) {}

    public getYCoordAndAngle(xPos: number): { yCoord: number; angle: number } {
        let i: number = Math.floor(xPos / this.resultWidth);
        if (i < 0) {
            return { yCoord: this.pointsAndAngles[0].point, angle: this.pointsAndAngles[0].angle };
        } else if (i >= this.pointCount - 1) {
            return {
                yCoord: this.pointsAndAngles[this.pointCount - 1].point,
                angle: this.pointsAndAngles[this.pointCount - 1].angle,
            };
        } else {
            let percentage: number = xPos / this.resultWidth - i;
            return {
                yCoord: this.pointsAndAngles[i].point + this.pointsAndAngles[i].slope * percentage,
                angle: this.pointsAndAngles[i].angle,
            };
        }
    }
}
