import { Game } from "../../../client/game";
import { Vector } from "../../../vector";
import { ClientHammer, HammerPlayerAbility } from "../../newActors/clientActors/clientPlayer/clientClasses/clientHammer";
import { ClientPlayer } from "../../newActors/clientActors/clientPlayer/clientPlayer";
import { HammerPoundAbility } from "./abilities/hammerAbilities/hammerPoundAbility";
import { ClientHammerSwingHit, HammerSwingAbility } from "./abilities/hammerAbilities/hammerSwingAbility";
import { Controller } from "./controller";

export class HammerController extends Controller {
    constructor(protected game: Game, protected player: ClientHammer) {
        super(game, player);
    }

    protected setAbilities() {
        switch (this.player.getSpec()) {
            default:
                this.abilityData[0] = new HammerSwingAbility(this.game, this.player, this, 0);
                this.abilityData[1] = new HammerPoundAbility(this.game, this.player, this, 1);
        }
    }

    public sendServerHammerAbility(ability: HammerPlayerAbility, starting: boolean, mousePos: Vector) {
        this.game.serverTalker.sendMessage({
            type: "clientHammerMessage",
            originId: this.player.getActorId(),
            position: this.player.position,
            momentum: this.player.momentum,
            msg: {
                type: "clientHammerAbility",
                abilityType: ability,
                mousePos,
                starting,
            },
        });
    }
}

export interface ClientHammerMessage {
    type: "clientHammerMessage";
    originId: number;
    position: Vector;
    momentum: Vector;
    msg: ClientHammerAbility | ClientHammerSwingHit;
}

export interface ClientHammerAbility {
    type: "clientHammerAbility";
    abilityType: HammerPlayerAbility;
    mousePos: Vector;
    starting: boolean;
}
