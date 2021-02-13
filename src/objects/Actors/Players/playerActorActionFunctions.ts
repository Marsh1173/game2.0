import { PlayerActor } from "./playerActor";


export function attemptJump(this: PlayerActor) {
    if (this.actorEffects.isDead === 0 && this.alreadyJumped <= 1 && this.momentum.y < this.jumpHeight) this.jump();
}
export function jump(this: PlayerActor) {
    this.momentum.y = -this.jumpHeight;
    this.alreadyJumped++;
}
export function attemptMoveLeft(this: PlayerActor, elapsedTime: number) {
    if (this.actorEffects.isDead === 0 && this.momentum.x > -this.maxSidewaysMomentum) this.moveLeft(elapsedTime);
}
export function moveLeft(this: PlayerActor, elapsedTime: number) {
    if (this.standing) this.momentum.x -= this.standingSidewaysAcceleration * elapsedTime;
    else this.momentum.x -= this.fallingSidewaysAcceleration * elapsedTime;

    if (this.momentum.x < -this.maxSidewaysMomentum) this.momentum.x = -this.maxSidewaysMomentum;
}
export function attemptMoveRight(this: PlayerActor, elapsedTime: number) {
    if (this.actorEffects.isDead === 0 && this.momentum.x < this.maxSidewaysMomentum) this.moveRight(elapsedTime);
}
export function moveRight(this: PlayerActor, elapsedTime: number) {
    if (this.standing) this.momentum.x += this.standingSidewaysAcceleration * elapsedTime;
    else this.momentum.x += this.fallingSidewaysAcceleration * elapsedTime;
    
    if (this.momentum.x > this.maxSidewaysMomentum) this.momentum.x = this.maxSidewaysMomentum;
}