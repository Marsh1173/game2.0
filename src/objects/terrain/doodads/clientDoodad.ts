import { assetManager } from "../../../client/gameRender/assetmanager";
import { Size } from "../../../size";
import { Vector } from "../../../vector";
import { Doodad, DoodadType } from "./doodad";

export class ClientDoodad extends Doodad {
    protected readonly img: HTMLImageElement = assetManager.images[this.doodadType];

    constructor(position: Vector, rotation: number, doodadType: DoodadType, protected readonly ctx: CanvasRenderingContext2D) {
        super(position, rotation, doodadType);
    }

    public ifShouldRender(screenSize: Size, screenPos: Vector): boolean {
        if (this.position.x + this.collisionRange >= -screenPos.x && this.position.x - this.collisionRange <= -screenPos.x + screenSize.width) {
            return true;
            /*if (this.position.y + this.collisionRange >= screenPos.y && this.position.y - this.collisionRange <= screenPos.y + screenSize.height) {
            }*/ //only necessary if we add a y-dimension to the game.
        }
        return false;
    }

    public render() {
        this.ctx.translate(Math.floor(this.position.x), Math.floor(this.position.y));
        this.ctx.rotate(this.rotation);
        this.ctx.drawImage(this.img, -200, -140);
        this.ctx.rotate(-this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);

        //this.renderPoints();
        //this.renderEdges(false);
        //this.renderOrthonormals();
    }

    public renderPoints() {
        this.ctx.fillStyle = "red";
        this.points.forEach((point) => {
            this.ctx.fillRect(point.x - 5, point.y - 5, 10, 10);
        });
    }

    public renderOrthonormals() {
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.edges.forEach((edge) => {
            this.ctx.beginPath();
            this.ctx.moveTo((edge.p1.x + edge.p2.x) / 2, (edge.p1.y + edge.p2.y) / 2);
            this.ctx.lineTo((edge.p1.x + edge.p2.x) / 2 + edge.orthogonalVector.x * 10, (edge.p1.y + edge.p2.y) / 2 + edge.orthogonalVector.y * 10);
            this.ctx.stroke();
        });
    }
    public renderEdges(activate: boolean) {
        this.ctx.lineWidth = 2;
        this.edges.forEach((edge) => {
            if (activate) {
                this.ctx.strokeStyle = "red";
            } else if (edge.isGround) {
                this.ctx.strokeStyle = "blue";
            } else {
                this.ctx.strokeStyle = "red";
            }
            this.ctx.beginPath();
            this.ctx.moveTo(edge.p1.x, edge.p1.y);
            this.ctx.lineTo(edge.p2.x, edge.p2.y);
            this.ctx.stroke();
        });
    }
}
