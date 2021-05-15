import { Game } from "../../../client/game";
import { ClientDaggers } from "../../newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { ClientPlayer } from "../../newActors/clientActors/clientPlayer/clientPlayer";
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
            //this.abilityData[0] = new SwordSlashAbility(this.game, this.player, this, 0);
            //this.abilityData[1] = new SwordWhirlWindAbility(this.game, this.player, this, 1);
        }
    }
}
