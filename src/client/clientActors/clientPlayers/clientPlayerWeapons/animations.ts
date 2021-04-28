import { findAngle } from "../../../../findAngle";
import { ClientModelWeapon, TargetImgRotation, TargetWeaponPosition, TargetWeaponRotation, WeaponAnimation } from "./object";

export function genericIdleUpdate(this: ClientModelWeapon, elapsedTime: number) {
    if (this.imgRotation !== 0) {
        this.imgRotation += -this.imgRotation * elapsedTime * 10;
        if (this.imgRotation < 0.02 && this.imgRotation > -0.02) {
            this.imgRotation = 0;
        }
    }
    if (this.weaponRotation !== 0) {
        this.weaponRotation += -this.weaponRotation * elapsedTime * 10;
        if (this.weaponRotation < 0.02 && this.weaponRotation > -0.02) {
            this.weaponRotation = 0;
        }
    }
    if (this.weaponPosition.x !== 0 || this.weaponPosition.y !== 0) {
        let angle: number = findAngle(this.weaponPosition, { x: 0, y: 0 });

        this.weaponPosition.x += 2 * Math.cos(angle);
        this.weaponPosition.y += 2 * Math.sin(angle);

        if (this.weaponPosition.x < 2 && this.weaponPosition.x > -2) {
            this.weaponPosition.x = 0;
        }
        if (this.weaponPosition.y < 2 && this.weaponPosition.y > -2) {
            this.weaponPosition.y = 0;
        }
    }
}

export function updateAnimation(this: ClientModelWeapon, animation: WeaponAnimation, elapsedTime: number) {
    this.animationFrame += elapsedTime;

    this.updateImgRotationToKey(animation.imgRotation);
    this.updateWeaponRotationToKey(animation.weaponRotation);
    this.updateWeaponPositionToKey(animation.weaponPosition);

    if (this.animationFrame >= animation.duration) {
        this.setAnimation(animation.consecutiveState);
    }
}

export function updateImgRotationToKey(this: ClientModelWeapon, imgRotationArray: TargetImgRotation[]) {
    if (this.imgRotationIndex + 1 < imgRotationArray.length && this.animationFrame >= imgRotationArray[this.imgRotationIndex + 1].time) {
        this.imgRotationIndex++;
    }
    if (this.imgRotationIndex + 1 < imgRotationArray.length) {
        // if there are still more keys to come
        let percentage: number =
            (this.animationFrame - imgRotationArray[this.imgRotationIndex].time) /
            (imgRotationArray[this.imgRotationIndex + 1].time - imgRotationArray[this.imgRotationIndex].time);
        this.imgRotation =
            imgRotationArray[this.imgRotationIndex].target +
            (imgRotationArray[this.imgRotationIndex + 1].target - imgRotationArray[this.imgRotationIndex].target) * percentage;
    } else {
        this.imgRotation = imgRotationArray[this.imgRotationIndex].target;
    }
}
export function updateWeaponRotationToKey(this: ClientModelWeapon, weaponRotationArray: TargetWeaponRotation[]) {
    if (this.weaponRotationIndex + 1 < weaponRotationArray.length && this.animationFrame >= weaponRotationArray[this.weaponRotationIndex + 1].time) {
        this.weaponRotationIndex++;
    }
    if (this.weaponRotationIndex + 1 < weaponRotationArray.length) {
        // if there are still more keys to come
        let percentage: number =
            (this.animationFrame - weaponRotationArray[this.weaponRotationIndex].time) /
            (weaponRotationArray[this.weaponRotationIndex + 1].time - weaponRotationArray[this.weaponRotationIndex].time);
        this.weaponRotation =
            weaponRotationArray[this.weaponRotationIndex].target +
            (weaponRotationArray[this.weaponRotationIndex + 1].target - weaponRotationArray[this.weaponRotationIndex].target) * percentage;
    } else {
        this.weaponRotation = weaponRotationArray[this.weaponRotationIndex].target;
    }
}
export function updateWeaponPositionToKey(this: ClientModelWeapon, weaponPositionArray: TargetWeaponPosition[]) {
    if (this.weaponPositionIndex + 1 < weaponPositionArray.length && this.animationFrame >= weaponPositionArray[this.weaponPositionIndex + 1].time) {
        this.weaponPositionIndex++;
    }
    if (this.weaponPositionIndex + 1 < weaponPositionArray.length) {
        // if there are still more keys to come
        let percentage: number =
            (this.animationFrame - weaponPositionArray[this.weaponPositionIndex].time) /
            (weaponPositionArray[this.weaponPositionIndex + 1].time - weaponPositionArray[this.weaponPositionIndex].time);
        this.weaponPosition.x =
            weaponPositionArray[this.weaponPositionIndex].target.x +
            (weaponPositionArray[this.weaponPositionIndex + 1].target.x - weaponPositionArray[this.weaponPositionIndex].target.x) * percentage;
        this.weaponPosition.y =
            weaponPositionArray[this.weaponPositionIndex].target.y +
            (weaponPositionArray[this.weaponPositionIndex + 1].target.y - weaponPositionArray[this.weaponPositionIndex].target.y) * percentage;
    } else {
        this.weaponPosition.x = weaponPositionArray[this.weaponPositionIndex].target.x + 0;
        this.weaponPosition.y = weaponPositionArray[this.weaponPositionIndex].target.y + 0;
    }
}

export const attack1Animation: WeaponAnimation = {
    duration: 0.6,
    consecutiveState: "idle",
    imgRotation: [
        { time: 0, target: 0 },
        { time: 0.05, target: -0.5 },
        { time: 0.2, target: 1.5 },
        { time: 0.3, target: 1.1 },
        { time: 0.6, target: 0.6 },
    ],
    weaponPosition: [
        { time: 0, target: { x: 0, y: 0 } },
        { time: 0.05, target: { x: 25, y: 0 } },
        { time: 0.2, target: { x: -10, y: 0 } },
        { time: 0.3, target: { x: -15, y: 0 } },
        { time: 0.6, target: { x: -20, y: 0 } },
    ],
    weaponRotation: [
        { time: 0, target: 0 },
        { time: 0.05, target: -0.5 },
        { time: 0.2, target: 1.8 },
        { time: 0.3, target: 2 },
        { time: 0.6, target: 2.3 },
    ],
};
export const attack2Animation: WeaponAnimation = {
    duration: 0.3,
    consecutiveState: "idle",
    imgRotation: [
        { time: 0, target: 0.6 },
        { time: 0.05, target: 2 },
        { time: 0.2, target: 1.5 },
        { time: 0.3, target: 1 },
    ],
    weaponPosition: [
        { time: 0, target: { x: -15, y: 0 } },
        { time: 0.05, target: { x: 0, y: 0 } },
        { time: 0.2, target: { x: 10, y: 0 } },
        { time: 0.3, target: { x: -5, y: 0 } },
    ],
    weaponRotation: [
        { time: 0, target: 2.1 },
        { time: 0.05, target: 1.9 },
        { time: 0.2, target: -1.5 },
        { time: 0.3, target: -1.7 },
    ],
};
