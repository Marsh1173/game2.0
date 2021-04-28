import { Vector } from "../../../../vector";
import { ClientPlayerActor } from "../clientPlayerActor";
import { genericBasicAttack } from "./object";

export function swordBasicAttack(this: ClientPlayerActor, players: ClientPlayerActor[]) {
    if (this.isGamePlayer) {
        const swordDamage: number = 5;
        const swordForce: number = 100;
        const swordBasicAttackShape: Vector[] = [
            { x: 0, y: 0 },
            { x: 20, y: -30 },
            { x: 60, y: -50 },
            { x: 90, y: -20 },
            { x: 75, y: 20 },
            { x: 30, y: 20 },
        ];
        genericBasicAttack(this, players, swordBasicAttackShape, swordDamage, swordForce, this.serverTalker);
    }
    this.clientPlayerModel.clientModelWeapon.setAnimation("attack1");
}
