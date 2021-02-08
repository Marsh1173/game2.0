import { AllInfo } from "../api/allinfo";
import { getDefaultPlatformList, ServerPlatform } from "./platform";
import { ServerPlayer } from "./player";
import { ClientMessage, InfoMessage, PlayerLeavingMessage, ServerMessage } from "../api/message";
import { Vector } from "../vector";
import { Config } from "../config";
import { moveEmitHelpers } from "typescript";

export class Game {
    private intervalId?: NodeJS.Timeout;
    private static readonly REFRESH_RATE = 16;

    private players: ServerPlayer[] = [];
    private readonly platforms: ServerPlatform[] = getDefaultPlatformList(this.config);
    public static readonly clientMap: Record<number, (message: ServerMessage) => void> = {};
    public static broadcastMessage(msg: ServerMessage) {
        Object.values(Game.clientMap).forEach((sendFunction) => {
            sendFunction(msg);
        });
    }

    private aiId: number;
    public static itemId: number;

    constructor(public readonly config: Config) {
        Game.itemId = 0;
        this.aiId = -2;
    }

    public start() {
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
            players: this.players.map((player) => player.serialize()),
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
        this.players.forEach((player) => player.update(elapsedTime, this.players, this.platforms, false));

        this.platforms.forEach((platform) => platform.update());
    }

    private updateObjectsSecondary(elapsedTime: number) {

    }

    public newPlayer(id: number, name: string, color: string, position: Vector, team: number) {
        const newPlayer = new ServerPlayer(
            this.config,
            id,
            team,
            name,
            color,
            position,
        );
        this.players.push(newPlayer);
        newPlayer.position.x = (newPlayer.team === 1) ? newPlayer.config.playerStart.x : newPlayer.config.playerStart.x + 3300;
        newPlayer.position.y = newPlayer.config.playerStart.y;

        Game.broadcastMessage({
            type: "playerInfo",
            id: newPlayer.id,
            info: newPlayer.serialize()
        });
    }

    public removePlayer(id: number) {
        this.players = this.players.filter((player) => player.id !== id);
        const leavingMessage: PlayerLeavingMessage = {
            type: "playerLeaving",
            id,
        };
        Game.broadcastMessage(leavingMessage);
    }

    public handleMessage(id: number, data: ClientMessage) {
        var player;
        switch (data.type) {
            case "clientPlayerActions" :
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
                break;
            default:
                throw new Error(`Invalid client message type`);
            }
    }
}
