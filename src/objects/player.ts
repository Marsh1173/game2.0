import { Config } from "../config";
import { SerializedPlayer } from "../serialized/player";
import { Size } from "../size";
import { Vector } from "../vector";
import { PlayerActionTypes } from "./Actors/Players/playerActor";
import { Platform } from "./platform";

export abstract class Player {
    private static nextId = 0;
    public static getNextId() {
        return Player.nextId++;
    }

    public readonly actionsNextFrame: Record<PlayerActionTypes, boolean> = {
        jump: false,
        moveLeft: false,
        moveRight: false,
        leftClick: false,
        rightClick: false,
        shift: false,
    };

    constructor(
        public readonly config: Config,
        public id: number,
        public team: number,
        public name: string,
        public position: Vector,
        public momentum: Vector,
        public color: string,
        public alreadyJumped: number,
        public standing: boolean,
        public wasStanding: boolean,
        public isDead: boolean,
        public health: number,
        public focusPosition: Vector, // mouse position
    ) {
    }

    public serialize(): SerializedPlayer {
        return {
            id: this.id,
            team: this.team,
            name: this.name,
            position: this.position,
            momentum: this.momentum,
            color: this.color,
            alreadyJumped: this.alreadyJumped,
            standing: this.standing,
            wasStanding: this.wasStanding,
            isDead: this.isDead,
            health: this.health,
            focusPosition: this.focusPosition,
            //damageMitigation: this.damageMitigation,
        };
    }

    private checkCollisionWithRectangularObject(object: { size: Size; position: Vector }, elapsedTime: number) {
        let futurePosX = this.position.x + this.momentum.x * elapsedTime;
        let futurePosY = this.position.y + this.momentum.y * elapsedTime;
        if (
            futurePosX < object.position.x + object.size.width &&
            futurePosX + this.config.playerSize.width > object.position.x &&
            futurePosY < object.position.y + object.size.height &&
            futurePosY + this.config.playerSize.height > object.position.y
        ) {
            const points: Vector[] = [
                {
                    // above
                    x: this.position.x,
                    y: object.position.y - this.config.playerSize.height,
                },
                {
                    // below
                    x: this.position.x,
                    y: object.position.y + object.size.height,
                },
                {
                    // left
                    x: object.position.x - this.config.playerSize.width,
                    y: this.position.y,
                },
                {
                    // right
                    x: object.position.x + object.size.width,
                    y: this.position.y,
                },
            ];

            const distances = points.map((point) => Math.sqrt((point.x - this.position.x) ** 2 + (point.y - this.position.y) ** 2));

            let smallest = distances[0];
            let smallestIndex = 0;
            distances.forEach((distance, i) => {
                if (distance < smallest) {
                    smallest = distance;
                    smallestIndex = i;
                }
            });

            this.position.x = points[smallestIndex].x;
            this.position.y = points[smallestIndex].y;
            switch (smallestIndex) {
                case 0: // above
                    if (this.momentum.y > 0) this.momentum.y = 0;
                    this.standing = true;
                    break;
                case 1: // below
                    if (this.momentum.y < 0) this.momentum.y = 0;
                    break;
                case 2: // left
                    if (this.momentum.x > 0) this.momentum.x = 0;
                    break;
                case 3: // right
                    if (this.momentum.x < 0) this.momentum.x = 0;
                    break;
            }
        }
    }

    private checkCollisionWithPlayer(object: { size: Size; position: Vector }, elapsedTime: number) {
        let futurePosX = this.position.x + this.momentum.x * elapsedTime;
        let futurePosY = this.position.y + this.momentum.y * elapsedTime;
        if (
            futurePosX < object.position.x + object.size.width &&
            futurePosX + this.config.playerSize.width > object.position.x &&
            futurePosY < object.position.y + object.size.height &&
            futurePosY + this.config.playerSize.height > object.position.y
        ) {
            const xDistance: number = (object.position.x - this.position.x);
            if (xDistance > 0) this.momentum.x -= 40;
            else this.momentum.x += 40;
        }
    }

    private intersects(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number): boolean {
        //checks if line (a, b) -> (c, d) intersects with line (p, q) -> (r, s)
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    };

    public attemptJump() {
        if (!this.isDead && this.alreadyJumped <= 1) this.jump();
    }
    public jump() {
        this.momentum.y = -this.config.playerJumpHeight;// * (this.moveSpeedModifier + 1) / 2;
        this.alreadyJumped++;
    }
    public attemptMoveLeft(elapsedTime: number) {
        if (!this.isDead && this.momentum.x > -this.config.maxSidewaysMomentum) this.moveLeft(elapsedTime);
    }
    public moveLeft(elapsedTime: number) {
        if (this.standing) this.momentum.x -= this.config.standingSidewaysAcceleration * elapsedTime;
        else this.momentum.x -= this.config.nonStandingSidewaysAcceleration * elapsedTime;

        if (this.momentum.x < -this.config.maxSidewaysMomentum) this.momentum.x = -this.config.maxSidewaysMomentum;
    }
    public attemptMoveRight(elapsedTime: number) {
        if (!this.isDead && this.momentum.x < this.config.maxSidewaysMomentum) this.moveRight(elapsedTime);
    }
    public moveRight(elapsedTime: number) {
        if (this.standing) this.momentum.x += this.config.standingSidewaysAcceleration * elapsedTime;
        else this.momentum.x += this.config.nonStandingSidewaysAcceleration * elapsedTime;
        
        if (this.momentum.x > this.config.maxSidewaysMomentum) this.momentum.x = this.config.maxSidewaysMomentum;
    }

    public interact(players: Player[]) {
        this.attemptBasicAttack(players);
    }
    public attemptBasicAttack(players: Player[]) {
        if (!this.isDead) this.basicAttack(players);
    }
    public basicAttack(players: Player[]) {
        console.log(this.id + " attacked");
        //WeaponBasicAttack[this.weaponEquipped](this, players);
    }

    protected broadcastActions() {
        //implemented server-side and client-side
    }

    public update(elapsedTime: number, players: Player[], platforms: Platform[], ifIsPlayerWithId: boolean) {

        if (this.isDead) { // if they're dead, update a few things then return

            return;
        }
        
        // Falling speed
        if (!this.standing) {
            this.momentum.y += this.config.fallingAcceleration * elapsedTime;
        }

        if (ifIsPlayerWithId) this.broadcastActions();

        // Action handling
        if (this.actionsNextFrame.jump) {
            this.attemptJump();
        }
        if (this.actionsNextFrame.moveLeft) {
            this.attemptMoveLeft(elapsedTime);
        }
        if (this.actionsNextFrame.moveRight) {
            this.attemptMoveRight(elapsedTime);
        }
        if (this.actionsNextFrame.leftClick) {
            this.interact(players);
        }

        // Movement dampening
        if (Math.abs(this.momentum.x) < 30) {
            this.momentum.x = 0;
        } else if ((this.actionsNextFrame.moveRight === false && this.actionsNextFrame.moveLeft === false) || Math.abs(this.momentum.x) > this.config.maxSidewaysMomentum) {
            if (this.standing || this.wasStanding) {
                this.momentum.x *= 0.65 ** (elapsedTime * 60);
            } else {
                this.momentum.x *= 0.98 ** (elapsedTime * 60);
            }
        }

        // Set not standing
        if (this.standing === true) {
            this.alreadyJumped = 0;
            this.wasStanding = true;
            this.standing = false;
        } else {
            this.wasStanding = false;
            if (this.alreadyJumped === 0) this.alreadyJumped = 1;
        }

        // Update position based on momentum
        this.position.x += this.momentum.x * elapsedTime;
        this.position.y += this.momentum.y * elapsedTime;

        // Check collision with sides of area
        if (this.position.y < 0) {
            this.position.y = 0;
            this.momentum.y = Math.max(this.momentum.y, 0);
        } else if (this.position.y + this.config.playerSize.height > this.config.ySize) {
            this.position.y = this.config.ySize - this.config.playerSize.height;
            this.momentum.y = Math.min(this.momentum.y, 0);
            this.standing = true;
        }
        if (this.position.x < 0) {
            this.position.x = 0;
            if (this.momentum.x < -this.config.maxSidewaysMomentum / 3) {
                this.momentum.x /= -2;
            } else {
                this.momentum.x = 0;
            }
        } else if (this.position.x + this.config.playerSize.width > this.config.xSize) {
            this.position.x = this.config.xSize - this.config.playerSize.width;
            if (this.momentum.x > this.config.maxSidewaysMomentum / 3) {
                this.momentum.x /= -2;
            } else {
                this.momentum.x = 0;
            }
        }

        platforms.forEach((platform) => {
            this.checkCollisionWithRectangularObject(platform, elapsedTime);
        });

        players.forEach((player2) => {
            if (!player2.isDead &&
                player2.id != this.id) this.checkCollisionWithPlayer({size: this.config.playerSize, position: player2.position}, elapsedTime);
        });

        Object.keys(this.actionsNextFrame).forEach((key) => (this.actionsNextFrame[key as PlayerActionTypes] = false));
    }
}
