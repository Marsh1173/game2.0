import { GlobalObjects } from "../../../client/game";
import { defaultConfig } from "../../../config";
import { ifInside } from "../../../ifInside";
import { ifIntersect } from "../../../ifIntersect";
import { Size } from "../../../size";
import { rotateVector, Shape, Vector } from "../../../vector";
import { Doodad } from "../../terrain/doodads/doodad";
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

    //position solver
    protected readonly previousMomentum: Vector = { x: 0, y: 0 };
    protected readonly previousPosition: Vector = { x: 0, y: 0 };

    constructor(
        protected globalObjects: GlobalObjects,
        protected readonly baseActor: Actor,
        protected readonly position: Vector,
        protected readonly momentum: Vector,
        protected size: Size,
        protected mass: number,
    ) {
        this.previousMomentum.x = this.momentum.x;
        this.previousMomentum.y = this.momentum.y;
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
    }

    public abstract getGlobalShape(): Shape;
    public abstract getCollisionRange(): number;
    public abstract registerGroundAngle(angle: number, standing: boolean): void;

    public checkIfCollidesWithLine(p1: Vector, p2: Vector): boolean {
        let personalShape: Shape = this.getGlobalShape();

        for (let i: number = 0; i < personalShape.edges.length; i++) {
            if (ifIntersect(personalShape.edges[i].p1, personalShape.edges[i].p2, p1, p2)) {
                return true;
            }
        }
        //last check in case the line is inside object
        if (ifInside(p1, personalShape.points)) return true;
        return false;
    }
    public ifInsideLargerShape(largeShape: Vector[]): boolean {
        let personalShape: Shape = this.getGlobalShape();
        for (let i: number = 0; i < personalShape.points.length; i++) {
            if (ifInside(personalShape.points[i], largeShape)) {
                return true;
            }
        }
        return false;
    }
    public ifInsideSmallerShape(smallShape: Vector[]): boolean {
        let personalShape: Shape = this.getGlobalShape();
        for (let i: number = 0; i < smallShape.length; i++) {
            if (ifInside(smallShape[i], personalShape.points)) {
                return true;
            }
        }
        return false;
    }

    protected registerGravity(elapsedTime: number) {
        this.momentum.y += defaultActorConfig.fallingAcceleration * elapsedTime * this.mass;
    }

    protected registerGroundFriction(elapsedTime: number) {
        //if (Math.abs(this.momentum.x) <= 10) this.momentum.x = 0;
        //else this.momentum.x -= elapsedTime * this.mass * (this.momentum.x <= 0 ? -1 : 1) * 600;
        if (this.momentum.x > 0) {
            this.momentum.x -= elapsedTime * this.mass * 600;
            if (this.momentum.x < 0) this.momentum.x = 0;
        } else if (this.momentum.x < 0) {
            this.momentum.x += elapsedTime * this.mass * 600;
            if (this.momentum.x > 0) this.momentum.x = 0;
        }
    }

    protected registerAirResistance(elapsedTime: number) {
        return;
        if (Math.abs(this.momentum.x) <= 3) this.momentum.x = 0;
        else this.momentum.x -= elapsedTime * this.mass * (this.momentum.x <= 0 ? -1 : 1) * 30;

        if (Math.abs(this.momentum.y) <= 3) this.momentum.y = 0;
        else this.momentum.y -= elapsedTime * this.mass * (this.momentum.y <= 0 ? -1 : 1) * 30;
    }

    public registerKnockback(force: Vector) {
        this.momentum.x = (force.x * 3 + this.momentum.x) / 4;
        this.momentum.y = (force.y * 3 + this.momentum.y) / 4;
    }

    protected checkXBoundaryCollision() {
        if (this.position.x - this.size.width / 2 < 0) {
            this.position.x = this.size.width / 2;
            this.momentum.x = Math.max(this.momentum.x, 0);
        } else if (this.position.x + this.size.width / 2 > this.xSize) {
            this.position.x = this.xSize - this.size.width / 2;
            this.momentum.x = Math.min(this.momentum.x, 0);
        }
    }

    protected checkYBoundaryCollision(): boolean {
        if (this.position.y - this.size.height / 2 < 1) {
            this.position.y = this.size.height / 2 + 1;
            this.momentum.y = Math.max(this.momentum.y, 0);
        } else if (this.position.y + this.size.height / 2 > this.ySize) {
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
        let data: { yCoord: number; angle: number } = this.globalObjects.floor.getYCoordAndAngle(this.position.x);
        let feetPos: number = this.position.y + this.size.height / 2;
        let ifHit: boolean = false;
        if (data.yCoord < feetPos) {
            this.position.y = data.yCoord - this.size.height / 2;
            this.momentum.y = Math.min(this.momentum.y, 0);
            ifHit = true;
        }
        return { hit: ifHit, angle: data.angle };
    }

    protected checkDoodads() {
        let actorShape: Shape = this.getGlobalShape();
        this.globalObjects.doodads.forEach((doodad) => {
            this.checkDoodadCollision(actorShape, doodad);
        });
    }

    protected checkDoodadCollision(actorShape: Shape, doodad: Doodad) {
        if (doodad.checkCollisionRange(this.position, this.getCollisionRange())) {
            if (doodad.checkObjectIntersection(actorShape)) {
                let results: { positionChange: Vector; momentumChange: Vector | undefined; angle: number | undefined } =
                    doodad.registerCollisionWithClosestSolution(actorShape, this.momentum);
                this.registerDoodadCollision(results.positionChange, results.momentumChange, results.angle);
            }
        }
    }

    private registerDoodadCollision(positionChange: Vector, momentumChange: Vector | undefined, angle: number | undefined) {
        this.position.x += positionChange.x;
        this.position.y += positionChange.y;
        if (momentumChange) {
            this.momentum.x = momentumChange.x + 0;
            this.momentum.y = momentumChange.y + 0;
        }
        if (angle) {
            this.registerGroundAngle(angle, true);
        }
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

    protected positionUpdate(elapsedTime: number) {
        this.position.x += ((this.momentum.x + this.previousMomentum.x) * elapsedTime) / 2;
        this.position.y += ((this.momentum.y + this.previousMomentum.y) * elapsedTime) / 2;

        this.previousMomentum.x = this.momentum.x;
        this.previousMomentum.y = this.momentum.y;
    }

    protected previousPositionUpdate() {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
    }
}
