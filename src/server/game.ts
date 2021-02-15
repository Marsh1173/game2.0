import { AllInfo } from "../api/allinfo";
import { getDefaultPlatformList, ServerPlatform } from "./platform";
import { ClientMessage, InfoMessage, PlayerLeavingMessage, ServerMessage } from "../api/message";
import { Vector } from "../vector";
import { Config } from "../config";
import { moveEmitHelpers } from "typescript";
import { ServerLavaFly } from "./serverActors/serverMobs/serverAirMobs/serverLavaFly";
import { getNextActorId } from "../objects/Actors/actor";
import { ServerPlayerActor } from "./serverActors/serverPlayers/serverPlayerActor";

export class Game {
    private intervalId?: NodeJS.Timeout;
    private static readonly REFRESH_RATE = 16;

    private lavaFlies: ServerLavaFly[] = [];
    private playerActors: ServerPlayerActor[] = [];
    private readonly platforms: ServerPlatform[] = getDefaultPlatformList(this.config);
    public static readonly clientMap: Record<number, (message: ServerMessage) => void> = {};
    public static broadcastMessage(msg: ServerMessage) {
        Object.values(Game.clientMap).forEach((sendFunction) => {
            sendFunction(msg);
        });
    }

    constructor(public readonly config: Config) {
    }

    public start() {
        this.newLavaFlyLoop();
        this.intervalId = setInterval(() => {
            this.loop(Date.now());
        }, Game.REFRESH_RATE);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        } else {
            throw new Error("Tried to stop a game that was not in progress");
        }
    }

    public allInfo(): AllInfo {
        return {
            lavaFlies: this.lavaFlies.map((lavaFly) => lavaFly.serialize()),
            playerActors: this.playerActors.map((player) => player.serialize()),
            platforms: this.platforms.map((platform) => platform.serialize()),
        };
    }

    private lastFrame?: number;
    public loop(timestamp: number) {
        if (!this.lastFrame) {
            this.lastFrame = timestamp;
        }
        const elapsedTime = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;
        this.update(elapsedTime * this.config.gameSpeed);
    }

    public update(elapsedTime: number) {
        this.updateObjects(elapsedTime);
        this.updateObjectsSecondary(elapsedTime);
    }

    private updateObjects(elapsedTime: number) {
        this.playerActors.forEach((player) => player.updateServerPlayerActor(elapsedTime, this.platforms, this.playerActors));
    }

    private updateObjectsSecondary(elapsedTime: number) {
        this.lavaFlies.forEach(lavaFly => lavaFly.serverLavaFlyUpdate(elapsedTime, this.playerActors, this.lavaFlies));
    }

    public newPlayer(id: number, name: string, color: string, position: Vector, team: number) {

        const newPlayer = new ServerPlayerActor(
            this.config,
            id,
            position,
            team,
            color,
            name,
        );
        this.playerActors.push(newPlayer);

        Game.broadcastMessage({
            type: "newPlayerActor",
            id: newPlayer.id,
            info: newPlayer.serialize()
        });
    }

    private newLavaFly(position: Vector) {
        let id = getNextActorId();
        const newLavaFly = new ServerLavaFly(
            this.config,
            id,
            position,
            0,
            10,
            {x: 0, y: 0}
        );
        this.lavaFlies.push(newLavaFly);

        Game.broadcastMessage({
            type: "newLavaFly",
            id: id,
            position: position,
            team: 0
        });
    }

    private newLavaFlyLoop() {
        for (let i: number = 0; i < 100; i++) {
            this.newLavaFly({x: Math.random() * 1700 + 1000, y: 700});
        }
        //setTimeout(() => this.newLavaFlyLoop(), 2000);
    }

    public removePlayer(id: number) {

        this.lavaFlies.forEach((lavaFly => {
            if(lavaFly.targetPlayer && lavaFly.targetPlayer.id == id) {
                lavaFly.targetPlayer = undefined;
                Game.broadcastMessage({
                    type: "changeServerLavaFlyTarget",
                    id: lavaFly.id,
                    position: lavaFly.position,
                    momentum: lavaFly.momentum,
                    playerid: undefined,
                });
            }
        }));
        this.playerActors = this.playerActors.filter((player) => player.id !== id);
        const leavingMessage: PlayerLeavingMessage = {
            type: "playerLeaving",
            id,
        };
        Game.broadcastMessage(leavingMessage);
    }

    public handleMessage(id: number, data: ClientMessage) {
        var player;
        switch (data.type) {
            case "clientPlayerJump" :
                Game.broadcastMessage({
                    type: "serverPlayerJump",
                    id: data.id,
                    position: data.position,
                    momentum: data.momentum
                });
                player = this.playerActors.find((player) => player.id === data.id);
                if (player) {
                    player.position = data.position;
                    player.momentum = data.momentum;
                    player.actionsNextFrame.jump = true;
                }
                break;
            case "clientPlayerMoveRight" :
                Game.broadcastMessage({
                    type: "serverPlayerMoveRight",
                    id: data.id,
                    position: data.position,
                    momentum: data.momentum
                });
                player = this.playerActors.find((player) => player.id === data.id);
                if (player) {
                    player.position = data.position;
                    player.momentum = data.momentum;
                    player.actionsNextFrame.moveRight = true;
                }
                break;
            case "clientPlayerStopMoveRight" :
                Game.broadcastMessage({
                    type: "serverPlayerStopMoveRight",
                    id: data.id,
                    position: data.position,
                    momentum: data.momentum
                });
                player = this.playerActors.find((player) => player.id === data.id);
                if (player) {
                    player.position = data.position;
                    player.momentum = data.momentum;
                    player.actionsNextFrame.moveRight = false;
                }
                break;
            case "clientPlayerMoveLeft" :
                Game.broadcastMessage({
                    type: "serverPlayerMoveLeft",
                    id: data.id,
                    position: data.position,
                    momentum: data.momentum
                });
                player = this.playerActors.find((player) => player.id === data.id);
                if (player) {
                    player.position = data.position;
                    player.momentum = data.momentum;
                    player.actionsNextFrame.moveLeft = true;
                }
                break;
            case "clientPlayerStopMoveLeft" :
                Game.broadcastMessage({
                    type: "serverPlayerStopMoveLeft",
                    id: data.id,
                    position: data.position,
                    momentum: data.momentum
                });
                player = this.playerActors.find((player) => player.id === data.id);
                if (player) {
                    player.position = data.position;
                    player.momentum = data.momentum;
                    player.actionsNextFrame.moveLeft = false;
                }
                break;
            /*case "clientPlayerActions" :
                Game.broadcastMessage({
                    type: "serverPlayerActions",
                    id: data.id,
                    moveRight: data.moveRight,
                    moveLeft: data.moveLeft,
                    jump: data.jump,

                    focusPosition: data.focusPosition,
                    position: data.position,
                    momentum: data.momentum,
                    health: data.health,
                });
                player = this.players.find((player) => player.id === id);
                if (player) {
                    player.actionsNextFrame.moveRight = data.moveRight;
                    player.actionsNextFrame.moveLeft = data.moveLeft;
                    player.actionsNextFrame.jump = data.jump;

                    player.focusPosition = data.focusPosition;
                    player.position = data.position;
                    player.health = data.health;
                }
                break;*/
            default:
                throw new Error(`Invalid client message type`);
            }
    }
}
