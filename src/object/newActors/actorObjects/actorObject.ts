import { defaultConfig } from "../../../config";
import { Size } from "../../../size";
import { rotateVector, Vector } from "../../../vector";
import { Floor } from "../../terrain/floor/floor";
import { Actor } from "../actor";
import { defaultActorConfig } from "../actorConfig";
import { TranslationData, TranslationName, Translation, translations, rotateKey } from "./translations";

export abstract class ActorObject {
    protected xSize: number = defaultConfig.xSize;
    protected ySize: number = defaultConfig.ySize;

    //rectangle vector
    //platform vector
    //floor pointer

    private translationData: TranslationData = {
        translateInfo: undefined,
        keyIndex: 0,
        originalPosition: { x: 0, y: 0 },
        counter: 0,
        keyTimeLength: 0,
        angle: 0,
    };

    constructor(
        protected baseActor: Actor,
        protected position: Vector,
        protected momentum: Vector,
        protected size: Size,
        protected mass: number,
        protected floor: Floor,
    ) {}

    protected registerGravity(elapsedTime: number) {
        this.momentum.y += defaultActorConfig.fallingAcceleration * elapsedTime * this.mass;
    }

    protected registerGroundFriction(elapsedTime: number) {
        if (Math.abs(this.momentum.x) <= 100) this.momentum.x = 0;
        else this.momentum.x -= elapsedTime * this.mass * (this.momentum.x <= 0 ? -1 : 1) * 600;
    }

    protected registerAirResistance(elapsedTime: number) {
        this.momentum.x *= Math.pow(0.9, elapsedTime * this.mass);
        this.momentum.y *= Math.pow(0.9, elapsedTime * this.mass);
    }

    protected checkXBoundaryCollision(elapsedTime: number) {
        let futureXPos: number = this.position.x + this.momentum.x * elapsedTime;

        if (futureXPos - this.size.width / 2 < 0) {
            this.position.x = this.size.width / 2;
            this.momentum.x = Math.max(this.momentum.x, 0);
        } else if (futureXPos + this.size.width / 2 > this.xSize) {
            this.position.x = this.xSize - this.size.width / 2;
            this.momentum.x = Math.min(this.momentum.x, 0);
        }
    }

    protected checkYBoundaryCollision(elapsedTime: number): boolean {
        let futureYPos: number = this.position.y + this.momentum.y * elapsedTime;

        if (futureYPos - this.size.height / 2 < 1) {
            this.position.y = this.size.height / 2 + 1;
            this.momentum.y = Math.max(this.momentum.y, 0);
        } else if (futureYPos + this.size.height / 2 > this.ySize) {
            this.position.y = this.ySize - this.size.height / 2;
            this.momentum.y = Math.min(this.momentum.y, 0);
            return true;
        }
        return false;
    }

    protected checkRectangles(elapsedTime: number) {
        //for each rectangle, check rectangle collision IF no translation or translation allows it
    }

    private checkRectangleCollision(elapsedTime: number) {}

    protected checkPlatforms(elapsedTime: number) {
        //for each platform, check platform collision IF no translation or translation allows it
    }

    private checkPlatformCollision(elapsedTime: number) {}

    protected checkGroundCollision(elapsedTime: number): { hit: boolean; angle: number } {
        let data: { yCoord: number; angle: number } = this.floor.getYCoordAndAngle(this.position.x);
        let feetPos: number = this.position.y + this.size.height / 2;
        let ifHit: boolean = false;
        if (data.yCoord < feetPos) {
            this.position.y = data.yCoord - this.size.height / 2;
            this.momentum.y = Math.min(this.momentum.y, 0);
            ifHit = true;
        }
        return { hit: ifHit, angle: data.angle };
    }

    public startTranslation(angle: number, translationName: TranslationName) {
        this.translationData.originalPosition.x = this.position.x + 0;
        this.translationData.originalPosition.y = this.position.y + 0;

        let newTranslation: Translation = translations[translationName];

        this.translationData.translateInfo = {
            keys: newTranslation.keys.map((x) => rotateKey(x, angle, newTranslation.flipAcrossY)),
            flipAcrossY: newTranslation.flipAcrossY,
            ignoreCollision: newTranslation.ignoreCollision,
            ignoreGravity: newTranslation.ignoreGravity,
        };

        this.translationData.keyIndex = 0;
        this.translationData.counter = 0;

        this.translationData.keyTimeLength = 0;
        this.translationData.translateInfo.keys.forEach((key) => {
            this.translationData.keyTimeLength += key.time;
        });
    }

    protected updateTranslation(elapsedTime: number) {
        if (this.translationData.translateInfo !== undefined) {
            this.translationData.counter += elapsedTime;

            if (this.translationData.counter >= this.translationData.translateInfo.keys[this.translationData.keyIndex].time) {
                //this.position.x = this.translationData.originalPosition.x + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.x;
                //this.position.y = this.translationData.originalPosition.y + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.y;

                this.translationData.keyIndex++;
                this.translationData.counter = 0;

                this.translationData.originalPosition.x = this.position.x + 0;
                this.translationData.originalPosition.y = this.position.y + 0;

                if (this.translationData.keyIndex === this.translationData.translateInfo.keys.length) {
                    this.endTranslation();
                    return;
                }
            }

            let runPercentage: number = this.translationData.counter / this.translationData.translateInfo.keys[this.translationData.keyIndex].time;

            let newPosition: Vector = {
                x: this.translationData.originalPosition.x + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.x * runPercentage,
                y: this.translationData.originalPosition.y + this.translationData.translateInfo.keys[this.translationData.keyIndex].pos.y * runPercentage,
            };

            this.momentum.x = (newPosition.x - this.position.x) / elapsedTime;
            if (this.translationData.translateInfo.ignoreGravity) {
                this.momentum.y = (newPosition.y - this.position.y) / elapsedTime;
            } else {
                this.momentum.y = ((newPosition.y - this.position.y) / elapsedTime + this.momentum.y) / 2;
            }
        }
    }

    protected endTranslation() {
        this.translationData.translateInfo = undefined;
    }

    protected finalPositionUpdate(elapsedTime: number) {
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;
    }
}
