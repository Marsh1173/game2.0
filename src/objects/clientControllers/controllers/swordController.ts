import { Game } from "../../../client/game";
import { Vector } from "../../../vector";
import { ClientDaggers } from "../../newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { ClientSword, SwordPlayerAbility } from "../../newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { ClientPlayer } from "../../newActors/clientActors/clientPlayer/clientPlayer";
import { ClientSwordSlashHit, SwordSlashAbility } from "./abilities/swordAbilities/swordSlashAbility";
import { ClientSwordWhirlwindHit, SwordWhirlWindAbility } from "./abilities/swordAbilities/swordWhirlwindAbility";
import { Controller } from "./controller";

export class SwordController extends Controller {
    constructor(protected game: Game, protected player: ClientSword) {
        super(game, player);
    }

    protected setAbilities() {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new SwordSlashAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new SwordWhirlWindAbility(this.game, this.player, this, 1);
        }
    }

    public sendServerSwordAbility(ability: SwordPlayerAbility, starting: boolean, mousePos: Vector) {
        this.game.serverTalker.sendMessage({
            type: "clientSwordMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientSwordAbility",
                abilityType: ability,
                mousePos,
                starting,
            },
        });
    }
}

export interface ClientSwordMessage {
    type: "clientSwordMessage";
    originId: number;
    position: Vector;
    momentum: Vector;
    msg: ClientSwordWhirlwindHit | ClientSwordSlashHit | ClientSwordAbility;
}

export interface ClientSwordAbility {
    type: "clientSwordAbility";
    abilityType: SwordPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}
