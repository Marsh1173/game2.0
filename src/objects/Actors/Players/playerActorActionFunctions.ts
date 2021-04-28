import { PlayerActor } from "./playerActor";

export function attemptJump(this: PlayerActor) {
    if (this.checkIfAlive() && this.alreadyJumped <= 1 && this.momentum.y < this.jumpHeight) this.jump();
}
export function jump(this: PlayerActor) {
    this.momentum.y = -this.jumpHeight;
    this.alreadyJumped++;
}
export function attemptMoveLeft(this: PlayerActor, elapsedTime: number) {
    if (this.checkIfAlive() && this.momentum.x > -this.maxSidewaysMomentum) this.moveLeft(elapsedTime);
}
export function moveLeft(this: PlayerActor, elapsedTime: number) {
    if (this.standing) this.momentum.x -= this.standingSidewaysAcceleration * elapsedTime;
    else this.momentum.x -= this.fallingSidewaysAcceleration * elapsedTime;

    if (this.momentum.x < -this.maxSidewaysMomentum) this.momentum.x = -this.maxSidewaysMomentum;
}
export function attemptMoveRight(this: PlayerActor, elapsedTime: number) {
    if (this.checkIfAlive() && this.momentum.x < this.maxSidewaysMomentum) this.moveRight(elapsedTime);
}
export function moveRight(this: PlayerActor, elapsedTime: number) {
    if (this.standing) this.momentum.x += this.standingSidewaysAcceleration * elapsedTime;
    else this.momentum.x += this.fallingSidewaysAcceleration * elapsedTime;

    if (this.momentum.x > this.maxSidewaysMomentum) this.momentum.x = this.maxSidewaysMomentum;
}
export function attemptLeftClick(this: PlayerActor, players: PlayerActor[]) {
    if (this.checkIfAlive()) this.leftClick(players);
}
/*export function leftClick(this: PlayerActor, lavaFlies: LavaFly[]) {
}*/

export function performActions(this: PlayerActor, elapsedTime: number, players: PlayerActor[]) {
    if (this.actionsNextFrame.jump) {
        this.attemptJump();
        this.actionsNextFrame.jump = false;
    }
    if (this.actionsNextFrame.moveLeft) {
        this.attemptMoveLeft(elapsedTime);
    }
    if (this.actionsNextFrame.moveRight) {
        this.attemptMoveRight(elapsedTime);
    }
    if (this.actionsNextFrame.leftClick) {
        this.attemptLeftClick(players);
        this.actionsNextFrame.leftClick = false;
    }
}
