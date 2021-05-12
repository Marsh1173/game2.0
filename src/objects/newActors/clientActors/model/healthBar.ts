import { LinkedList, Node } from "../../../../linkedList";
import { Size } from "../../../../size";
import { Vector } from "../../../../vector";

export type SideType = "enemy" | "self" | "ally";
const healthDividerWidth: number = 20;
const healthBarDuration: number = 0.15;

export class HealthBarModel {
    protected readonly healthHeight: number = 50;
    protected readonly healthColor: string;
    protected readonly damageEffectColor: string;
    protected readonly healEffectColor: string;

    protected damageEffectBars: LinkedList<{ timer: number; position: number; width: number; height: number }> = new LinkedList();
    protected healEffectBars: LinkedList<{ timer: number; position: number; width: number; height: number }> = new LinkedList();

    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected readonly position: Vector,
        protected readonly healthInfo: { health: number; maxHealth: number },
        protected readonly healthBarSize: Size,
        healthBarType: SideType,
    ) {
        switch (healthBarType) {
            case "enemy":
                this.healthColor = "red";
                this.damageEffectColor = "white";
                this.healEffectColor = "red";
                break;
            case "ally":
                this.healthColor = "white";
                this.damageEffectColor = "red";
                this.healEffectColor = "green";
                break;
            case "self":
                this.healthColor = "#00c746";
                this.damageEffectColor = "white";
                this.healEffectColor = "#00c746";
                break;
            default:
                throw new Error("unknown health bar type in model constructor");
        }
    }

    public renderHealth() {
        this.ctx.transform(1, 0, -0.15, 1, this.position.x + 1, this.position.y - this.healthHeight);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        this.ctx.fillRect(this.healthBarSize.width / -2 - 1, 0, this.healthBarSize.width + 2, this.healthBarSize.height + 2);

        this.ctx.fillStyle = this.healthColor;
        this.ctx.fillRect(this.healthBarSize.width / -2, 1, this.healthBarSize.width * (this.healthInfo.health / this.healthInfo.maxHealth), 6);

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        for (let i: number = 1; i < this.healthInfo.health / healthDividerWidth; i += 1) {
            this.ctx.fillRect(-25 + (48 * healthDividerWidth * i) / this.healthInfo.maxHealth, 1, 2, 6);
        }

        if (!this.damageEffectBars.ifEmpty()) {
            this.ctx.fillStyle = this.damageEffectColor;
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.damageEffectBars.head;
            while (node !== null) {
                this.ctx.globalAlpha = 1 - (healthBarDuration - node.data.timer) * 3;
                this.ctx.fillRect(-25 + node.data.position, 4 - node.data.height / 2, node.data.width, node.data.height);
                node = node.next;
            }
            this.ctx.globalAlpha = 1;
        }

        if (!this.healEffectBars.ifEmpty()) {
            this.ctx.fillStyle = this.healEffectColor;
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.healEffectBars.head;
            while (node !== null) {
                this.ctx.globalAlpha = 0.5 + (healthBarDuration - node.data.timer) * 4;
                this.ctx.fillRect(-25 + node.data.position, 4 - node.data.height / 2, node.data.width, node.data.height);
                node = node.next;
            }
            this.ctx.globalAlpha = 1;
        }

        this.ctx.transform(1, 0, 0.15, 1, 0, 0); // the skew had to be de-transformed procedurally or else the main canvas bugged
        this.ctx.transform(1, 0, 0, 1, -this.position.x - 1, -this.position.y + this.healthHeight);
    }

    public registerDamage(quantity: number) {
        this.damageEffectBars.insertAtEnd({
            timer: healthBarDuration,
            position: (this.healthInfo.health / this.healthInfo.maxHealth) * 48,
            width: (quantity / this.healthInfo.maxHealth) * 48 + 1,
            height: 8,
        });
    }

    public registerHeal(quantity: number) {
        this.healEffectBars.insertAtEnd({
            timer: healthBarDuration,
            position: (this.healthInfo.health / this.healthInfo.maxHealth) * 48,
            width: (quantity / this.healthInfo.maxHealth) * 48 + 1,
            height: 30,
        });
    }

    public update(elapsedTime: number) {
        if (!this.damageEffectBars.ifEmpty()) {
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.damageEffectBars.head;
            while (node !== null) {
                node.data.timer -= elapsedTime;
                node.data.height += elapsedTime * 100;

                if (node.data.timer <= 0) {
                    this.damageEffectBars.deleteFirst();
                    node = this.damageEffectBars.head;
                } else {
                    node = node.next;
                }
            }
        }

        if (!this.healEffectBars.ifEmpty()) {
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.healEffectBars.head;
            while (node !== null) {
                node.data.timer -= elapsedTime;
                node.data.height -= elapsedTime * 100;

                if (node.data.timer <= 0) {
                    this.healEffectBars.deleteFirst();
                    node = this.healEffectBars.head;
                } else {
                    node = node.next;
                }
            }
        }
    }
}
