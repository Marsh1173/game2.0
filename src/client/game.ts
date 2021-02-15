import { AllInfo } from "../api/allinfo";
import { ServerMessage } from "../api/message";
import { Config } from "../config";
import { Vector } from "../vector";
import { ClientPlatform } from "./platform";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";
import { createTextChangeRange, moveEmitHelpers } from "typescript";
import { LavaFly } from "../objects/Actors/Mobs/airMob/lavaFly";
import { ClientLavaFly } from "./clientActors/clientMobs/clientAirMobs/clientLavaFly";
import { renderActors } from "./clientActors/renderActors";
import { getNextActorId } from "../objects/Actors/actor";
import { ClientPlayerActor } from "./clientActors/clientPlayers/clientPlayerActor";
import { PlayerActor } from "../objects/Actors/Players/playerActor";
import { onKeyDown, onKeyUp, onMouseDown, onMouseUp } from "./clientActors/clientPlayers/ClientPlayerActorActionFunctions";

export class Game {

    
    private static readonly menuDiv = safeGetElementById("menuDiv");
    private static readonly gameDiv = safeGetElementById("gameDiv");
    private static readonly canvas = safeGetElementById("canvas") as HTMLCanvasElement;
    public static readonly ctx = Game.canvas.getContext("2d")!; // should be private, I changed to public for testing purposes
    private slideContainer = safeGetElementById("slideContainer");
    
    protected gamePlayer: ClientPlayerActor;

    private playerActors: ClientPlayerActor[] = [];
    private platforms: ClientPlatform[] = [];
    private lavaFlies: ClientLavaFly[] = [];
    
    public static particleAmount: number;
    protected readonly keyState: Record<string, boolean> = {};
    private going: boolean = false;

    private screenPos: Vector = {x: 0, y: 0};
    private mousePos: Vector = { x: 0, y: 0 };

    private constructGame(info: AllInfo) {
        this.platforms = info.platforms.map((platformInfo) => new ClientPlatform(this.config, platformInfo));
        this.playerActors = info.playerActors.map(
            (playerInfo) =>
                new ClientPlayerActor(
                    this.config,
                    playerInfo,
                    (this.id === playerInfo.id) ? true : false,
                    this.serverTalker
                ),
        );

        info.lavaFlies.forEach((lavaFlyInfo) => {
            let targetPlayer: ClientPlayerActor | undefined = undefined;
            this.playerActors.forEach((player) => {
                if (lavaFlyInfo.targetPlayerId == player.id) targetPlayer = player;
            });
            this.lavaFlies.push(new ClientLavaFly(
                this.config,
                lavaFlyInfo.id,
                lavaFlyInfo.position,
                lavaFlyInfo.team,
                lavaFlyInfo.health,
                lavaFlyInfo.momentum,
                targetPlayer,
                lavaFlyInfo.homePosition
            ))
        });
    }

    constructor(info: AllInfo, private readonly config: Config, private readonly id: number, private readonly serverTalker: ServerTalker, particleAmount: number) {
        Game.canvas.style.width = this.config.xSize + "px";
        Game.canvas.style.height = this.config.ySize + "px";
        Game.canvas.width = this.config.xSize;
        Game.canvas.height = this.config.ySize;
        Game.particleAmount = particleAmount / 100;

        this.constructGame(info);
        this.gamePlayer = this.findPlayer();

        this.serverTalker.messageHandler = (msg: ServerMessage) => {
            let player;
            switch (msg.type) {
                case "newPlayerActor":
                    this.playerActors.push(new ClientPlayerActor(
                            this.config,
                            msg.info,
                            false,
                            this.serverTalker
                        ),
                    );
                    break;
                case "serverPlayerJump" :
                    player = this.playerActors.find((player) => player.id === msg.id);
                    if (player && player !== this.gamePlayer) {
                        player.momentum = msg.momentum;
                        player.stutterCompensatePosition.x += -msg.position.x + player.position.x;
                        player.stutterCompensatePosition.y += -msg.position.y + player.position.y;
                        player.position = msg.position;
                        player.actionsNextFrame.jump = true;
                    }
                    break;
                case "serverPlayerMoveRight" :
                    player = this.playerActors.find((player) => player.id === msg.id);
                    if (player && player !== this.gamePlayer) {
                        player.momentum = msg.momentum;
                        player.stutterCompensatePosition.x += -msg.position.x + player.position.x;
                        player.stutterCompensatePosition.y += -msg.position.y + player.position.y;
                        player.position = msg.position;
                        player.actionsNextFrame.moveRight = true;
                    }
                    break;
                case "serverPlayerStopMoveRight" :
                    player = this.playerActors.find((player) => player.id === msg.id);
                    if (player && player !== this.gamePlayer) {
                        player.momentum = msg.momentum;
                        player.stutterCompensatePosition.x += -msg.position.x + player.position.x;
                        player.stutterCompensatePosition.y += -msg.position.y + player.position.y;
                        player.position = msg.position;
                        player.actionsNextFrame.moveRight = false;
                    }
                    break;
                case "serverPlayerMoveLeft" :
                    player = this.playerActors.find((player) => player.id === msg.id);
                    if (player && player !== this.gamePlayer) {
                        player.momentum = msg.momentum;
                        player.stutterCompensatePosition.x += -msg.position.x + player.position.x;
                        player.stutterCompensatePosition.y += -msg.position.y + player.position.y;
                        player.position = msg.position;
                        player.actionsNextFrame.moveLeft = true;
                    }
                    break;
                case "serverPlayerStopMoveLeft" :
                    player = this.playerActors.find((player) => player.id === msg.id);
                    if (player && player !== this.gamePlayer) {
                        player.momentum = msg.momentum;
                        player.stutterCompensatePosition.x += -msg.position.x + player.position.x;
                        player.stutterCompensatePosition.y += -msg.position.y + player.position.y;
                        player.position = msg.position;
                        player.actionsNextFrame.moveLeft = false;
                    }
                    break;
                case "newLavaFly":
                    this.lavaFlies.push(new ClientLavaFly(
                            this.config,
                            msg.id,
                            msg.position,
                            msg.team,
                            10,
                        ),
                    );
                    break;
                case "changeServerLavaFlyTarget" :
                    this.lavaFlies.forEach(lavaFly => {
                        if (lavaFly.id == msg.id) {
                            lavaFly.stutterCompensatePosition.x += -msg.position.x + lavaFly.position.x;
                            lavaFly.stutterCompensatePosition.y += -msg.position.y + lavaFly.position.y;

                            lavaFly.position = msg.position;
                            lavaFly.momentum = msg.momentum;
                            let target: PlayerActor | undefined = this.playerActors.find(player => player.id == msg.playerid);
                            lavaFly.targetPlayer = target;
                        }
                    })
                    break;
                case "info":
                    this.constructGame(msg.info);
                    break;
                /*case "serverPlayerActions":
                    player = this.players.find((player) => player.id === msg.id)!;
                    if (player && msg.id != this.id) {
                        player.actionsNextFrame.moveRight = msg.moveRight;
                        player.actionsNextFrame.moveLeft = msg.moveLeft;
                        player.actionsNextFrame.jump = msg.jump;
                        
                        player.focusPosition = msg.focusPosition;
                        player.position = msg.position;
                        player.health = msg.health;
                    }

                    break;*/
                case "playerLeaving":
                    this.playerActors = this.playerActors.filter((player) => player.id !== msg.id);
                    break;
                default:
                    throw new Error("Unrecognized message from server");
            }
            if (msg.type === "info") {
                this.constructGame(msg.info);
            }
        };

        // use onkeydown and onkeyup instead of addEventListener because it's possible to add multiple event listeners per event
        // This would cause a bug where each time you press a key it creates multiple blasts or jumps
        window.onmousedown = (e: MouseEvent) => this.onMouseDown(e);
        window.onmouseup = (e: MouseEvent) => this.onMouseUp(e);
        window.onkeydown = (e: KeyboardEvent) => this.onKeyDown(e);
        window.onkeyup = (e: KeyboardEvent) => this.onKeyUp(e);

        window.onmousemove = (e: MouseEvent) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        };
    }

    public start() {

        Game.menuDiv.style.display = "none";
        Game.gameDiv.style.display = "block";

        this.slideContainer.style.height = (window.innerHeight - 150) + "px";
        safeGetElementById("slider").style.width = this.config.xSize + "px";
        safeGetElementById("slider").style.left = this.screenPos.x + "px";

        this.going = true;
        window.requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    public end() {
        Game.gameDiv.style.display = "none";
        Game.menuDiv.style.display = "block";
        this.going = false;
        this.serverTalker.leave();
    }

    private lastFrame?: number;
    public loop(timestamp: number) {
        if (!this.lastFrame) {
            this.lastFrame = timestamp;
        }
        const elapsedTime = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;
        this.update(elapsedTime * this.config.gameSpeed);
        if (this.going) {
            window.requestAnimationFrame((timestamp) => this.loop(timestamp));
        }
    }

    private update(elapsedTime: number) {
        elapsedTime = Math.min(0.03, elapsedTime);//fix to make sure sudden lag spikes dont clip them through the floors\
        
        this.updateHTML();
        
        this.updateSliderX();
        this.updateSliderY();

        this.updateGamePlayerActions();
        
        this.updateObjects(elapsedTime);
        
        this.render();
    }

    private findPlayer() {
        const playerWithId = this.playerActors.find((player) => player.id === this.id);
        if (!playerWithId) {
            throw new Error("Player with my id does not exist in data from server");
        }
        return playerWithId;
    }

    private render() {
        Game.ctx.clearRect(0, 0, this.config.xSize, this.config.ySize);
        Game.ctx.fillStyle = "#2e3133";
        Game.ctx.fillRect(0, 0, this.config.xSize, this.config.ySize);
        Game.ctx.setTransform(1, 0, 0, 1, this.screenPos.x, this.screenPos.y);
        
        this.platforms.forEach((platform) => platform.render(Game.ctx));
        renderActors(Game.ctx, this.lavaFlies, this.playerActors);
    }

    private updateSliderX() {
        const windowWidth: number = window.innerWidth;

        //check if screen is bigger than field
        if (this.config.xSize < windowWidth) {
            this.screenPos.x = 0;
        } else {
            let temp = this.screenPos.x + (-this.gamePlayer.position.x + windowWidth / 2 - this.screenPos.x) / 10;
            //make a temp position to check where it would be updated to
            if (this.screenPos.x < temp + 0.1 && this.screenPos.x > temp - 0.1) {
                return; //so it's not updating even while idle
            }

            if (temp > 0) {
                // if they're too close to the left wall
                if (this.screenPos.x === 0) return;
                this.screenPos.x = 0;
            } else if (temp < -(this.config.xSize - windowWidth)) {
                // or the right wall
                if (this.screenPos.x === -(this.config.xSize - windowWidth)) return;
                this.screenPos.x = -(this.config.xSize - windowWidth);
            } else {
                this.screenPos.x = temp;// otherwise the predicted position is fine
            }
        }
    }

    private updateSliderY() {
        const windowHeight: number = window.innerHeight;

        //check if screen is bigger than field
        if (this.config.ySize < windowHeight) {
            this.screenPos.y = 0;//window.innerHeight - this.config.ySize;
        } else {
            let temp = this.screenPos.y + (-this.gamePlayer.position.y + windowHeight / 2 - this.screenPos.y) / 10;
            //make a temp position to check where it would be updated to
            if (this.screenPos.y < temp + 0.1 && this.screenPos.y > temp - 0.1) {
                return; //so it's not updating even while idle
            }

            if (temp > 0) {
                // if they're too close to the left wall
                if (this.screenPos.y === 0) return;
                this.screenPos.y = 0;
            } else if (temp < -(this.config.ySize - windowHeight)) {
                // or the right wall
                if (this.screenPos.y === -(this.config.ySize - windowHeight)) return;
                this.screenPos.y = -(this.config.ySize - windowHeight);
            } else {
                this.screenPos.y = temp; // otherwise the predicted position is fine
            }
        }
    }

    private updateHTML() {
        if (parseInt(this.slideContainer.style.height, 10) != window.innerHeight) this.slideContainer.style.height = (window.innerHeight) + "px";
    }

    private updateObjects(elapsedTime: number) {
        this.lavaFlies.forEach((lavaFly) => lavaFly.clientLavaFlyUpdate(elapsedTime, this.playerActors, this.lavaFlies));
        this.playerActors.forEach((player) => player.updateClientPlayerActor(elapsedTime, this.platforms, this.playerActors));
    }

    private updateGamePlayerActions() {

        //playerWithId.focusPosition.x = this.mousePos.x - this.screenPos.x;
        //playerWithId.focusPosition.y = this.mousePos.y - this.screenPos.y;


        if (this.keyState[this.config.playerKeys.up]) {
            this.gamePlayer.actionsNextFrame.jump = true;
            this.keyState[this.config.playerKeys.up] = false;//
        } else {
            this.gamePlayer.actionsNextFrame.jump = false;//
        }
        if (this.keyState[this.config.playerKeys.left]) {
            this.gamePlayer.actionsNextFrame.moveLeft = true;//
        } else {
            this.gamePlayer.actionsNextFrame.moveLeft = false;//
        }
        if (this.keyState[this.config.playerKeys.right]) {
            this.gamePlayer.actionsNextFrame.moveRight = true;//
        } else {
            this.gamePlayer.actionsNextFrame.moveRight = false;//
        }
    }

    private onMouseDown = onMouseDown;
    private onMouseUp = onMouseUp;
    private onKeyDown = onKeyDown;
    private onKeyUp = onKeyUp;
}
