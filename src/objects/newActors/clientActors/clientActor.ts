import { Game, GlobalClientActors } from "../../../client/game";
import { Vector } from "../../../vector";
import { ClientFloor } from "../../terrain/floor/clientFloor";
import { Actor, ActorType } from "../actor";
import { TranslationName } from "../actorObjects/translations";
import { Model } from "./models/model";

export abstract class ClientActor extends Actor {
    protected abstract model: Model;
    protected globalActors: GlobalClientActors;
    protected lastHitByActor: ClientActor;

    constructor(protected game: Game, actorType: ActorType, id: number, position: Vector, momentum: Vector, healthInfo: { health: number; maxHealth: number }) {
        super(actorType, id, position, momentum, healthInfo);
        this.globalActors = this.game.getGlobalActors();
        this.lastHitByActor = this;
    }

    public render() {
        this.model.render();
    }
    public renderHealth() {
        this.model.renderHealth();
    }

    public updatePositionAndMomentumFromServer(position: Vector, momentum: Vector) {
        this.model.processPositionUpdateDifference({ x: position.x - this.position.x, y: position.y - this.position.y });

        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.momentum.x = momentum.x + 0;
        this.momentum.y = momentum.y + 0;
    }

    public registerDamage(
        originActor: Actor,
        newHealth: number,
        knockback: Vector | undefined,
        translationData: { name: TranslationName; angle: number } | undefined,
    ): boolean {
        this.model.registerDamage(newHealth - this.healthInfo.health);
        originActor.registerDamageDone(newHealth - this.healthInfo.health);

        if (translationData) this.actorObject.startTranslation(translationData.angle, translationData.name);
        if (knockback) this.actorObject.registerKnockback(knockback);

        this.healthInfo.health = newHealth + 0;
        return false;
    }

    public registerHeal(newHealth: number): void {
        this.model.registerHeal(newHealth - this.healthInfo.health);
        this.healthInfo.health = newHealth + 0;
    }
}
