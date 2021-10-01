import { Game } from "../../../client/game";
import { Vector } from "../../../vector";
import { ClientDaggers, DaggersPlayerAbility } from "../../newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { ClientPlayer } from "../../newActors/clientActors/clientPlayer/clientPlayer";
import { DaggersLungeAbility } from "./abilities/daggersAbilities/daggersLungeAbility";
import { ClientDaggersStabHit, DaggersStabAbility } from "./abilities/daggersAbilities/daggersStabAbility";
import { SwordSlashAbility } from "./abilities/swordAbilities/swordSlashAbility";
import { SwordWhirlWindAbility } from "./abilities/swordAbilities/swordWhirlwindAbility";
import { Controller } from "./controller";

export class DaggersController extends Controller {
    constructor(protected game: Game, protected player: ClientDaggers) {
        super(game, player);
    }

    protected setAbilities() {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new DaggersStabAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new DaggersLungeAbility(this.game, this.player, this, 1);
        }
    }

    public sendServerDaggersAbility(ability: DaggersPlayerAbility, starting: boolean, mousePos: Vector) {
        this.game.serverTalker.sendMessage({
            type: "clientDaggersMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientDaggersAbility",
                abilityType: ability,
                mousePos,
                starting,
            },
        });
    }
}

export interface ClientDaggersMessage {
    type: "clientDaggersMessage";
    originId: number;
    position: Vector;
    momentum: Vector;
    msg: ClientDaggersAbility | ClientDaggersStabHit;
}

export interface ClientDaggersAbility {
    type: "clientDaggersAbility";
    abilityType: DaggersPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}
