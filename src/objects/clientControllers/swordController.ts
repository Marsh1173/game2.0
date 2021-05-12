import { Game } from "../../client/game";
import { Vector } from "../../vector";
import { ClientSword } from "../newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { ClientPlayer } from "../newActors/clientActors/clientPlayer/clientPlayer";

//use instanceof in the game controller constructor
//improve findPlayer in Game constructor?

export class SwordController {
    constructor(protected player: ClientSword, protected game: Game) {
        //super(player, game);
    }

    /*protected setAbilities() {
        let spec = this.player.getSpec();
        this.setSwordAbilityStatus(3, "unavailable");
        this.setSwordAbilityStatus(2, "unavailable");
        if (spec === 0) {
            this.setSwordAbilityStatus(0, "slash");
            this.setSwordAbilityStatus(1, "whirlwind");
        } else if (spec === 1) {
            // Monk
            throw new Error("dude why are you a monk");
        } else if (spec === 2) {
            // Assassin
            throw new Error("dude why are you an assassin");
        }
    }*/
}
