import { findAngle } from "../../../findAngle";
import { rootKeepSign, Vector } from "../../../vector";
import { Floor } from "./floor";

export class ServerFloor extends Floor {
    private range: number = 150; // 150
    public startWidth: number = 300; // 300

    private smoothIterations: number = 3; // 3

    constructor(private totalWidth: number, private totalHeight: number) {
        super(0, 0, []);

        let randomPlot: number[] = [];

        for (let i: number = 0; i <= Math.floor(this.totalWidth / this.startWidth); i++) {
            randomPlot.push(this.totalHeight - Math.random() * this.range - 20);
        }

        let tempPoints = this.smoothLine(randomPlot, this.smoothIterations);
        this.pointCount = tempPoints.length - 1;
        this.resultWidth = this.totalWidth / (this.pointCount - 1);

        for (let i: number = 0; i < this.pointCount; i++) {
            this.pointsAndAngles.push({
                point: tempPoints[i],
                angle: findAngle({ x: i * this.resultWidth, y: tempPoints[i] }, { x: (i + 1) * this.resultWidth, y: tempPoints[i + 1] }),
                slope: tempPoints[i + 1] - tempPoints[i],
            });
        }
    }

    private smoothLine(points: number[], iterations: number): number[] {
        let basePlot: number[] = points.map((x) => x);

        for (let i: number = 0; i < iterations; i++) {
            let newPlot: number[] = [];
            newPlot.push(basePlot[0]);

            for (let i2: number = 0; i2 < basePlot.length - 1; i2++) {
                let overallSlope: number = basePlot[i2] - basePlot[i2 + 1];
                newPlot.push(basePlot[i2] - overallSlope * 0.25);
                newPlot.push(basePlot[i2] - overallSlope * 0.75);
            }

            newPlot.push(basePlot[basePlot.length - 1]);

            basePlot = newPlot;
        }

        return basePlot;
    }

    public serialize(): SerializedFloor {
        return {
            pointsAndAngles: this.pointsAndAngles,
            pointCount: this.pointCount,
            resultWidth: this.resultWidth,
        };
    }
}

export interface SerializedFloor {
    pointsAndAngles: { point: number; angle: number; slope: number }[];
    pointCount: number;
    resultWidth: number;
}
