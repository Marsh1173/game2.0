import { AllInfo } from "../api/allinfo";
import { ClientMessage, InfoMessage, PlayerLeavingMessage, ServerMessage } from "../api/message";
import { Vector } from "../vector";
import { Config } from "../config";
import { ActorType, getNextActorId } from "../objects/Actors/actor";
import { getDefaultGroundPlatform, ServerGroundPlatform } from "./groundPlatform";
import { ServerFloor } from "../object/terrain/floor/serverFloor";
import { ClassType, ServerPlayer } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { ServerSword } from "../object/newActors/serverActors/serverPlayer/serverClasses/serverSword";
import { defaultActorConfig } from "../object/newActors/actorConfig";

export class Game {
    private intervalId?: NodeJS.Timeout;
    private static readonly REFRESH_RATE = 16;

    public players: ServerPlayer[] = [];
    private floor: ServerFloor = new ServerFloor(this.config.xSize, this.config.ySize);

    public static readonly clientMap: Record<number, (message: ServerMessage) => void> = {};
    public static broadcastMessage(msg: ServerMessage) {
        Object.values(Game.clientMap).forEach((sendFunction) => {
            sendFunction(msg);
        });
    }

    constructor(public readonly config: Config) {}

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
            floor: this.floor.serialize(),
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
        if (this.players.length === 0) {
            return;
        }

        this.updateObjects(elapsedTime);
    }

    private updateObjects(elapsedTime: number) {
        this.players.forEach((player) => player.update(elapsedTime));
    }

    public newPlayer(id: number, name: string, color: string, team: number, classType: ClassType) {
        let newPlayer = this.createNewPlayer(id, name, color, team, classType, this.floor);
        this.players.push(newPlayer);

        Game.broadcastMessage({
            type: "playerJoin",
            playerInfo: {
                id,
                class: classType,
                position: defaultActorConfig.playerStart,
                momentum: { x: 0, y: 0 },
                health: defaultActorConfig.playerMaxHealth,
                name,
                color,
            },
        });
    }

    public createNewPlayer(id: number, name: string, color: string, team: number, classType: ClassType, floorPtr: ServerFloor): ServerPlayer {
        switch (classType) {
            case "sword":
                return new ServerSword(id, floorPtr, color, name);
            case "daggers":
                return new ServerSword(id, floorPtr, color, name); // SHOULD BE CHANGED TO DAGGERS
            case "hammer":
                return new ServerSword(id, floorPtr, color, name); // SHOULD BE CHANGED TO HAMMER
            default:
                throw new Error("unknown player class type " + classType);
        }
    }

    public removePlayer(id: number) {
        this.players = this.players.filter((player) => player.getActorId() !== id);
        Game.broadcastMessage({
            type: "playerLeave",
            id,
        });
    }

    public handleMessage(id: number, data: ClientMessage) {
        var player;
        switch (data.type) {
            case "clientPlayerAction":
                Game.broadcastMessage({
                    type: "serverPlayerAction",
                    actionType: data.actionType,
                    starting: data.starting,
                    playerId: data.playerId,
                    position: data.position,
                    momentum: data.momentum,
                });
                player = this.players.find((player) => player.getActorId() === data.playerId);
                if (player) {
                    player.updatePositionAndMomentum(data.momentum, data.position);
                    player.actionsNextFrame[data.actionType] = data.starting;
                }
                break;
            default:
                throw new Error(`Invalid client message type`);
        }
    }
}
