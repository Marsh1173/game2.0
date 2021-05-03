import { AllInfo } from "../api/allinfo";
import { ClientMessage, InfoMessage, PlayerLeavingMessage, ServerMessage } from "../api/message";
import { Vector } from "../vector";
import { Config } from "../config";
import { ServerFloor } from "../objects/terrain/floor/serverFloor";
import { ClassType, ServerPlayer } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { ServerSword } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverSword";
import { defaultActorConfig } from "../objects/newActors/actorConfig";
import { ServerDoodad } from "../objects/terrain/doodads/serverDoodad";
import { ServerDaggers } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverDaggers";
import { ServerHammer } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverHammer";

export class Game {
    private intervalId?: NodeJS.Timeout;
    private static readonly REFRESH_RATE = 16;

    public players: ServerPlayer[] = [];
    private floor: ServerFloor = new ServerFloor(this.config.xSize, this.config.ySize);
    private doodads: ServerDoodad[] = [];

    public static readonly clientMap: Record<number, (message: ServerMessage) => void> = {};
    public static broadcastMessage(msg: ServerMessage) {
        Object.values(Game.clientMap).forEach((sendFunction) => {
            sendFunction(msg);
        });
    }
    public static privateMessage(msg: ServerMessage, clientId: number) {
        Game.clientMap[clientId](msg);
    }

    constructor(public readonly config: Config) {
        this.doodads.push(new ServerDoodad({ x: 1000, y: this.floor.getYCoordAndAngle(1000).yCoord }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 1800, y: this.floor.getYCoordAndAngle(1800).yCoord }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 2700, y: this.floor.getYCoordAndAngle(2700).yCoord }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 3500, y: this.floor.getYCoordAndAngle(3500).yCoord }, 0, "rockLarge"));
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
            floor: this.floor.serialize(),
            doodads: this.doodads.map((doodad) => doodad.serialize()),
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

    public newPlayer(id: number, name: string, color: string, team: number, classType: ClassType, classLevel: number, classSpec: number) {
        if (classLevel < 3 || classSpec > 2) {
            classSpec = 0;
        }

        let newPlayer = this.createNewPlayer(id, name, color, team, classType, classLevel, classSpec);
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
                classLevel,
                classSpec,
            },
        });
    }

    public createNewPlayer(id: number, name: string, color: string, team: number, classType: ClassType, classLevel: number, classSpec: number): ServerPlayer {
        switch (classType) {
            case "sword":
                return new ServerSword(id, this.floor, this.doodads, color, name, classLevel, classSpec);
            case "daggers":
                return new ServerDaggers(id, this.floor, this.doodads, color, name, classLevel, classSpec); // SHOULD BE CHANGED TO DAGGERS
            case "hammer":
                return new ServerHammer(id, this.floor, this.doodads, color, name, classLevel, classSpec); // SHOULD BE CHANGED TO HAMMER
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
                if (data.actionType === "crouch") {
                    //private message testing
                    /*Game.privateMessage({
                        type: ""
                    }, data.playerId);*/
                }
                break;
            default:
                throw new Error(`Invalid client message type`);
        }
    }
}
