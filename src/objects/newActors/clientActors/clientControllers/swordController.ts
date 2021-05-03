import { Game } from "../../../../client/game";
import { ClientPlayer } from "../clientPlayer/clientPlayer";
import { Controller } from "./controller";

export class SwordController extends Controller {
    constructor(protected player: ClientPlayer, protected game: Game) {
        super(player, game);
    }
}
