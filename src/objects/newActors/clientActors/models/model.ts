import e = require("express");
import { textSpanIntersectsWithTextSpan } from "typescript";
import { LinkedList, Node } from "../../../../linkedList";
import { Vector } from "../../../../vector";

export type HealthBarType = "enemy" | "self" | "ally";
const healthDividerWidth: number = 20;
const damageBarDuration: number = 0.15;

export abstract class Model {
    protected targetPosition: Vector = { x: 0, y: 0 };
    protected readonly healthHeight: number = 50;
    public health: number = 150;
    protected readonly maxHealth: number = 150;
    protected readonly healthColor: string;
    protected readonly damageEffectColor: string;

    protected damageEffectBars: LinkedList<{ timer: number; position: number; width: number; height: number }> = new LinkedList();

    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected readonly position: Vector,
        protected readonly momentum: Vector,
        healthBarType: HealthBarType,
    ) {
        switch (healthBarType) {
            case "enemy":
                this.healthColor = "red";
                this.damageEffectColor = "white";
                break;
            case "ally":
                this.healthColor = "white";
                this.damageEffectColor = "red";
                break;
            case "self":
                this.healthColor = "#00c746";
                this.damageEffectColor = "red";
                break;
            default:
                throw new Error("unknown health bar type in model constructor");
        }
    }

    public abstract render(): void;
    public renderHealth() {
        this.ctx.transform(1, 0, -0.15, 1, this.position.x + 1, this.position.y - this.healthHeight);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        this.ctx.fillRect(-25, 0, 50, 8);

        this.ctx.fillStyle = this.healthColor;
        this.ctx.fillRect(-24, 1, 48 * (this.health / this.maxHealth), 6);

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.562)";
        for (let i: number = 1; i < this.health / healthDividerWidth; i += 1) {
            this.ctx.fillRect(-25 + (48 * healthDividerWidth * i) / this.maxHealth, 1, 2, 6);
        }

        if (!this.damageEffectBars.ifEmpty()) {
            this.ctx.fillStyle = this.damageEffectColor;
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.damageEffectBars.head;
            while (node !== null) {
                this.ctx.globalAlpha = 1 - (damageBarDuration - node.data.timer) * 2;
                this.ctx.fillRect(-25 + node.data.position, 4 - node.data.height / 2, node.data.width, node.data.height);
                node = node.next;
            }
            this.ctx.globalAlpha = 1;
        }

        //this.health = Math.min(this.health + 0.2, this.maxHealth);
        if (this.health < 0) {
            this.health = this.maxHealth + 0;
        }

        this.ctx.transform(1, 0, 0.15, 1, 0, 0); // the skew had to be de-transformed procedurally or else the main canvas bugged
        this.ctx.transform(1, 0, 0, 1, -this.position.x - 1, -this.position.y + this.healthHeight);
    }

    public registerDamage(quantity: number) {
        this.damageEffectBars.insertAtEnd({
            timer: damageBarDuration,
            position: (this.health / this.maxHealth) * 48,
            width: (quantity / this.maxHealth) * 48 + 1,
            height: 6,
        });
    }

    protected renderMomentum() {
        // FOR DBUGGING ONLY
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "red";

        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(this.position.x + this.momentum.x / 10, this.position.y + this.momentum.y / 10);
        this.ctx.stroke();
    }

    public processPositionUpdateDifference(posDifference: Vector) {
        this.targetPosition.x = posDifference.x + 0;
        this.targetPosition.y = posDifference.y + 0;
    }

    public updateModel(elapsedTime: number) {
        if (!this.damageEffectBars.ifEmpty()) {
            var node: Node<{ timer: number; position: number; width: number; height: number }> | null = this.damageEffectBars.head;
            while (node !== null) {
                node.data.timer -= elapsedTime;
                node.data.height += elapsedTime * 120;

                if (node.data.timer <= 0) {
                    this.damageEffectBars.deleteFirst();
                    node = this.damageEffectBars.head;
                } else {
                    node = node.next;
                }
            }
        }

        if (this.targetPosition.x !== 0 || this.targetPosition.y !== 0) {
            if (this.targetPosition.x > 3) {
                this.targetPosition.x -= 10 * elapsedTime;
            } else if (this.targetPosition.x < -3) {
                this.targetPosition.x += 10 * elapsedTime;
            } else {
                this.targetPosition.x = 0;
            }

            if (this.targetPosition.y > 3) {
                this.targetPosition.y -= 10 * elapsedTime;
            } else if (this.targetPosition.y < -3) {
                this.targetPosition.y += 10 * elapsedTime;
            } else {
                this.targetPosition.y = 0;
            }
        }
    }
}
