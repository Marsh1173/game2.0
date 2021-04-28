import { findAngle, rotateShape } from "../../../../findAngle";
import { WeaponType } from "../../../../objects/Actors/Players/playerActor";
import { findDistance, Vector } from "../../../../vector";
import { renderShape } from "../../../gameRender/gameRenderer";
import { ClientPlayerActor } from "../clientPlayerActor";
import { ClientModelWeapon } from "./object";

export function genericRenderWeapon(this: ClientModelWeapon, ctx: CanvasRenderingContext2D) {
    if (!this.img) return;
    ctx.save();

    //centers the canvas on the player's position
    ctx.transform(1, 0, 0, 1, this.clientPlayerModel.player.position.x, this.clientPlayerModel.player.position.y);

    //makes the angle local and rotates it
    let angle: number = this.clientPlayerModel.player.focusAngle;
    ctx.rotate(angle);
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        //if the player is facing to the left, flip the image vertically
        ctx.scale(1, -1);
    }

    ctx.rotate(this.weaponRotation + this.originalWeaponRotation);
    //center the canvas on the position of the player's weapon
    ctx.transform(1, 0, 0, 1, this.weaponPosition.x + this.originalWeaponPosition.x, this.weaponPosition.y + this.originalWeaponPosition.y);
    //rotate the canvas with the weapon's rotation
    ctx.rotate(this.imgRotation + this.originalImgRotation);
    //center the image on the weapon position and scale it down
    ctx.transform(this.imgScale, 0, 0, this.imgScale, -this.imgCenter.x, -this.imgCenter.y);

    //finally draw it
    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    ctx.restore();
}

function renderWeaponHitbox(shape: Vector[], position: Vector, angle: number, ctx: CanvasRenderingContext2D) {
    // FOR DEBUGGING
    let newShape: Vector[] = rotateShape(shape, angle, position, true);

    ctx.globalAlpha = 0.3;
    renderShape(ctx, newShape);
    ctx.globalAlpha = 1;
}
