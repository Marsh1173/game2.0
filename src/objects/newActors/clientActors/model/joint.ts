import { Vector } from "../../../../vector";
import { AnimationInfo } from "./model";

export class Joint {
    protected imgRotationTemp: number = 0;
    protected localPosXTemp: number = 0;
    protected localPosYTemp: number = 0;
    protected angleFromTemp: number = 0;
    protected angleToTemp: number = 0;

    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected readonly img: HTMLImageElement,
        protected readonly imgPos: Vector,
        protected readonly imgScale: number,
        protected readonly imgRotation: number,
        protected readonly localPos: Vector,
        protected readonly angleFrom: number,
        protected readonly angleTo: number,
    ) {}

    public render(timePercent: number, animationInfo: AnimationInfo) {
        if (animationInfo.angleFromEquation) this.angleFromTemp = readArrayForY(animationInfo.angleFromEquation, timePercent);
        this.ctx.rotate(this.angleFrom + this.angleFromTemp);

        if (animationInfo.localPosXEquation) this.localPosXTemp = readArrayForY(animationInfo.localPosXEquation, timePercent);
        if (animationInfo.localPosYEquation) this.localPosYTemp = readArrayForY(animationInfo.localPosYEquation, timePercent);
        this.ctx.translate(this.localPos.x + this.localPosXTemp, this.localPos.y + this.localPosYTemp);

        if (animationInfo.angleToEquation) this.angleToTemp = readArrayForY(animationInfo.angleToEquation, timePercent);
        this.ctx.rotate(this.angleTo + this.angleToTemp);

        if (animationInfo.imgRotationEquation) this.imgRotationTemp = readArrayForY(animationInfo.imgRotationEquation, timePercent);
        this.ctx.rotate(this.imgRotation + this.imgRotationTemp);

        this.ctx.scale(this.imgScale, this.imgScale);
        this.ctx.drawImage(this.img, this.imgPos.x, this.imgPos.y);
        this.ctx.scale(1 / this.imgScale, 1 / this.imgScale);

        this.ctx.rotate(-this.imgRotation - this.imgRotationTemp);

        this.ctx.rotate(-this.angleTo - this.angleToTemp);

        this.ctx.translate(-this.localPos.x - this.localPosXTemp, -this.localPos.y - this.localPosYTemp);

        this.ctx.rotate(-this.angleFrom - this.angleFromTemp);
    }

    public update(elapsedTime: number) {
        this.imgRotationTemp *= 1 - elapsedTime * 5;
        this.localPosXTemp *= 1 - elapsedTime * 5;
        this.localPosYTemp *= 1 - elapsedTime * 5;
        this.angleFromTemp *= 1 - elapsedTime * 5;
        this.angleToTemp *= 1 - elapsedTime * 5;
    }
}

function readArrayForY(data: number[][] | undefined, timePercent: number): number {
    if (data === undefined) return 0;
    let index: number = 0;
    let arrayLength: number = data.length - 1;
    while (true) {
        if (index === arrayLength) return data[index][1];
        else if (data[index + 1][0] >= timePercent) break;
        index++;
    }
    let percent: number = (timePercent - data[index][0]) / (data[index + 1][0] - data[index][0]);
    let keyDifference: number = data[index + 1][1] - data[index][1];
    return data[index][1] + percent * keyDifference;
}
