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
            msg: {
                type: "clientSwordAbility",
                originId: this.player.getActorId(),
                abilityType: ability,
                mousePos,
                starting,
            },
        });
    }
}

export interface ClientSwordMessage {
    type: "clientSwordMessage";
    msg: ClientSwordWhirlwindHit | ClientSwordSlashHit | ClientSwordAbility;
}

export interface ClientSwordAbility {
    type: "clientSwordAbility";
    originId: number;
    abilityType: SwordPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}
