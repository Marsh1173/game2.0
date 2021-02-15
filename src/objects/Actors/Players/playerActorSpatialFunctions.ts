import { PlayerActor } from "./playerActor";


export function checkPlayerActorCollision(this: PlayerActor, player: PlayerActor, elapsedTime: number) { //  PLAYER SHOULD BE PLAYER ACTOR
    if (this.position.x < player.position.x + this.size.width && this.position.x > player.position.x - this.size.width &&
        this.position.y < player.position.y + this.size.height && this.position.y > player.position.y - this.size.height) {
        if ((player.position.x - this.position.x) > 0) this.momentum.x -= 2000 * elapsedTime;
        else this.momentum.x += 2000 * elapsedTime;
    }
}

export function dampenMomentum(this: PlayerActor, elapsedTime: number) {
    if (Math.abs(this.momentum.x) < 30) {
        this.momentum.x = 0;
    } else if ((this.actionsNextFrame.moveRight === false && this.actionsNextFrame.moveLeft === false) || Math.abs(this.momentum.x) > this.config.maxSidewaysMomentum) {
        if (this.standing) {
            this.momentum.x *= 0.65 ** (elapsedTime * 60);
        } else {
            this.momentum.x *= 0.98 ** (elapsedTime * 60);
        }
    }
}