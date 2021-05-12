import { Game } from "../../client/game";
import { ClientPlayer } from "../newActors/clientActors/clientPlayer/clientPlayer";
import { Controller } from "./controller";

export class HammerController /*extends Controller*/ {
    constructor(protected player: ClientPlayer, protected game: Game) {
        //super(player, game);
    }
}
